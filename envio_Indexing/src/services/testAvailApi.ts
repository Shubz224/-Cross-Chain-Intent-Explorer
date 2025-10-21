import { availApi } from './AvailApiClient';

async function test() {
  console.log('🧪 Testing Avail REST API...\n');

  // Test with real transaction hashes from your data
  const testHashes = [
    '0x600e26ab0cc8f70498ddf8384d6499bec3593770cd6ec2898a78ed214f0a16d5',
    '0xea91b66f5d88bb6467f656162a8ab63bf5e187b5b89e5393d3935494cdf3e864',
    '0x87c149e9ecaffdbead8ffd32f0a0efe33ff1b5f688fe41d7c422e6efcea38308'
  ];

  console.log(`Testing ${testHashes.length} transaction hashes...\n`);

  for (const hash of testHashes) {
    const status = await availApi.getTransactionStatus(hash);
    if (status) {
      console.log(`✅ Intent found for ${hash.slice(0, 10)}...`);
      console.log(`   Intent ID: ${status.intentId || 'N/A'}`);
      console.log(`   Status: ${status.status || 'N/A'}\n`);
    } else {
      console.log(`⚠️  No intent data for ${hash.slice(0, 10)}... (not a Nexus intent)\n`);
    }
  }

  // Test batch fetching
  console.log('\n🚀 Testing batch fetch...');
  const results = await availApi.batchGetTransactionStatuses(testHashes);
  console.log(`Found ${results.size} intents out of ${testHashes.length} transactions`);
}

test().catch(console.error);
