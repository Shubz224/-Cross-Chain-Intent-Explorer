// This file handles ONLY V2 events (current)
// Separated from V1 to prevent type generation conflicts

import { VaultContractV2 } from "generated";

// ============================================
// V2 HANDLERS (Current version with gasRefunded)
// ============================================

VaultContractV2.Deposit.handler(async ({ event, context }: any) => {
  const entity = {
    id: `${event.chainId}-${event.transaction.hash}-${event.logIndex}`,
    requestHash: event.params.requestHash,
    depositor: event.params.from.toLowerCase(),
    gasRefunded: event.params.gasRefunded,
    chainId: event.chainId,
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
    txHash: event.transaction.hash,
  };

  context.DepositEvent.set(entity);
});

VaultContractV2.Fill.handler(async ({ event, context }: any) => {
  const entity = {
    id: `${event.chainId}-${event.transaction.hash}-${event.logIndex}`,
    requestHash: event.params.requestHash,
    from: event.params.from.toLowerCase(),
    solver: event.params.solver.toLowerCase(),
    chainId: event.chainId,
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
    txHash: event.transaction.hash,
  };

  context.FillEvent.set(entity);
});

VaultContractV2.Settle.handler(async ({ event, context }: any) => {
  const entity = {
    id: `${event.chainId}-${event.transaction.hash}-${event.logIndex}`,
    nonce: event.params.nonce.toString(),
    solvers: event.params.solver.map((s: any) => s.toLowerCase()),
    tokens: event.params.token.map((t: any) => t.toLowerCase()),
    amounts: event.params.amount.map((a: any) => a.toString()),
    chainId: event.chainId,
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
    txHash: event.transaction.hash,
  };

  context.SettleEvent.set(entity);
});
