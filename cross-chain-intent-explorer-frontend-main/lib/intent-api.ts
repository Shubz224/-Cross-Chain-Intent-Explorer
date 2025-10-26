import type { IntentData, RequestForFunds, DepositEvent, FillEvent, SettlementEvent, SettlementMatch } from "./types"

const ARCANA_API = "https://cosmos04-dev.arcana.network/xarchain/chainabstraction/request_for_funds"
const INDEXER_API = "https://indexer.dev.hyperindex.xyz/c72c788/v1/graphql"

// Decode base64 to Ethereum address (20 bytes, last 40 hex chars)
function decodeBase64ToAddress(b64: string): string {
  try {
    const bytes = Buffer.from(b64, "base64")
    const hex = bytes.toString("hex")
    const addr = "0x" + hex.slice(-40)
    return addr
  } catch (error) {
    console.error("Error decoding address:", error)
    return b64
  }
}

// Decode base64 to full hash (32 bytes)
function decodeBase64ToHash(b64: string): string {
  try {
    const bytes = Buffer.from(b64, "base64")
    const hex = bytes.toString("hex")
    return "0x" + hex
  } catch (error) {
    console.error("Error decoding hash:", error)
    return b64
  }
}

// Decode base64 to number (for chainID, value, etc.)
function decodeBase64ToNumber(b64: string): string {
  try {
    const bytes = Buffer.from(b64, "base64")
    const hex = bytes.toString("hex")
    // Convert hex to decimal
    const decimal = BigInt("0x" + hex).toString()
    return decimal
  } catch (error) {
    console.error("Error decoding number:", error)
    return b64
  }
}

async function fetchRequestForFunds(intentId: string): Promise<RequestForFunds> {
  const response = await fetch(`${ARCANA_API}/${intentId}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch request for funds: ${response.statusText}`)
  }
  const data = await response.json()
  return data.requestForFunds
}

async function fetchDepositAndFillEvents(
  requestHash: string,
): Promise<{ deposits: DepositEvent[]; fills: FillEvent[] }> {
  const query = `
    query CheckIntent150($requestHash: String!) {
      deposit: DepositEvent(where: { requestHash: { _eq: $requestHash } }) {
        depositor
        chainId
        timestamp
        txHash
      }
      fill: FillEvent(where: { requestHash: { _eq: $requestHash } }) {
        solver
        from
        chainId
        timestamp
        txHash
      }
    }
  `

  const response = await fetch(INDEXER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { requestHash },
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.statusText}`)
  }

  const result = await response.json()

  if (result.errors) {
    console.error("GraphQL errors:", result.errors)
    return { deposits: [], fills: [] }
  }

  return {
    deposits: result.data?.deposit || [],
    fills: result.data?.fill || [],
  }
}

async function fetchSettlementCandidates(
  timeWindowStart: number,
  timeWindowEnd: number,
): Promise<SettlementEvent[]> {
  const query = `
    query GetSettlementCandidates(
      $timeWindowStart: Int!,
      $timeWindowEnd: Int!
    ) {
      settlements: SettleEvent(
        where: {
          timestamp: { _gte: $timeWindowStart, _lte: $timeWindowEnd }
        },
        order_by: { timestamp: asc }
      ) {
        id
        nonce
        solvers
        tokens
        amounts
        chainId
        blockNumber
        timestamp
        txHash
      }
    }
  `

  const response = await fetch(INDEXER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { timeWindowStart, timeWindowEnd },
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch settlement candidates: ${response.statusText}`)
  }

  const result = await response.json()

  if (result.errors) {
    console.error("GraphQL errors:", result.errors)
    return []
  }

  return result.data?.settlements || []
}

function calculateSettlementConfidence(
  settlement: SettlementEvent,
  intentData: IntentData,
  fillData: FillEvent,
  depositData: DepositEvent,
): SettlementMatch {
  let points = 0
  const maxPoints = 100

  // Calculate time delta (most important - 40 points)
  const timeDelta = settlement.timestamp - (intentData.filledAt || 0)
  const timeDeltaPoints = Math.max(0, 40 - (timeDelta / 60)) // Lose 1 point per minute
  points += Math.max(0, timeDeltaPoints)

  // Time match - within 20 minutes (15 points)
  const timeMatch = timeDelta <= 1200 // 20 minutes
  if (timeMatch) {
    points += 15
  }

  // Chain match (25 points)
  const chainMatch = settlement.chainId === fillData.chainId
  if (chainMatch) {
    points += 25
  }

  // Amount match (15 points) - within 15% tolerance
  let amountMatch = false
  if (intentData.destinations && intentData.destinations.length > 0) {
    const expectedAmount = BigInt(intentData.destinations[0].value)
    const settlementAmounts = settlement.amounts.map(a => {
      try {
        return BigInt(a)
      } catch {
        return BigInt(0)
      }
    })
    
    for (const settlementAmount of settlementAmounts) {
      const difference = expectedAmount > settlementAmount 
        ? expectedAmount - settlementAmount 
        : settlementAmount - expectedAmount
      const percentDiff = Number(difference * BigInt(100) / expectedAmount)
      
      if (percentDiff <= 15) {
        amountMatch = true
        points += 15
        break
      }
    }
  }

  // Token match (5 points)
  let tokenMatch = false
  if (intentData.destinations && intentData.destinations.length > 0) {
    const expectedToken = intentData.destinations[0].tokenAddress.toLowerCase()
    tokenMatch = settlement.tokens.some(t => t.toLowerCase() === expectedToken)
    if (tokenMatch) {
      points += 5
    }
  }

  const confidence = Math.min(100, (points / maxPoints) * 100)

  return {
    settlement,
    confidence,
    reasons: {
      timeDelta,
      timeMatch,
      chainMatch,
      amountMatch,
      tokenMatch,
    },
  }
}

export async function fetchSettlementMatches(
  intentData: IntentData,
  requestHash: string,
): Promise<SettlementMatch[]> {
  // If not settled, return empty array
  if (!intentData.settled || !intentData.filledAt) {
    return []
  }

  // Create 60-minute window from filled time
  const timeWindowStart = intentData.filledAt
  const timeWindowEnd = intentData.filledAt + (60 * 60) // 60 minutes

  try {
    // Fetch settlement candidates
    const settlements = await fetchSettlementCandidates(timeWindowStart, timeWindowEnd)

    // We need the fill and deposit data for matching
    const { deposits, fills } = await fetchDepositAndFillEvents(requestHash)
    const deposit = deposits[0]
    const fill = fills[0]

    if (!fill || !deposit) {
      return []
    }

    // Calculate confidence for each settlement
    const matches = settlements.map(settlement => 
      calculateSettlementConfidence(settlement, intentData, fill, deposit)
    )

    // Sort by confidence (highest first)
    matches.sort((a, b) => b.confidence - a.confidence)

    return matches
  } catch (error) {
    console.error("Error fetching settlement matches:", error)
    return []
  }
}

export async function fetchIntentData(intentId: string): Promise<IntentData> {
  try {
    // Fetch request for funds
    const requestForFunds = await fetchRequestForFunds(intentId)

    // Decode hash to get request hash for querying events
    const requestHash = requestForFunds.signatureData[0]?.hash
    if (!requestHash) {
      throw new Error("No signature data found")
    }

    const decodedRequestHash = decodeBase64ToHash(requestHash)

    // Fetch deposit and fill events
    const { deposits, fills } = await fetchDepositAndFillEvents(decodedRequestHash)

    // Build intent data
    const deposit = deposits[0]
    const fill = fills[0]

    // Decode sources
    const decodedSources = requestForFunds.sources.map((source) => ({
      ...source,
      chainID: decodeBase64ToNumber(source.chainID),
      tokenAddress: decodeBase64ToAddress(source.tokenAddress),
      value: decodeBase64ToNumber(source.value),
      collectionFeeRequired: source.collectionFeeRequired, // Keep as is
    }))

    // Decode destinations
    const decodedDestinations = requestForFunds.destinations.map((destination) => ({
      tokenAddress: decodeBase64ToAddress(destination.tokenAddress),
      value: decodeBase64ToNumber(destination.value),
    }))

    const intentData: IntentData = {
      requestId: requestForFunds.id,
      user: requestForFunds.user, // This is already a bech32 address from Arcana
      nonce: requestForFunds.nonce, // Keep nonce as string
      expiry: Number.parseInt(requestForFunds.expiry.toString()),
      sources: decodedSources,
      destinationChainID: decodeBase64ToNumber(requestForFunds.destinationChainID),
      destinationUniverse: requestForFunds.destinationUniverse,
      destinations: decodedDestinations,
      deposited: requestForFunds.deposited,
      fulfilled: requestForFunds.fulfilled,
      settled: requestForFunds.settled,
      refunded: requestForFunds.refunded,
      createdAt: Number.parseInt(requestForFunds.creationBlock),
      depositedAt: deposit?.timestamp || null,
      filledAt: fill?.timestamp || null,
      settledAt: requestForFunds.settled ? fill?.timestamp || null : null,
      refundedAt: requestForFunds.refunded ? fill?.timestamp || null : null,
      depositor: deposit?.depositor || null, // Already decoded from indexer
      depositTxHash: deposit?.txHash || null, // Already decoded from indexer
      solver: fill?.solver || null, // Already decoded from indexer
      fillTxHash: fill?.txHash || null, // Already decoded from indexer
    }

    return intentData
  } catch (error) {
    console.error("Error fetching intent data:", error)
    throw error
  }
}
