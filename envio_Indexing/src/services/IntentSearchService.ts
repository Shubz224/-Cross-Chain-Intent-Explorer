import { Buffer } from 'buffer';
import axios from 'axios';

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';
const API_ENDPOINT = 'https://cosmos04-dev.arcana.network/xarchain/chainabstraction/request_for_funds';

function decodeNonceFromApi(base64Nonce: string): string {
  const hex = Buffer.from(base64Nonce, 'base64').toString('hex');
  return '0x' + hex;
}

export async function searchIntentByApiId(apiId: string): Promise<any> {
  try {
    const apiResponse = await axios.get(API_ENDPOINT);
    const { requestForFunds } = apiResponse.data;
    const rff = requestForFunds.find((item: any) => item.id === apiId);
    if (!rff) return null;
    const nonce = decodeNonceFromApi(rff.nonce);
    return await searchIntentByNonce(nonce);
  } catch (error) {
    console.error(`Error searching intent ${apiId}:`, error);
    throw error;
  }
}

export async function searchIntentByRequestHash(requestHash: string): Promise<any> {
  const query = `
    query {
      intent(id: "${requestHash.toLowerCase()}") {
        id
        nonce
        user
        status
        solver
        createdAt
        fulfilledAt
        settledAt
        sourceChainCount
        destinationChainId
        deposits {
          chainId
          txHash
          from
          blockNumber
          blockTimestamp
        }
        fulfillments {
          chainId
          txHash
          solver
          blockNumber
          blockTimestamp
        }
        settlements {
          nonce
          solvers
          tokens
          amounts
          txHash
          blockTimestamp
        }
      }
    }
  `;
  
  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  return response.data.data.intent;
}

export async function searchIntentByNonce(nonce: string): Promise<any> {
  const query = `
    query {
      intents(where: { nonce: "${nonce.toLowerCase()}" }, limit: 1) {
        id
        nonce
        user
        status
        solver
        createdAt
        fulfilledAt
        settledAt
        sourceChainCount
        destinationChainId
        deposits { chainId txHash from blockTimestamp }
        fulfillments { chainId txHash solver blockTimestamp }
        settlements { nonce solvers amounts txHash blockTimestamp }
      }
    }
  `;
  
  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  const intents = response.data.data.intents;
  return intents.length > 0 ? intents[0] : null;
}

export async function getIntentsByUser(userAddress: string, limit: number = 50): Promise<any[]> {
  const query = `
    query {
      intents(
        where: { user: "${userAddress.toLowerCase()}" }
        orderBy: "createdAt"
        orderDirection: "desc"
        limit: ${limit}
      ) {
        id
        nonce
        status
        solver
        createdAt
        fulfilledAt
        settledAt
        sourceChainCount
      }
    }
  `;
  
  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  return response.data.data.intents;
}

export async function getIntentsBySolver(solverAddress: string, limit: number = 50): Promise<any[]> {
  const query = `
    query {
      intents(
        where: { solver: "${solverAddress.toLowerCase()}" }
        orderBy: "fulfilledAt"
        orderDirection: "desc"
        limit: ${limit}
      ) {
        id
        nonce
        user
        status
        createdAt
        fulfilledAt
        settledAt
        sourceChainCount
      }
    }
  `;
  
  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  return response.data.data.intents;
}

export async function getRecentIntents(limit: number = 20): Promise<any[]> {
  const query = `
    query {
      intents(
        orderBy: "createdAt"
        orderDirection: "desc"
        limit: ${limit}
      ) {
        id
        nonce
        user
        status
        solver
        createdAt
        sourceChainCount
      }
    }
  `;
  
  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  return response.data.data.intents;
}

export async function getGlobalStats(): Promise<any> {
  const query = `
    query {
      intentStats(id: "global") {
        totalIntents
        totalFulfilled
        totalSettled
        avgFulfillmentTime
        totalUsers
        totalSolvers
        updatedAt
      }
    }
  `;
  
  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  return response.data.data.intentStats;
}

export async function getUserStats(userAddress: string): Promise<any> {
  const query = `
    query {
      userStats(id: "${userAddress.toLowerCase()}") {
        intentsCreated
        intentsFulfilled
        totalVolume
        firstIntentBlock
        lastIntentBlock
      }
    }
  `;
  
  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  return response.data.data.userStats;
}

export async function getSolverStats(solverAddress: string): Promise<any> {
  const query = `
    query {
      solverStats(id: "${solverAddress.toLowerCase()}") {
        intentsFulfilled
        totalEarned
        firstFulfillmentBlock
        lastFulfillmentBlock
      }
    }
  `;
  
  const response = await axios.post(GRAPHQL_ENDPOINT, { query });
  return response.data.data.solverStats;
}
