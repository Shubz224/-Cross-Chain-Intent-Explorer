"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy, CheckCircle2, Clock } from "lucide-react"
import type { IntentData } from "@/lib/types"
import { formatAmount, getChainName, getExplorerUrl } from '@/lib/utils'

interface TransactionDetailsProps {
  data: IntentData
}

export function TransactionDetails({ data }: TransactionDetailsProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatHash = (hash: string) => {
    if (!hash) return "N/A"
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "Pending"
    return new Date(timestamp * 1000).toLocaleString()
  }

  // Collect transactions
  const transactions = [
    {
      id: "deposit",
      label: "Deposit Transaction",
      hash: data.depositTxHash,
      timestamp: data.depositedAt,
      status: data.deposited ? "completed" : "pending",
      chainID: data.sources[0]?.chainID,
      chainName: getChainName(data.sources[0]?.chainID),
      amount: formatAmount(data.sources[0]?.value),
      type: "Deposit",
    },
    {
      id: "fill",
      label: "Fill Transaction",
      hash: data.fillTxHash,
      timestamp: data.filledAt,
      status: data.fulfilled ? "completed" : "pending",
      chainID: data.destinationChainID,
      chainName: getChainName(data.destinationChainID),
      amount: formatAmount(data.destinations[0]?.value),
      type: "Fill",
    },
  ]

  const activeTransactions = transactions.filter((tx) => tx.hash)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Transactions</h2>

      {activeTransactions.length === 0 ? (
        <Card className="p-6 border border-border/60 bg-card/50 backdrop-blur-sm text-center">
          <p className="text-muted-foreground text-sm">No transactions yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeTransactions.map((tx) => (
            <Card key={tx.id} className="p-6 border border-border/60 bg-card/50 backdrop-blur-sm">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{tx.label}</h3>
                      <Badge
                        className={
                          tx.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
                            : "bg-slate-500/10 text-slate-700 border-slate-200"
                        }
                        variant="outline"
                      >
                        {tx.status === "completed" ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {tx.status === "completed" ? "Confirmed" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tx.type} on {tx.chainName}
                    </p>
                  </div>
                </div>

                {/* Transaction Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/40">
                  {/* Transaction Hash */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Hash</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-foreground bg-background/50 px-2 py-1 rounded flex-1 truncate">
                        {formatHash(tx.hash || "")}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => tx.hash && copyToClipboard(tx.hash)}
                        className="flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Chain */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Chain</p>
                    <p className="text-sm font-medium text-foreground">{tx.chainName}</p>
                  </div>

                  {/* Amount */}
                  {tx.amount && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Amount</p>
                      <p className="text-sm font-medium text-foreground">{tx.amount}</p>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Time</p>
                    <p className="text-sm font-mono text-foreground">{formatDate(tx.timestamp)}</p>
                  </div>
                </div>

                {/* Explorer Link */}
                {tx.hash && tx.chainID && getExplorerUrl(tx.chainID, tx.hash) && (
                  <div className="pt-2 border-t border-border/40">
                    <a
                      href={getExplorerUrl(tx.chainID, tx.hash)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      View on Block Explorer
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Transaction Summary */}
      <Card className="p-6 border border-border/60 bg-card/50 backdrop-blur-sm">
        <h3 className="font-semibold text-foreground mb-4">Transaction Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Transactions</span>
            <span className="font-medium text-foreground">{activeTransactions.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confirmed</span>
            <span className="font-medium text-foreground">
              {activeTransactions.filter((tx) => tx.status === "completed").length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pending</span>
            <span className="font-medium text-foreground">
              {activeTransactions.filter((tx) => tx.status === "pending").length}
            </span>
          </div>
          {data.depositTxHash && data.fillTxHash && (
            <div className="pt-3 border-t border-border/40">
              <p className="text-xs text-muted-foreground mb-2">Cross-Chain Route</p>
              <p className="text-sm font-medium text-foreground">
                {transactions[0].chainName} → {transactions[1].chainName}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
