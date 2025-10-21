import {
  USDC,
  SolverTransaction,
  Intent,
  DailyStats,
  GlobalStats,
} from "generated";

const SOLVER_ADDRESS = "0x247365225B96Cd8bc078F7263F6704f3EaD96494".toLowerCase();
const USDC_DECIMALS = 6;

function formatUSDC(value: bigint): number {
  return Number(value) / Math.pow(10, USDC_DECIMALS);
}

function getDateString(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split('T')[0];
}

/**
 * Handler for USDC Transfer events
 * Tracks all transfers involving the Nexus Solver
 */
USDC.Transfer.handler(async ({ event, context }) => {
  const from = event.params.from.toLowerCase();
  const to = event.params.to.toLowerCase();
  const value = event.params.value;

  // Filter: Only process if solver is involved
  const isFromSolver = from === SOLVER_ADDRESS;
  const isToSolver = to === SOLVER_ADDRESS;

  if (!isFromSolver && !isToSolver) {
    return;
  }

  // Extract event data
  const chainId = event.chainId;
  const logIndex = event.logIndex;
  const tokenAddress = event.srcAddress;
  const blockNumber = BigInt(event.block.number);
  const blockTimestamp = BigInt(event.block.timestamp);
  
  // Transaction fields (requires field_selection in config)
  const txHash = event.transaction.hash;
  const gasUsed = event.transaction.gasUsed || 0n;
  const gasPrice = event.transaction.gasPrice || 0n;

  // ✅ CRITICAL FIX: Calculate userAddress
  // If solver sent money → user is recipient (to)
  // If solver received money → user is sender (from)
  const userAddress = isFromSolver ? to : from;

  // Generate unique ID
  const transactionId = `${chainId}-${txHash}-${logIndex}`;

  // Create SolverTransaction entity with ALL required fields
  const solverTransaction: SolverTransaction = {
    id: transactionId,
    chainId,
    txHash,
    blockNumber,
    blockTimestamp,
    logIndex,
    tokenAddress,
    from,
    to,
    value,
    valueUSD: formatUSDC(value),
    isFromSolver,
    isToSolver,
    solverAddress: SOLVER_ADDRESS,
    userAddress, // ✅ ADDED: Required field for wallet search
    intentId: undefined,
    gasUsed,
    gasPrice,
    createdAt: blockTimestamp,
  };

  context.SolverTransaction.set(solverTransaction);

  // Update aggregated stats
  await updateDailyStats(context, chainId, blockTimestamp, value, isFromSolver, isToSolver);
  await updateGlobalStats(context, value, blockTimestamp, chainId, blockNumber);

  // Enhanced logging
  context.log.info(
    `✅ Indexed: Chain ${chainId} | TX ${txHash.slice(0, 10)}... | User ${userAddress.slice(0, 8)}... | ${formatUSDC(value)} USDC`
  );
});

async function updateDailyStats(
  context: any,
  chainId: number,
  timestamp: bigint,
  value: bigint,
  isFromSolver: boolean,
  isToSolver: boolean
) {
  const dateString = getDateString(Number(timestamp));
  const statsId = `${chainId}-${dateString}`;

  let stats = await context.DailyStats.get(statsId);

  if (!stats) {
    stats = {
      id: statsId,
      chainId,
      date: dateString,
      totalTransactions: 0n,
      totalVolumeUSD: 0,
      outgoingTransactions: 0n,
      incomingTransactions: 0n,
      uniqueAddresses: 0,
      lastUpdated: timestamp,
    };
  }

  stats.totalTransactions += 1n;
  stats.totalVolumeUSD += formatUSDC(value);
  stats.lastUpdated = timestamp;

  if (isFromSolver) stats.outgoingTransactions += 1n;
  if (isToSolver) stats.incomingTransactions += 1n;
  stats.uniqueAddresses += 1;

  context.DailyStats.set(stats);
}

async function updateGlobalStats(
  context: any,
  value: bigint,
  timestamp: bigint,
  chainId: number,
  blockNumber: bigint
) {
  const GLOBAL_STATS_ID = "1";
  let globalStats = await context.GlobalStats.get(GLOBAL_STATS_ID);

  if (!globalStats) {
    globalStats = {
      id: GLOBAL_STATS_ID,
      totalTransactions: 0n,
      totalVolumeUSD: 0,
      uniqueAddresses: 0,
      lastIndexedBlocks: "{}",
      lastUpdated: timestamp,
    };
  }

  globalStats.totalTransactions += 1n;
  globalStats.totalVolumeUSD += formatUSDC(value);
  globalStats.lastUpdated = timestamp;

  let blockMap: Record<string, number> = {};
  try {
    blockMap = JSON.parse(globalStats.lastIndexedBlocks);
  } catch (e) {
    blockMap = {};
  }
  blockMap[chainId.toString()] = Number(blockNumber);
  globalStats.lastIndexedBlocks = JSON.stringify(blockMap);

  context.GlobalStats.set(globalStats);
}