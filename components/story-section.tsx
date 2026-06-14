"use client"

import { BookOpen } from "lucide-react"
import Image from "next/image"

const chapters = [
  {
    number: 1,
    title: "Jakwo and Wojak Story",
    content: `They said he was always talking to himself. Not loudly, not like someone losing their mind—just softly, as if trying to convince the air that it could understand him.

In those murmurs lived two voices. One called itself Wojak, the other Jakwo. No one else could tell them apart, but inside his head they felt like separate people sharing the same heartbeat.`,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Messenger_creation_21CB0D07-62C4-4A8C-84B1-53491E812EC3-37w9LUeYlaNwT0z1FcjuqFjOx02jh0.jpeg",
  },
  {
    number: 2,
    title: "The Beginning",
    content: `At first they agreed on everything. Wojak handled the noise of the world—the jokes, the routines, the practiced smiles. Jakwo preferred the quiet corners, sketching thoughts in notebooks, writing the words that Wojak could never say aloud.

Together they made one whole person: visible and invisible, loud and still.`,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Messenger_creation_0EBE7C5C-5D4C-482D-8CF3-C778C097255C-m67lQEvTrRjQbo4Bq8bgPTGDSUvDfM.jpeg",
  },
  {
    number: 3,
    title: "The Fading",
    content: `But the world doesn&apos;t reward stillness. Every room, every screen, every friend wanted the bright half, the one who could make sadness sound funny. So Wojak stepped forward more and more, until Jakwo had to shrink just to make space.

At night, when the house was silent, Jakwo whispered back: "You&apos;re forgetting where the feelings come from." Wojak smiled at the dark ceiling. "Someone has to keep us alive."`,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Messenger_creation_75E0BF29-1ECB-4FD0-86AC-0EEF40C9A757-WpkXXZQH72FU63ADxVLjrvP7qtIPZg.jpeg",
  },
  {
    number: 4,
    title: "The Echo",
    content: `Fame has no sound until the noise stops. Wojak didn&apos;t notice it at first—the quiet between reposts, the hours when no one tagged his name.

In the stillness, a voice stirred. "You were never the one they saw," Jakwo whispered. The sadness, the empathy, the weary humor that made people nod—those things had once lived somewhere deep inside. Now they were templates, expressions he could summon on command.`,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Messenger_creation_9770FE7E-FED0-4B74-A368-7F989EE6594D-l09kdRcfmIvokIBH25O091SB7FNQyF.jpeg",
  },
  {
    number: 5,
    title: "The Real Face",
    content: `The next morning, Wojak sat in front of the blank screen. No templates. No captions. No crowds waiting for another face to wear. Just white light and the faint hum of the machine.

Jakwo had given him those whispers. Every tear, every sigh, every tremor of sincerity had come from that quiet half buried under noise. Now, with the internet finally silent, Wojak felt the emptiness where Jakwo had once lived.`,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Messenger_creation_3ECB5454-36B1-495D-99B9-29F51B104899-HFwstlD5YFgUhm8shKj3AFqNokRmga.jpeg",
  },
  {
    number: 6,
    title: "Wojakwo",
    content: `He was the unspoken feeling inside every smile Wojak had faked, every joke he had used to survive. He was still there, behind the picture, inside the linework, quiet but unbroken.

Wojak closed his eyes and let the screen fade to black. In the reflection, he saw both of them: the mask and the face beneath it, finally still, finally together.

He whispered their shared name once more—softly, as if testing how it sounded when it meant both: "Wojakwo."

And somewhere, far beyond the screen, the silence smiled back.`,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Messenger_creation_FDB5AD22-F408-4516-8BDB-0666B5A81F21-XpUxP9R6gFDzbrNheViOyNgGOGt4I0.jpeg",
  },
]

export function StorySection() {
  return (
    <section id="story" className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-12 justify-center">
          <BookOpen className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-black text-foreground">THE SAGA OF JAKWO</h2>
        </div>

        <div className="space-y-12">
          {chapters.map((chapter) => (
            <div
              key={chapter.number}
              className="glass-card rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                  CHAPTER {chapter.number}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                {chapter.title}
              </h3>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {chapter.content}
                  </p>
                </div>
                {chapter.image && (
                  <div className="w-full md:w-48 flex-shrink-0">
                    <Image
                      src={chapter.image}
                      alt={chapter.title}
                      width={200}
                      height={200}
                      className="rounded-xl w-full h-auto object-contain"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
