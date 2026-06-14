"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Swords, BookOpen } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-foreground mb-6 text-balance">
          JAKWO
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty">
          Two voices. One mind. A battlefield of pixels.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#story">
            <Button
              variant="outline"
              size="lg"
              className="font-bold gap-2 px-8 py-6 text-lg"
            >
              <BookOpen className="h-5 w-5" />
              Read Story
            </Button>
          </a>
          <Link href="/arena">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 px-8 py-6 text-lg"
            >
              <Swords className="h-5 w-5" />
              Enter War Arena
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
