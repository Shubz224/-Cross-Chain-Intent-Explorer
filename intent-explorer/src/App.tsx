import { useState } from 'react'
import { Search, Zap, ExternalLink } from 'lucide-react'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-avail-dark to-slate-900">
      {/* Header */}
      <header className="border-b border-avail-border bg-avail-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Matching Avail's style */}
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
            <button className="btn-primary">
              Connect Wallet
            </button>
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
              className="input w-full pl-12 pr-4 py-4 text-lg"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary">
              Search
            </button>
          </div>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Feature Card 1 */}
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

          {/* Feature Card 2 */}
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

          {/* Feature Card 3 */}
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
      </main>
    </div>
  )
}

export default App
