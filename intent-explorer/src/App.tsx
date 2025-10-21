import { useState } from 'react'
import { Search, Zap, ExternalLink, Loader2, ArrowRight } from 'lucide-react'
import ConnectWalletButton from './components/ConnectWalletButton'
import { indexerClient } from './services/IndexerClient'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchType, setSearchType] = useState<'wallet' | 'intent' | 'hash' | null>(null)

  // Type checkers
  const isAddress = (s: string) => /^0x[a-fA-F0-9]{40}$/.test(s.trim())
  const isTxHash = (s: string) => /^0x[a-fA-F0-9]{64}$/.test(s.trim())
  const isIntentId = (s: string) => /^\d+$/.test(s.trim())

  // Chain metadata for explorer links
  const getExplorerLink = (chainId: number, txHash: string) => {
    const explorers: Record<number, string> = {
      11155111: 'https://sepolia.etherscan.io',
      421614: 'https://sepolia.arbiscan.io',
      84532: 'https://sepolia.basescan.org',
      11155420: 'https://sepolia-optimism.etherscan.io/',
      80002: 'https://amoy.polygonscan.com',
    }
    return `${explorers[chainId] || 'https://etherscan.io'}/tx/${txHash}`
  }

  const getChainName = (chainId: number) => {
    const names: Record<number, string> = {
      11155111: 'Ethereum Sepolia',
      421614: 'Arbitrum Sepolia',
      84532: 'Base Sepolia',
      11155420: 'Optimism Sepolia',
      80002: 'Polygon Amoy',
    }
    return names[chainId] || `Chain ${chainId}`
  }

  // Search handler
  async function handleSearch() {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setSearchResults([])
    setSearchType(null)

    try {
      // Case 1: Wallet Address
      if (isAddress(searchQuery)) {
        setSearchType('wallet')
        const txs = await indexerClient.getTransactionsByWallet(searchQuery)
        setSearchResults(txs || [])
      }
      // Case 2: Transaction Hash
      else if (isTxHash(searchQuery)) {
        setSearchType('hash')
        const tx = await indexerClient.getTransactionByHash(searchQuery)
        setSearchResults(tx ? [tx] : [])
      }
      // Case 3: Intent ID (future step - placeholder)
      else if (isIntentId(searchQuery)) {
        setSearchType('intent')
        // TODO: Implement intent search
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-avail-dark to-slate-900">
      {/* Header */}
      <header className="border-b border-avail-border bg-avail-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-avail-accent to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-avail-text-primary">
                  IntentScan
                </h1>
                <p className="text-xs text-avail-text-muted">
                  Enhanced Nexus Intent Explorer
                </p>
              </div>
            </div>
            
            {/* Connect Wallet Button */}
            <ConnectWalletButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-avail-text-primary mb-4">
            Nexus Intent Explorer
          </h2>
          <p className="text-avail-text-secondary mb-8 max-w-2xl mx-auto">
            Search by wallet address, intent ID, or transaction hash. 
            Connect your wallet to see enhanced intent metadata with blazing-fast indexing.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-avail-text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Enter wallet address, intent ID, or transaction hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input w-full pl-12 pr-32 py-4 text-lg"
              disabled={isLoading}
            />
            <button 
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>

          {/* Search Type Indicator */}
          {searchQuery && !isLoading && (
            <div className="mt-4 text-sm text-avail-text-muted">
              {isAddress(searchQuery) && '🔍 Wallet Address detected'}
              {isTxHash(searchQuery) && '🔍 Transaction Hash detected'}
              {isIntentId(searchQuery) && '🔍 Intent ID detected'}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-avail-accent animate-spin mb-4" />
            <p className="text-avail-text-secondary">Searching blockchain data...</p>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && searchResults.length > 0 && (
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-avail-text-primary">
                {searchType === 'wallet' && `Found ${searchResults.length} Transaction${searchResults.length > 1 ? 's' : ''}`}
                {searchType === 'hash' && 'Transaction Details'}
                {searchType === 'intent' && 'Intent Details'}
              </h3>
              <span className="text-avail-text-muted text-sm">
                {searchType === 'wallet' && `Wallet: ${searchQuery.slice(0, 6)}...${searchQuery.slice(-4)}`}
              </span>
            </div>

            <div className="space-y-4">
              {searchResults.map((tx, index) => (
                <div 
                  key={tx.id}
                  className="card hover:border-avail-accent transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Transaction Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="badge badge-success">{getChainName(tx.chainId)}</span>
                        {tx.isFromSolver ? (
                          <span className="badge bg-blue-500/20 text-blue-400">Outgoing</span>
                        ) : (
                          <span className="badge bg-green-500/20 text-green-400">Incoming</span>
                        )}
                      </div>
                      
                      <div className="font-mono text-sm text-avail-text-secondary break-all">
                        {tx.txHash}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-avail-text-muted">Value: </span>
                          <span className="text-avail-text-primary font-bold">
                            ${Number(tx.valueUSD).toFixed(2)} USDC
                          </span>
                        </div>
                        <div>
                          <span className="text-avail-text-muted">Gas: </span>
                          <span className="text-avail-text-primary">
                            {Number(tx.gasUsed).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-avail-text-muted">Time: </span>
                          <span className="text-avail-text-primary">
                            {new Date(Number(tx.blockTimestamp) * 1000).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* From/To Addresses */}
                      <div className="flex items-center gap-2 text-xs text-avail-text-muted">
                        <span className="font-mono">{tx.from.slice(0, 8)}...</span>
                        <ArrowRight className="w-4 h-4" />
                        <span className="font-mono">{tx.to.slice(0, 8)}...</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <a
                        href={getExplorerLink(tx.chainId, tx.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex items-center gap-2 justify-center"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Explorer
                      </a>
                      {tx.intentId && (
                        <button className="btn-primary text-sm">
                          View Intent #{tx.intentId}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && searchType && searchResults.length === 0 && (
          <div className="card text-center py-12">
            <Search className="w-16 h-16 text-avail-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-avail-text-primary mb-2">
              No Results Found
            </h3>
            <p className="text-avail-text-secondary">
              {searchType === 'wallet' && 'No transactions found for this wallet address.'}
              {searchType === 'hash' && 'Transaction not found in our index.'}
              {searchType === 'intent' && 'Intent ID not found.'}
            </p>
          </div>
        )}

        {/* Feature Cards (show when no search) */}
        {!searchType && !isLoading && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-avail-success/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-avail-success" />
                  </div>
                  <h3 className="font-semibold text-avail-text-primary">Lightning Fast</h3>
                </div>
                <p className="text-avail-text-secondary text-sm">
                  Query transactions instantly with our optimized blockchain indexer. 
                  No waiting for slow RPC calls.
                </p>
              </div>

              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-avail-accent/20 rounded-lg flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-avail-accent" />
                  </div>
                  <h3 className="font-semibold text-avail-text-primary">Full Coverage</h3>
                </div>
                <p className="text-avail-text-secondary text-sm">
                  Track intents across Ethereum, Arbitrum, Base, Optimism, and Polygon testnets 
                  with real transaction hashes.
                </p>
              </div>

              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-avail-warning/20 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-avail-warning" />
                  </div>
                  <h3 className="font-semibold text-avail-text-primary">Enhanced Search</h3>
                </div>
                <p className="text-avail-text-secondary text-sm">
                  Search by wallet, intent ID, or transaction hash. 
                  Connect wallet for intent metadata overlay.
                </p>
              </div>
            </div>

            {/* Stats Demo */}
            <div className="card text-center">
              <h3 className="text-xl font-semibold text-avail-text-primary mb-4">
                Live Network Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-2xl font-bold text-avail-accent mb-1">569</div>
                  <div className="text-sm text-avail-text-muted">Total Transactions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-avail-success mb-1">5</div>
                  <div className="text-sm text-avail-text-muted">Chains Indexed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-avail-warning mb-1">24/7</div>
                  <div className="text-sm text-avail-text-muted">Uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-avail-text-primary mb-1">~2ms</div>
                  <div className="text-sm text-avail-text-muted">Avg Response</div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App
