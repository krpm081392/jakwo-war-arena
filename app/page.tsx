"use client"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import { SITE } from "@/lib/config"
import type { WarAd, ChatMessage, SiteSettings } from "@/lib/types"

const fallbackTicker = [
  "🔥 JAKWO TIMES IS LIVE",
  "⚔️ Upload ads, resize freely, block enemies",
  "🚨 Clickable meme ads are allowed on the war wall",
  "💬 Wallet chat is for trolling only — links blocked",
]

function short(w:string){return w ? `${w.slice(0,4)}...${w.slice(-4)}` : "anon"}
function noLinks(s:string){return !/(https?:\/\/|www\.|\.com|\.net|\.org|t\.me|x\.com|twitter\.com)/i.test(s)}

export default function Home(){
 const [ads,setAds]=useState<WarAd[]>([])
 const [settings,setSettings]=useState<SiteSettings|null>(null)
 const [wallet,setWallet]=useState("")
 const [chat,setChat]=useState<ChatMessage[]>([])
 const [msg,setMsg]=useState("")
 const [toast,setToast]=useState("")
 const ticker = settings?.ticker_items?.length ? settings.ticker_items : fallbackTicker
 const leaders = useMemo(()=>[...ads].sort((a,b)=>b.price-a.price).slice(0,8),[ads])

 async function load(){
  const [{data:adsData},{data:setData},{data:chatData}] = await Promise.all([
   supabase.from("war_ads").select("*").order("created_at",{ascending:false}).limit(200),
   supabase.from("site_settings").select("*").eq("id",1).maybeSingle(),
   supabase.from("chat_messages").select("*").order("created_at",{ascending:false}).limit(50),
  ])
  if(adsData) setAds(adsData as WarAd[])
  if(setData) setSettings(setData as SiteSettings)
  if(chatData) setChat((chatData as ChatMessage[]).reverse())
 }
 useEffect(()=>{load(); const t=setInterval(load,5000); return()=>clearInterval(t)},[])
 async function connect(){
  const sol=(window as any).solana
  if(!sol?.isPhantom){window.open("https://phantom.app/","_blank");return}
  const r=await sol.connect(); setWallet(r.publicKey.toString())
 }
 async function sendChat(){
  if(!wallet){setToast("Connect Phantom first");return}
  if(!msg.trim())return
  if(!noLinks(msg)){setToast("No links in chat bro 😂 trolling only");return}
  const last=localStorage.getItem("lastChatAt")
  if(last && Date.now()-Number(last)<10000){setToast("Cooldown 10 seconds");return}
  localStorage.setItem("lastChatAt",String(Date.now()))
  const row={wallet,message:msg.slice(0,180)}
  const {error}=await supabase.from("chat_messages").insert(row)
  if(error){setToast(error.message);return}
  setMsg(""); load()
 }
 return <main className="paper min-h-screen">
  <div className="ticker"><div className="ticker-track">{[...ticker,...ticker].map((x,i)=><span key={i}>{x}</span>)}</div></div>
  <header className="relative z-10 max-w-7xl mx-auto px-4 py-8 flex flex-wrap gap-4 items-center justify-between">
   <Link className="link-clean" href="/"><div><h1 className="text-5xl md:text-7xl font-black tracking-tight">JAKWO TIMES</h1><p className="font-bold">Clickable Meme Ad War Wall</p></div></Link>
   <nav className="flex gap-3 flex-wrap"><Link className="btn dark" href="/upload">PLACE WAR AD</Link><Link className="btn" href="/admin">ADMIN</Link><a className="jakwo-pump-exact" href="https://pump.fun/coin/EgarvX6JFtcqmjXw5aAvk9yTLa3CnwNmdbwAmwPNpump" target="_blank" rel="noopener noreferrer" aria-label="Open JAKWO on Pump.fun"><img src="/pump-fun-logo.png" alt="Pump.fun JAKWO" /></a><a className="btn" href={SITE.twitter} target="_blank">X</a><a className="btn" href={SITE.telegram} target="_blank">Telegram</a></nav>
  </header>
  {settings?.background_url && <img src={settings.background_url} className="decoration inset-0 w-full h-full object-cover opacity-30" alt="background"/>}
  {settings?.decorations?.map((d:any,i:number)=><div key={i} className="decoration" style={{left:d.x,top:d.y,width:d.w,height:d.h,fontSize:d.size||32,zIndex:1}}>{d.type==='text'?d.text:<img src={d.url} className="w-full h-full object-contain" alt="decoration"/>}</div>)}
  <section className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-[1fr_320px] gap-5 pb-14">
   <div className="old-card p-4"><div className="flex justify-between items-center mb-3"><h2 className="text-2xl font-black">LIVE WAR WALL</h2><span className="small">Overlapping allowed. Blocking is part of the war.</span></div>
    <div className="war-canvas">
     {ads.map((a,idx)=><a key={a.id} href={a.link} target="_blank" rel="noopener noreferrer" className="ad-img" title={`${a.title} • $${a.price.toFixed(2)} • ${short(a.wallet)}`} style={{left:a.x,top:a.y,width:a.width,height:a.height,zIndex:idx+10}}><img src={a.image_url} alt={a.title} className="w-full h-full object-cover rounded-lg shadow-xl border-2 border-black"/></a>)}
     {ads.length===0 && <div className="absolute inset-0 grid place-items-center text-center"><div><p className="text-4xl font-black">NO ADS YET</p><p>Be the first to start the war 😂</p><Link href="/upload" className="btn inline-block mt-5">UPLOAD FIRST AD</Link></div></div>}
    </div>
   </div>
   <aside className="space-y-5">
    <div className="old-card p-4"><h2 className="text-xl font-black mb-3">🏆 TOP WAR LORDS</h2>{leaders.length?leaders.map((a,i)=><a className="flex justify-between gap-2 py-2 border-b border-[#7a3d13]/30" key={a.id} href={a.link} target="_blank"><span>#{i+1} {a.title}</span><b>${a.price.toFixed(2)}</b></a>):<p>No warriors yet.</p>}</div>
    <div className="old-card p-4"><h2 className="text-xl font-black mb-2">📜 RULES OF WAR</h2><p>Upload photo + clickable link. Resize freely. Bigger space costs more USDC. You may cover other ads. No refunds after payment. Chat has no links.</p></div>
    <div className="chat rounded-xl p-4"><h2 className="text-xl font-black mb-3">💬 WALLET TROLL CHAT</h2><div className="h-80 overflow-y-auto space-y-2 text-sm">{chat.map(c=><p key={c.id}><b>{short(c.wallet)}:</b> {c.message}</p>)}</div>{wallet?<p className="small text-yellow-200 mt-2">Connected {short(wallet)}</p>:<button className="btn mt-3" onClick={connect}>Connect Wallet</button>}<div className="flex gap-2 mt-3"><input className="input" value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Troll message, no links" onKeyDown={e=>{if(e.key==='Enter')sendChat()}}/><button className="btn" onClick={sendChat}>Send</button></div></div>
   </aside>
  </section>
  <footer className="relative z-10 text-center pb-8 font-bold">JAKWO Meme War Ads • payments to {short(SITE.receiverWallet)}</footer>
  {toast&&<div className="toast" onAnimationEnd={()=>setToast("")}>{toast}<button className="ml-4" onClick={()=>setToast("")}>x</button></div>}
 </main>
}
