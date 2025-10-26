export interface Source {
  universe: string
  chainID: string
  tokenAddress: string
  value: string
  status: string
  collectionFeeRequired: string
}

export interface Destination {
  tokenAddress: string
  value: string
}

export interface SignatureData {
  universe: string
  address: string
  signature: string
  hash: string
}

export interface RequestForFunds {
  id: string
  sources: Source[]
  destinationChainID: string
  destinations: Destination[]
  nonce: string
  expiry: number
  destinationUniverse: string
  signatureData: SignatureData[]
  user: string
  fulfilledBy: string | null
  fulfilledAt: string
  deposited: boolean
  fulfilled: boolean
  settled: boolean
  refunded: boolean
  creationBlock: string
}

export interface DepositEvent {
  depositor: string
  chainId: number
  timestamp: number
  txHash: string
}

export interface FillEvent {
  solver: string
  from: string
  chainId: number
  timestamp: number
  txHash: string
}

export interface IntentData {
  requestId: string
  user: string
  nonce: string
  expiry: number
  sources: Source[]
  destinationChainID: string
  destinationUniverse: string
  destinations: Destination[]
  deposited: boolean
  fulfilled: boolean
  settled: boolean
  refunded: boolean
  createdAt: number
  depositedAt: number | null
  filledAt: number | null
  settledAt: number | null
  refundedAt: number | null
  depositor: string | null
  depositTxHash: string | null
  solver: string | null
  fillTxHash: string | null
}

export interface SettlementEvent {
  id: string
  nonce: string
  solvers: string[]
  tokens: string[]
  amounts: string[]
  chainId: number
  blockNumber: number
  timestamp: number
  txHash: string
}

export interface SettlementMatch {
  settlement: SettlementEvent
  confidence: number
  reasons: {
    timeDelta: number // seconds from fill to settlement
    timeMatch: boolean // within 10 minutes
    chainMatch: boolean
    amountMatch: boolean
    tokenMatch: boolean
  }
}
