"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import type { IntentData } from "@/lib/types"

interface IntentTimelineProps {
  data: IntentData
}

export function IntentTimeline({ data }: IntentTimelineProps) {
  const stages = [
    {
      id: "created",
      label: "Created",
      timestamp: data.createdAt,
      status: "completed",
      icon: CheckCircle2,
    },
    {
      id: "deposit",
      label: "Deposit",
      timestamp: data.depositedAt,
      status: data.depositedAt ? "completed" : "pending",
      icon: data.depositedAt ? CheckCircle2 : Clock,
    },
    {
      id: "filled",
      label: "Filled",
      timestamp: data.filledAt,
      status: data.filledAt ? "completed" : "pending",
      icon: data.filledAt ? CheckCircle2 : Clock,
    },
    {
      id: "settled",
      label: "Settled",
      timestamp: data.settledAt,
      status: data.settledAt ? "completed" : data.refundedAt ? "refunded" : "pending",
      icon: data.settledAt ? CheckCircle2 : data.refundedAt ? AlertCircle : Clock,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-200"
      case "refunded":
        return "bg-amber-500/10 text-amber-700 border-amber-200"
      case "pending":
        return "bg-slate-500/10 text-slate-700 border-slate-200"
      default:
        return "bg-slate-500/10 text-slate-700 border-slate-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "refunded":
        return "Refunded"
      case "pending":
        return "Pending"
      default:
        return "Unknown"
    }
  }

  return (
    <Card className="p-8 border border-border/60 bg-card/50 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-foreground mb-8">Lifecycle</h2>

      <div className="space-y-6">
        {stages.map((stage, index) => {
          const Icon = stage.icon
          const isLast = index === stages.length - 1

          return (
            <div key={stage.id} className="flex gap-6">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    stage.status === "completed"
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-600"
                      : stage.status === "refunded"
                        ? "bg-amber-500/10 border-amber-500 text-amber-600"
                        : "bg-slate-500/10 border-slate-300 text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-16 mt-2 ${
                      stage.status === "completed" ? "bg-emerald-500/30" : "bg-slate-300/30"
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground">{stage.label}</h3>
                  <Badge className={`${getStatusColor(stage.status)} border`}>{getStatusLabel(stage.status)}</Badge>
                </div>
                {stage.timestamp ? (
                  <p className="text-sm text-muted-foreground">{new Date(stage.timestamp * 1000).toLocaleString()}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Pending...</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
