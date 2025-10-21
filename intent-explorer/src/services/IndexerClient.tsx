const INDEXER_ENDPOINT = import.meta.env.VITE_INDEXER_ENDPOINT;

export class IndexerClient {
  async getTransactionsByWallet(walletAddress: string) {
    const query = `
      query GetWalletTransactions($wallet: String!) {
        SolverTransaction(
          where: { userAddress: { _eq: $wallet } }
          order_by: { blockTimestamp: desc }
        ) {
          id
          chainId
          txHash
          blockTimestamp
          valueUSD
          from
          to
          isFromSolver
          gasUsed
          gasPrice
          intentId
        }
      }
    `;
    const response = await fetch(INDEXER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { wallet: walletAddress.toLowerCase() }
      }),
    });
    const result = await response.json();
    return result.data?.SolverTransaction || [];
  }

  async getTransactionByHash(txHash: string) {
    const query = `
      query GetTransactionByHash($hash: String!) {
        SolverTransaction(
          where: { txHash: { _eq: $hash } }
          limit: 1
        ) {
          id
          chainId
          txHash
          blockTimestamp
          valueUSD
          from
          to
          isFromSolver
          gasUsed
          gasPrice
          intentId
        }
      }
    `;
    const response = await fetch(INDEXER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { hash: txHash.toLowerCase() }
      }),
    });
    const result = await response.json();
    return result.data?.SolverTransaction?.[0] || null;
  }
}

export const indexerClient = new IndexerClient();
