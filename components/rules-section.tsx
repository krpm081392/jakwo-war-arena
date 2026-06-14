"use client"

import { ScrollText, Calculator, Wallet, Target, Lock } from "lucide-react"

const rules = [
  {
    icon: Calculator,
    title: "Pricing Formula",
    description: "Linear scale from $0.50 (smallest 22×22) to $1,000,000 (full 1000×1000). Minimum price is always $0.50 USDC. Drag the sliders to any size you want!",
  },
  {
    icon: Target,
    title: "Size Matters",
    description: "Ads can be anywhere from 22×22 pixels to 1000×1000 pixels. Bigger ads cost more but dominate the battlefield.",
  },
  {
    icon: Wallet,
    title: "USDC on Solana",
    description: "All payments in USDC on the Solana network. Connect your Phantom wallet to participate in the war.",
  },
  {
    icon: Lock,
    title: "Lock It In",
    description: "Once you position your ad and click &apos;LOCK IT IN&apos;, it&apos;s permanent. Choose wisely, warrior.",
  },
]

// Linear scale: 22x22 (484px) = $0.50, 1000x1000 (1M px) = $1,000,000
const pricingExamples = [
  { size: "22×22", pixels: 484, price: "$0.50" },
  { size: "100×100", pixels: 10000, price: "$9.52" },
  { size: "250×250", pixels: 62500, price: "$62.11" },
  { size: "500×500", pixels: 250000, price: "$249.75" },
  { size: "750×750", pixels: 562500, price: "$562.00" },
  { size: "1000×1000", pixels: 1000000, price: "$1,000,000" },
]

export function RulesSection() {
  return (
    <section id="rules" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-12 justify-center">
          <ScrollText className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-black text-foreground">RULES OF WAR</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {rules.map((rule) => (
            <div
              key={rule.title}
              className="glass-card rounded-2xl p-6 flex gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <rule.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {rule.title}
                </h3>
                <p className="text-muted-foreground">
                  {rule.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Table */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            💰 PRICING EXAMPLES
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-bold text-foreground">Size</th>
                  <th className="text-left py-3 px-4 font-bold text-foreground">Total Pixels</th>
                  <th className="text-right py-3 px-4 font-bold text-foreground">Price (USDC)</th>
                </tr>
              </thead>
              <tbody>
                {pricingExamples.map((example) => (
                  <tr key={example.size} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-foreground">{example.size}</td>
                    <td className="py-3 px-4 text-muted-foreground">{example.pixels.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-bold text-primary">{example.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
