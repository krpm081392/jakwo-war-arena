import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "JAKWO Meme War Ads",
  description: "Clickable Solana meme ad war wall",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
