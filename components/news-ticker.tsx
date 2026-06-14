"use client"

import { useEffect, useState } from "react"
import { Zap } from "lucide-react"

interface NewsItem {
  id: string
  name: string
  link: string
  price: number
  timestamp: number
}

export function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    const loadNews = () => {
      try {
        const stored = localStorage.getItem("arenaNews")
        if (stored) {
          const parsed = JSON.parse(stored) as NewsItem[]
          setNews(parsed.slice(0, 20))
        }
      } catch {
        console.log("[v0] No news data found")
      }
    }

    loadNews()
    
    // Listen for storage changes
    const handleStorage = () => loadNews()
    window.addEventListener("storage", handleStorage)
    
    // Poll for changes every 2 seconds
    const interval = setInterval(loadNews, 2000)
    
    return () => {
      window.removeEventListener("storage", handleStorage)
      clearInterval(interval)
    }
  }, [])

  if (news.length === 0) {
    return (
      <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
        <div className="flex items-center gap-2 px-4">
          <Zap className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium whitespace-nowrap">
            🔥 Be the first to place an ad in the War Arena! 🔥
          </span>
        </div>
      </div>
    )
  }

  const tickerContent = news.map((item) => (
    `⚡ ${item.name} placed $${item.price.toFixed(2)} ad`
  )).join(" • ")

  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="ticker-scroll flex items-center gap-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          {news.map((item, index) => (
            <a
              key={item.id + index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline cursor-pointer"
            >
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">
                ⚡ {item.name} placed ${item.price.toFixed(2)} ad
              </span>
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {news.map((item, index) => (
            <a
              key={item.id + index + "-dup"}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline cursor-pointer"
            >
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">
                ⚡ {item.name} placed ${item.price.toFixed(2)} ad
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
