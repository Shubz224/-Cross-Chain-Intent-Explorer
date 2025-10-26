# IntentScan: Cross-Chain Intent Lifecycle Explorer

IntentScan is a production-ready explorer that enables comprehensive, real-time tracking and debugging of cross-chain intents built on the Avail Nexus SDK. By leveraging Envio HyperIndex and HyperSync for ultra-fast, multi-chain event indexing alongside probabilistic settlement matching, IntentScan provides developers and users with full visibility into the lifecycle of cross-chain transactions across multiple EVM testnets.

---

## Table of Contents

- [Overview](#overview)  
- [Problem Statement](#problem-statement)  
- [Solution](#solution)  
- [Architecture](#architecture)  
- [Key Features](#key-features)  
- [Technical Stack](#technical-stack)  
- [Deployment](#deployment)  
- [Why This Matters](#why-this-matters)  
- [Roadmap](#roadmap)  
- [License](#license)  
- [Credits](#credits)  

---

## Overview  

IntentScan empowers developers building with the Avail Nexus SDK by providing a single pane of glass to visualize the full lifecycle of cross-chain intents:
- Intent creation on source chain (Deposit)
- Execution on destination chain (Fill)
- Settlement and reimbursement outcomes  
- Refund status and timing  

Unlike existing explorers that only show partial states, IntentScan correlates off-chain intent metadata with on-chain blockchain events across 6 EVM testnets in real time.

---

## Problem Statement  

Cross-chain intents are inherently multi-step, spanning different blockchains and often involving batch settlement processes. Developers face significant challenges and pain points:
- Lack of visibility into each stage of execution  
- No easy debugging tools for intent failure causes  
- Complex correlating deposited funds, fills, settlements, and refunds manually  
- Existing explorers provide only binary settled/not-settled states without actionable insight  
- Lost settlement linkage due to batch processing of settlements  

This complexity severely limits adoption and developer confidence in Avail Nexus.

---

## Solution  

IntentScan solves these challenges through:  

- **Real-time indexing** of Deposit, Fill, and Settle events using Envio HyperIndex across 6 testnets  
- **Probabilistic matching algorithm** correlating batch Settle events to individual intents with 95%+ accuracy based on solver identity, timestamp proximity, token, and amount  
- **Full lifecycle visualization** with transaction hash proofs and rich metadata  
- **Base64-to-requestHash decoding** pipeline bridging Avail's off-chain Cosmos SDK intent registry with on-chain EVM event data  
- **Open GraphQL API** powered by Hasura for flexible queries and integrations  
- **Responsive React UI** displaying timeline views, cross-chain routes, and confidence metrics  

---

## Architecture  

### Components  

1. **Envio HyperIndex:**  
   - Multi-chain unordered indexer capturing lifecycle events on Arbitrum Sepolia, Optimism Sepolia, Base Sepolia, Ethereum Sepolia, Polygon Amoy, and Mode Testnet  
   - Automatic schema generation and event handling reduce engineering overhead  

2. **Envio HyperSync:**  
   - Ultra-fast blockchain data API replacing RPC for up to 2000x improved data fetch performance  
   - Enables real-time reactive dashboards with sub-100ms latency  

3. **Hasura GraphQL:**  
   - Dynamic GraphQL API exposing indexed data and enabling complex multi-query aggregation  

4. **React Frontend:**  
   - Lifecycle timeline, interactive cross-chain route visualization, and transaction explorer  

5. **Probabilistic Settlement Matcher:**  
   - Custom logic correlating batch Settle events to individual fill intents  
   - Confidence scoring provides transparency on match reliability  

---

## Key Features  

- Complete cross-chain intent lifecycle visibility  
- Transaction-level proof with direct links to public explorers  
- Real-time updates with zero delay  
- Settlement batch correlation with confidence score  
- Multi-testnet support (6 EVM chains simultaneously)  
- Refund detection and visualization  
- Developer-friendly API for integration and analytics  

---

## Technical Stack  

| Layer           | Technology               | Purpose                                  |
|-----------------|--------------------------|------------------------------------------|
| Indexing & Sync | Envio HyperIndex & Sync  | Multi-chain event indexing & real-time data streaming |
| API Layer       | Hasura GraphQL           | Indexed data querying and aggregation   |
| Frontend        | React + TypeScript       | Interactive UI and data visualization   |
| Data Storage    | PostgreSQL (via Envio)   | Event persistence and fast query response |
| Cross-chain SDK | Avail Nexus SDK          | Intent definition and off-chain registry |

---

## Deployment  

- Hosted on Envio’s platform with production-grade scalability  
- Supported networks: 6 EVM testnets with continuous data sync  
- GraphQL API exposed publicly for easy developer access  
- Frontend deployed with real-time lifecycle updates using WebSocket and HyperSync  

---

## Why This Matters  

IntentScan empowers the Avail Nexus ecosystem by:  

- Providing unprecedented transparency into cross-chain intent execution  
- Enabling easy debugging, verification, and auditing of intent workflows  
- Reducing developer onboarding friction & increasing confidence in multi-chain dApps  
- Delivering production-ready, fast, and reliable blockchain data infrastructure  
- Serving as one of the first comprehensive intent trackers in the wild, demonstrating innovative solutions to known cross-chain complexity  

---

## Roadmap  

- Deploy to Ethereum and other mainnets  
- Integrate advanced analytics and real-time alerting  
- Build public usage dashboard with solver performance  
- Add AI-based failure root-cause analysis and automated retry recommendations  
- Enhance mobile experience and responsive design  
- Extend chain support to cover broader ecosystems  

---

## License  

MIT License

---

## Credits  

Built rapidly for ETHGlobal Online 2025 by leveraging:  

- Avail Project Nexus SDK  
- Envio HyperIndex and HyperSync  
- Hasura GraphQL endpoint  

---

For questions or contributions, please contact the maintainers or visit the GitHub repository.
