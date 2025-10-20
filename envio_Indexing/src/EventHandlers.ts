import {
  USDC,
  SolverTransaction,
  Intent,
  DailyStats,
  GlobalStats,
} from "generated";

// Nexus Solver address
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
 * Uses ONLY default fields available without field_selection
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

  // DEFAULT FIELDS ONLY (no field_selection needed)
  const chainId = event.chainId;                              // ✅ Default
  const logIndex = event.logIndex;                            // ✅ Default
  const tokenAddress = event.srcAddress;                      // ✅ Default
  const blockNumber = BigInt(event.block.number);             // ✅ Default
  const blockTimestamp = BigInt(event.block.timestamp);       // ✅ Default
  const blockHash = event.block.hash;                         // ✅ Default

  // Generate unique ID using block hash + log index (since no tx hash available)
  const transactionId = `${chainId}-${blockHash}-${logIndex}`;

  // Create SolverTransaction entity
  const solverTransaction: SolverTransaction = {
    id: transactionId,
    chainId,
    txHash: blockHash,  // Using block hash as fallback since tx hash not available
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
    intentId: undefined,
    gasUsed: 0n,  // Not available without field_selection
    gasPrice: 0n, // Not available without field_selection
    createdAt: blockTimestamp,
  };

  context.SolverTransaction.set(solverTransaction);

  // Update stats
  await updateDailyStats(context, chainId, blockTimestamp, value, isFromSolver, isToSolver, from, to);
  await updateGlobalStats(context, value, blockTimestamp, chainId, blockNumber);

  // Log
  context.log.info(
    `Indexed solver tx: ${chainId} | Block ${blockNumber} | ${formatUSDC(value)} USDC`
  );
});

async function updateDailyStats(
  context: any,
  chainId: number,
  timestamp: bigint,
  value: bigint,
  isFromSolver: boolean,
  isToSolver: boolean,
  from: string,
  to: string
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
