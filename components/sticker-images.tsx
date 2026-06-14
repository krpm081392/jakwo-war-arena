"use client"

import Image from "next/image"

// Using the actual Wojak images provided
const memeImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1a4b6b754cc8c849155c338f4316bfa9-DhFEe59ZZB4oezpcj630324livbpVA.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8d6eaa00e6a9617abd1e27700c2fcdf7-Ki2HNXuqrqn4c9VF02ib6UB9H3MlNC.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0a08b8bcda3cc2c64208fac210ede77b-g15jM7FXxTeKYbJ0onYHoE1IHehU4D.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/150d6009ef51d7c7d7f9949ea0810f6a-pwyjCUy1LJwgx0MUf45R3On5L0rQaf.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1732e641b764adc48456c59bb7475ce5-llkAxttXMBSSCD546uF3JZoc6W8qop.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a1e482119e0b3fb507b94e6edd480c9e-ZxPxBbfDygh6hqlFrt445RFknqw3Pe.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1f0c51900d9d33300dfe952a1e942497-UwFqNOuFG5qyWmdojpGeCj8LJT8FwD.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b921760ad687a58ab035b267e8b9d00d-wltrZdHARF8WElBOhn940awngNo82g.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/66cb0a1893319060284867678303a51b-c9VBvuU99Yj9TL3tUgArziAuxZiYux.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7223563506494c7992bcd8cf8dac0e42-x2v2kBTncimaHjtBwSgiSKlJiwuqoN.jpg",
]

// Pre-computed sticker positions to avoid hydration mismatch
const leftStickers = [
  { x: 15, y: 2, rotation: -12, size: 120 },
  { x: 45, y: 12, rotation: 8, size: 140 },
  { x: 10, y: 22, rotation: -5, size: 110 },
  { x: 55, y: 32, rotation: 15, size: 130 },
  { x: 20, y: 42, rotation: -18, size: 145 },
  { x: 40, y: 52, rotation: 3, size: 115 },
  { x: 5, y: 62, rotation: -10, size: 135 },
  { x: 50, y: 72, rotation: 12, size: 125 },
  { x: 25, y: 82, rotation: -8, size: 150 },
  { x: 35, y: 92, rotation: 6, size: 118 },
]

const rightStickers = [
  { x: 20, y: 5, rotation: 10, size: 130 },
  { x: 50, y: 15, rotation: -6, size: 115 },
  { x: 15, y: 25, rotation: 14, size: 145 },
  { x: 45, y: 35, rotation: -12, size: 120 },
  { x: 10, y: 45, rotation: 4, size: 135 },
  { x: 55, y: 55, rotation: -16, size: 110 },
  { x: 30, y: 65, rotation: 8, size: 140 },
  { x: 5, y: 75, rotation: -4, size: 125 },
  { x: 40, y: 85, rotation: 18, size: 155 },
  { x: 25, y: 95, rotation: -10, size: 122 },
]

export function StickerImages() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Left side stickers */}
      {memeImages.map((src, index) => {
        const pos = leftStickers[index]
        return (
          <div
            key={`left-${index}`}
            className="absolute sticker pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}%`,
              transform: `rotate(${pos.rotation}deg)`,
              width: `${pos.size}px`,
              height: `${pos.size}px`,
            }}
          >
            <Image
              src={src}
              alt={`Wojak meme ${index + 1}`}
              width={pos.size}
              height={pos.size}
              className="rounded-xl object-cover w-full h-full"
              style={{
                filter: "drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.3))",
              }}
              unoptimized
            />
          </div>
        )
      })}

      {/* Right side stickers */}
      {memeImages.map((src, index) => {
        const pos = rightStickers[index]
        return (
          <div
            key={`right-${index}`}
            className="absolute sticker pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
            style={{
              right: `${pos.x}px`,
              top: `${pos.y}%`,
              transform: `rotate(${pos.rotation}deg)`,
              width: `${pos.size}px`,
              height: `${pos.size}px`,
            }}
          >
            <Image
              src={src}
              alt={`Wojak meme ${index + 11}`}
              width={pos.size}
              height={pos.size}
              className="rounded-xl object-cover w-full h-full"
              style={{
                filter: "drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.3))",
              }}
              unoptimized
            />
          </div>
        )
      })}
    </div>
  )
}
