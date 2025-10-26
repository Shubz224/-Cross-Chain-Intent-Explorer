"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, ArrowRight } from "lucide-react"

export default function Home() {
  const [intentId, setIntentId] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!intentId.trim()) return

    setLoading(true)
    router.push(`/intent/${encodeURIComponent(intentId)}`)
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img 
                src="/avail.png" 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold text-foreground">Nexus Intent Explorer</span>
          </div>
          <a
            href="https://docs.availproject.org/nexus/introduction-to-nexus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              Intent Explorer
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              Track your Nexus intent lifecycle
            </p>
          </div>

          {/* Search Card */}
          <Card className="p-8 border border-border/60 bg-card/50 backdrop-blur-sm">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter intent ID..."
                  value={intentId}
                  onChange={(e) => setIntentId(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              <Button
                type="submit"
                disabled={!intentId.trim() || loading}
                className="w-full h-12 text-base font-medium"
              >
                {loading ? "Loading..." : "Explore"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </Card>

        </div>
      </div>
    </main>
  )
}
