"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { CheckCircle2, Clock, Zap } from "lucide-react"

interface TimelineStage {
  id: string
  name: string
  status: "completed" | "in-progress" | "pending" | "failed"
  timestamp: string
  description: string
  icon: React.ReactNode
}

const TIMELINE_STAGES: TimelineStage[] = [
  {
    id: "created",
    name: "Intent Created",
    status: "completed",
    timestamp: "2024-10-26 14:32:15 UTC",
    description: "Intent submitted to the Nexus network",
    icon: <CheckCircle2 className="w-6 h-6" />,
  },
  {
    id: "validated",
    name: "Validation",
    status: "completed",
    timestamp: "2024-10-26 14:32:18 UTC",
    description: "Intent parameters validated and verified",
    icon: <CheckCircle2 className="w-6 h-6" />,
  },
  {
    id: "processing",
    name: "Processing",
    status: "in-progress",
    timestamp: "2024-10-26 14:32:25 UTC",
    description: "Intent is being processed by solvers",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: "settlement",
    name: "Settlement",
    status: "pending",
    timestamp: "Pending",
    description: "Awaiting settlement on destination chain",
    icon: <Clock className="w-6 h-6" />,
  },
]

export function Timeline({ intentId }: { intentId: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500"
      case "in-progress":
        return "text-blue-500"
      case "pending":
        return "text-amber-500"
      case "failed":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10"
      case "in-progress":
        return "bg-blue-500/10"
      case "pending":
        return "bg-amber-500/10"
      case "failed":
        return "bg-red-500/10"
      default:
        return "bg-muted/10"
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Lifecycle Timeline</h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-muted-foreground/20" />

        {/* Timeline items */}
        <div className="space-y-6">
          {TIMELINE_STAGES.map((stage, index) => (
            <div key={stage.id} className="relative pl-16">
              {/* Icon circle */}
              <div
                className={`absolute left-0 top-0 w-7 h-7 rounded-full border-2 border-background flex items-center justify-center ${getStatusBgColor(
                  stage.status,
                )}`}
              >
                <div className={getStatusColor(stage.status)}>{stage.icon}</div>
              </div>

              {/* Card */}
              <Card className="p-4 border border-border/60 bg-card/50 backdrop-blur-sm hover:border-border/80 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{stage.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{stage.description}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${getStatusBgColor(
                      stage.status,
                    )} ${getStatusColor(stage.status)}`}
                  >
                    {stage.status === "in-progress" ? "In Progress" : stage.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">{stage.timestamp}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
