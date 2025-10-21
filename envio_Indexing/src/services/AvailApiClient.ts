// src/services/AvailApiClient.ts
import fetch from 'node-fetch';

const BASE = 'https://explorer.nexus-folly.availproject.org/api';

export class AvailApiClient {
  async getTransactionStatus(txHash: string): Promise<any|null> {
    try {
      const res = await fetch(`${BASE}/tx_status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash }),
      });
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`API ${res.status}`);
      }
      return res.json();
    } catch (e) {
      console.error('Status API error:', e);
      return null;
    }
  }

  async batchGetTransactionStatuses(hashes: string[]) {
    const results = new Map<string, any>();
    for (const h of hashes) {
      const status = await this.getTransactionStatus(h);
      if (status) results.set(h, status);
    }
    return results;
  }
}

export const availApi = new AvailApiClient();
