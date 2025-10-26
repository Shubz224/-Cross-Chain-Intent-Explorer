"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy, ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react"
import type { SettlementMatch } from "@/lib/types"
import { formatAmount, getChainName, getExplorerUrl } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface SettlementDetailsProps {
  matches: SettlementMatch[]
  settled: boolean
}

export function SettlementDetails({ matches, settled }: SettlementDetailsProps) {
  const [showOthers, setShowOthers] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatHash = (hash: string) => {
    if (!hash) return "N/A"
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const formatTimeDelta = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (!settled) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Settlement</h2>
        <Card className="p-8 border border-border/60 bg-card/50 backdrop-blur-sm text-center">
          <p className="text-muted-foreground">No settlement yet</p>
        </Card>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Settlement</h2>
        <Card className="p-8 border border-border/60 bg-card/50 backdrop-blur-sm text-center">
          <p className="text-muted-foreground">No settlement candidates found in the 60-minute window</p>
        </Card>
      </div>
    )
  }

  const topMatch = matches[0]
  const otherMatches = matches.slice(1)

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 60) return "text-emerald-600"
    if (confidence >= 40) return "text-amber-600"
    return "text-red-600"
  }

  const getConfidenceBarColor = (confidence: number) => {
    if (confidence >= 60) return "from-emerald-500 to-emerald-400"
    if (confidence >= 40) return "from-amber-500 to-amber-400"
    return "from-red-500 to-red-400"
  }

  const renderMatch = (match: SettlementMatch, isTop: boolean = false) => {
    const { settlement, confidence, reasons } = match

    return (
      <Card
        key={settlement.id}
        className={`p-6 border backdrop-blur-sm ${
          isTop
            ? "border-primary/60 bg-primary/5"
            : "border-border/60 bg-card/50"
        }`}
      >
        <div className="space-y-4">
          {/* Header with confidence */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-foreground">
                  {isTop ? "Best Match" : "Settlement Candidate"}
                </h3>
                {isTop && (
                  <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200" variant="outline">
                    Top Match
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Settlement on {getChainName(settlement.chainId)}
              </p>
            </div>
            
            {/* Confidence Bar */}
            <div className="text-right min-w-[120px]">
              <p className={`text-2xl font-bold mb-1 ${getConfidenceColor(confidence)}`}>
                {confidence.toFixed(1)}%
              </p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getConfidenceBarColor(confidence)} transition-all`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Confidence</p>
            </div>
          </div>

          {/* Match Reasons */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
            <div className={`flex items-center gap-2 p-2 rounded-lg ${
              reasons.timeMatch ? "bg-emerald-500/10" : "bg-red-500/10"
            }`}>
              <div className={reasons.timeMatch ? "text-emerald-600" : "text-red-600"}>
                {reasons.timeMatch ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
              </div>
              <span className="text-sm text-muted-foreground">Time Match</span>
            </div>

            <div className={`flex items-center gap-2 p-2 rounded-lg ${
              reasons.chainMatch ? "bg-emerald-500/10" : "bg-red-500/10"
            }`}>
              <div className={reasons.chainMatch ? "text-emerald-600" : "text-red-600"}>
                {reasons.chainMatch ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
              </div>
              <span className="text-sm text-muted-foreground">Chain Match</span>
            </div>
            
            <div className={`flex items-center gap-2 p-2 rounded-lg ${
              reasons.amountMatch ? "bg-emerald-500/10" : "bg-red-500/10"
            }`}>
              <div className={reasons.amountMatch ? "text-emerald-600" : "text-red-600"}>
                {reasons.amountMatch ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
              </div>
              <span className="text-sm text-muted-foreground">Amount Match</span>
            </div>
            
            <div className={`flex items-center gap-2 p-2 rounded-lg ${
              reasons.tokenMatch ? "bg-emerald-500/10" : "bg-red-500/10"
            }`}>
              <div className={reasons.tokenMatch ? "text-emerald-600" : "text-red-600"}>
                {reasons.tokenMatch ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
              </div>
              <span className="text-sm text-muted-foreground">Token Match</span>
            </div>
          </div>

          {/* Time Delta Info */}
          <div className="pt-2 border-t border-border/40">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Settlement Time:</span>
              <span className="text-sm font-medium text-foreground">
                +{formatTimeDelta(reasons.timeDelta)} from fill
              </span>
            </div>
          </div>

          {/* Settlement Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/40">
            {/* Transaction Hash */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Transaction Hash</p>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono text-foreground bg-background/50 px-2 py-1 rounded flex-1 truncate">
                  {formatHash(settlement.txHash)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(settlement.txHash)}
                  className="flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Nonce */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Nonce</p>
              <p className="text-sm font-mono text-foreground">{settlement.nonce}</p>
            </div>

            {/* Timestamp */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Timestamp</p>
              <p className="text-sm font-mono text-foreground">{formatDate(settlement.timestamp)}</p>
            </div>

            {/* Block Number */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Block Number</p>
              <p className="text-sm font-mono text-foreground">{settlement.blockNumber}</p>
            </div>
          </div>

          {/* Solvers */}
          {settlement.solvers.length > 0 && (
            <div className="pt-4 border-t border-border/40">
              <p className="text-xs text-muted-foreground mb-2">Solvers ({settlement.solvers.length})</p>
              <div className="space-y-1">
                {settlement.solvers.slice(0, 3).map((solver, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <code className="text-xs font-mono text-foreground bg-background/50 px-2 py-1 rounded flex-1 truncate">
                      {solver}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(solver)}
                      className="flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {settlement.solvers.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{settlement.solvers.length - 3} more
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Explorer Link */}
          {getExplorerUrl(settlement.chainId, settlement.txHash) && (
            <div className="pt-2 border-t border-border/40">
              <a
                href={getExplorerUrl(settlement.chainId, settlement.txHash)!}
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
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Settlement</h2>

      {/* Top Match */}
      {renderMatch(topMatch, true)}

      {/* Other Possibilities */}
      {otherMatches.length > 0 && (
        <Collapsible open={showOthers} onOpenChange={setShowOthers}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              {showOthers ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Hide Other Possibilities ({otherMatches.length})
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show Other Possibilities ({otherMatches.length})
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {otherMatches.map(match => renderMatch(match, false))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}

