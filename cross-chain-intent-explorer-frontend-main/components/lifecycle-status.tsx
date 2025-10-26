"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock } from "lucide-react"
import type { IntentData } from "@/lib/types"
import { getChainName } from "@/lib/utils"

interface LifecycleStatusProps {
  data: IntentData
}

export function LifecycleStatus({ data }: LifecycleStatusProps) {
  // Calculate progress percentage
  const stages = [
    { name: "Created", completed: !!data.createdAt },
    { name: "Deposited", completed: data.deposited },
    { name: "Filled", completed: data.fulfilled },
    { name: "Settled", completed: data.settled },
  ]

  const completedStages = stages.filter((s) => s.completed).length
  const progressPercentage = (completedStages / stages.length) * 100

  // Determine current status
  const getCurrentStatus = () => {
    if (data.refunded) return { label: "Refunded", color: "bg-amber-500/10 text-amber-700 border-amber-200" }
    if (data.settled) return { label: "Settled", color: "bg-emerald-500/10 text-emerald-700 border-emerald-200" }
    if (data.fulfilled) return { label: "Filled", color: "bg-blue-500/10 text-blue-700 border-blue-200" }
    if (data.deposited) return { label: "Deposited", color: "bg-blue-500/10 text-blue-700 border-blue-200" }
    return { label: "Created", color: "bg-slate-500/10 text-slate-700 border-slate-200" }
  }

  const currentStatus = getCurrentStatus()

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card className="p-6 border border-border/60 bg-card/50 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Status</h2>
            <Badge className={`${currentStatus.color} border`}>{currentStatus.label}</Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Stage Indicators */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {stages.map((stage) => (
              <div key={stage.name} className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    stage.completed
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-600"
                      : "bg-slate-500/10 border-slate-300 text-slate-400"
                  }`}
                >
                  {stage.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <span className="text-xs text-center text-muted-foreground">{stage.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount */}
        <Card className="p-4 border border-border/60 bg-card/50 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded bg-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
              <p className="text-sm font-semibold text-foreground">
                {data.sources
                  .reduce((sum, src) => sum + (Number(src.value || "0") / 1e18), 0)
                  .toFixed(4)}{data.sources[0]?.tokenAddress?.slice(-4) || "TOKENS"}
              </p>
            </div>
          </div>
        </Card>

        {/* Chains Involved */}
        <Card className="p-4 border border-border/60 bg-card/50 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded-full bg-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Chains</p>
              <p className="text-sm font-semibold text-foreground">
                {getChainName(data.sources[0]?.chainID)} → {getChainName(data.destinationChainID)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Details */}
      <Card className="p-4 border border-border/60 bg-card/50 backdrop-blur-sm">
        <h3 className="font-semibold text-foreground mb-4">Details</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Deposited</span>
            <Badge variant={data.deposited ? "default" : "secondary"}>{data.deposited ? "Yes" : "No"}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Fulfilled</span>
            <Badge variant={data.fulfilled ? "default" : "secondary"}>{data.fulfilled ? "Yes" : "No"}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Settled</span>
            <Badge variant={data.settled ? "default" : "secondary"}>{data.settled ? "Yes" : "No"}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Refunded</span>
            <Badge variant={data.refunded ? "destructive" : "secondary"}>{data.refunded ? "Yes" : "No"}</Badge>
          </div>
        </div>
      </Card>
    </div>
  )
}
