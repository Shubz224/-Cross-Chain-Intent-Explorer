"use client"

import { Card } from "@/components/ui/card"
import { Network, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { IntentData } from "@/lib/types"
import { getChainName } from "@/lib/utils"

export function IntentDetails({ data }: { data: IntentData }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatAddress = (address: string) => {
    if (!address) return "N/A"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "Pending"
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Details</h2>

      {/* Request ID */}
      <Card className="p-4 border border-border/60 bg-card/50 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground mb-2">Request ID</p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-mono text-foreground break-all">{data.requestId}</p>
          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(data.requestId)} className="flex-shrink-0">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* User Address */}
      <Card className="p-4 border border-border/60 bg-card/50 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground mb-2">User Address</p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-mono text-foreground">{formatAddress(data.user)}</p>
          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(data.user)} className="flex-shrink-0">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Source Chains */}
      <Card className="p-4 border border-border/60 bg-card/50 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground mb-3">Source Chains</p>
        <div className="space-y-2">
          {data.sources.map((source, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">Chain {getChainName(source.chainID)}</span>
              </div>
              <span className="text-muted-foreground">{source.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Destination Chain */}
      <Card className="p-4 border border-border/60 bg-card/50 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground mb-3">Destination</p>
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">Chain {getChainName(data.destinationChainID)}</span>
        </div>
      </Card>

      {/* Solver Information */}
      {data.solver && (
        <Card className="p-4 border border-border/60 bg-card/50 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground mb-2">Assigned Solver</p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-mono text-foreground">{formatAddress(data.solver)}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(data.solver || "")}
              className="flex-shrink-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Transaction Hashes */}
      {data.depositTxHash && (
        <Card className="p-4 border border-border/60 bg-card/50 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground mb-2">Deposit TX Hash</p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-mono text-foreground break-all">{data.depositTxHash}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(data.depositTxHash || "")}
              className="flex-shrink-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {data.fillTxHash && (
        <Card className="p-4 border border-border/60 bg-card/50 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground mb-2">Fill TX Hash</p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-mono text-foreground break-all">{data.fillTxHash}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(data.fillTxHash || "")}
              className="flex-shrink-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Timestamps */}
      <Card className="p-4 border border-border/60 bg-card/50 backdrop-blur-sm">
        <div className="space-y-3">
          {data.depositedAt && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Deposited</p>
              <p className="text-sm font-mono text-foreground">{formatDate(data.depositedAt)}</p>
            </div>
          )}
          {data.filledAt && (
            <div className="border-t border-border/40 pt-3">
              <p className="text-xs text-muted-foreground mb-1">Filled</p>
              <p className="text-sm font-mono text-foreground">{formatDate(data.filledAt)}</p>
            </div>
          )}
          {data.settledAt && (
            <div className="border-t border-border/40 pt-3">
              <p className="text-xs text-muted-foreground mb-1">Settled</p>
              <p className="text-sm font-mono text-foreground">{formatDate(data.settledAt)}</p>
            </div>
          )}
          {data.refundedAt && (
            <div className="border-t border-border/40 pt-3">
              <p className="text-xs text-muted-foreground mb-1">Refunded</p>
              <p className="text-sm font-mono text-foreground">{formatDate(data.refundedAt)}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
