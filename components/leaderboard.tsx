"use client"

import { useEffect, useState } from "react"
import { Trophy, Crown, Medal, Award } from "lucide-react"

interface Ad {
  id: string
  name: string
  link: string
  price: number
  width: number
  height: number
  imageUrl: string
  x: number
  y: number
  timestamp: number
}

export function Leaderboard() {
  const [ads, setAds] = useState<Ad[]>([])

  useEffect(() => {
    const loadAds = () => {
      try {
        const stored = localStorage.getItem("arenaAds")
        if (stored) {
          const parsed = JSON.parse(stored) as Ad[]
          // Sort by price descending and take top 10
          const sorted = parsed.sort((a, b) => b.price - a.price).slice(0, 10)
          setAds(sorted)
        }
      } catch {
        console.log("[v0] No ads data found")
      }
    }

    loadAds()
    
    const handleStorage = () => loadAds()
    window.addEventListener("storage", handleStorage)
    const interval = setInterval(loadAds, 2000)
    
    return () => {
      window.removeEventListener("storage", handleStorage)
      clearInterval(interval)
    }
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <Award className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <section id="leaderboard" className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-black text-foreground">TOP 10 WARRIORS</h2>
          </div>

          {ads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No warriors yet. Be the first to conquer the arena!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ads.map((ad, index) => (
                <a
                  key={ad.id}
                  href={ad.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background">
                    {getRankIcon(index + 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {ad.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ad.width}×{ad.height}px
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-xl text-primary">
                      ${ad.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">USDC</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
