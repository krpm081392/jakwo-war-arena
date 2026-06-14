"use client"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress } from "@solana/spl-token"
import { supabase } from "@/lib/supabase"
import { SITE } from "@/lib/config"
import { calculatePrice } from "@/lib/price"

function cleanUrl(v:string){ if(!v) return ""; return /^https?:\/\//i.test(v) ? v : `https://${v}` }
function short(w:string){return w ? `${w.slice(0,4)}...${w.slice(-4)}` : ""}
async function fileToDataUrl(file:File){return await new Promise<string>((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result));r.onerror=rej;r.readAsDataURL(file)})}

export default function Upload(){
 const box=useRef<HTMLDivElement>(null)
 const [title,setTitle]=useState("")
 const [link,setLink]=useState("")
 const [file,setFile]=useState<File|null>(null)
 const [preview,setPreview]=useState("")
 const [wallet,setWallet]=useState("")
 const [size,setSize]=useState({w:120,h:120})
 const [pos,setPos]=useState({x:90,y:90})
 const [drag,setDrag]=useState<null|"move"|"resize">(null)
 const [paid,setPaid]=useState(false)
 const [signature,setSignature]=useState("")
 const [busy,setBusy]=useState(false)
 const [status,setStatus]=useState("")
 const price=useMemo(()=>calculatePrice(size.w,size.h),[size])

 async function onFile(f?:File){ if(!f)return; setFile(f); setPreview(await fileToDataUrl(f)) }
 async function connect(){ const sol=(window as any).solana; if(!sol?.isPhantom){window.open("https://phantom.app/","_blank");return} const r=await sol.connect(); setWallet(r.publicKey.toString()) }
 useEffect(()=>{
  const mm=(e:MouseEvent)=>{ if(!drag||!box.current)return; const r=box.current.getBoundingClientRect(); if(drag==='move'){setPos({x:Math.max(0,Math.min(e.clientX-r.left-size.w/2,r.width-size.w)),y:Math.max(0,Math.min(e.clientY-r.top-size.h/2,r.height-size.h))})} else {setSize({w:Math.max(22,Math.min(1000,e.clientX-r.left-pos.x)),h:Math.max(22,Math.min(1000,e.clientY-r.top-pos.y))})}}
  const mu=()=>setDrag(null); window.addEventListener('mousemove',mm); window.addEventListener('mouseup',mu); return()=>{window.removeEventListener('mousemove',mm);window.removeEventListener('mouseup',mu)}
 },[drag,pos,size])

 async function pay(){
  if(!title||!link||!preview){setStatus("Complete title, link, and image first.");return}
  if(!wallet){await connect(); return}
  setBusy(true); setStatus("Opening Phantom payment...")
  try{
   const sol=(window as any).solana
   const connection=new Connection(SITE.solanaRpc,"confirmed")
   const sender=new PublicKey(wallet), receiver=new PublicKey(SITE.receiverWallet), mint=new PublicKey(SITE.usdcMint)
   const senderAta=await getAssociatedTokenAddress(mint,sender)
   const receiverAta=await getAssociatedTokenAddress(mint,receiver)
   const tx=new Transaction()
   if(!await connection.getAccountInfo(senderAta)) throw new Error("Your Phantom has no Solana USDC token account.")
   if(!await connection.getAccountInfo(receiverAta)) tx.add(createAssociatedTokenAccountInstruction(sender,receiverAta,receiver,mint))
   tx.add(createTransferInstruction(senderAta,receiverAta,sender,BigInt(Math.round(price*1_000_000))))
   const {blockhash,lastValidBlockHeight}=await connection.getLatestBlockhash("confirmed")
   tx.recentBlockhash=blockhash; tx.feePayer=sender
   const signed=await sol.signTransaction(tx)
   const sig=await connection.sendRawTransaction(signed.serialize(),{skipPreflight:false})
   setStatus("Confirming transaction...")
   await connection.confirmTransaction({signature:sig,blockhash,lastValidBlockHeight},"confirmed")
   setSignature(sig); setPaid(true); setStatus("Paid. Now publishing...")
   await publish(sig)
  }catch(e:any){setStatus(e?.message||"Payment failed")} finally{setBusy(false)}
 }

 async function uploadImage(){
  if(!file) return preview
  const ext=(file.name.split('.').pop()||'png').toLowerCase()
  const path=`ads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const up=await supabase.storage.from(SITE.bucket).upload(path,file,{upsert:false,contentType:file.type||'image/png'})
  if(up.error) return preview
  const pub=supabase.storage.from(SITE.bucket).getPublicUrl(path)
  return pub.data.publicUrl
 }
 async function publish(sig=signature){
  setBusy(true)
  try{
   const image_url=await uploadImage()
   const row={title:title.slice(0,60),link:cleanUrl(link),image_url,wallet,price,width:Math.round(size.w),height:Math.round(size.h),x:Math.round(pos.x),y:Math.round(pos.y),tx_signature:sig}
   const {error}=await supabase.from("war_ads").insert(row)
   if(error) throw error
   await supabase.from("chat_messages").insert({wallet:wallet||"system",message:`🚨 ${title.slice(0,40)} entered the war with $${price.toFixed(2)} USDC`})
   setStatus("Published! Redirecting to war wall...")
   setTimeout(()=>location.href='/',900)
  }catch(e:any){setStatus(`Publish error: ${e.message}`)} finally{setBusy(false)}
 }
 return <main className="white-page">
  <header className="p-5 flex justify-between items-center border-b"><Link href="/" className="font-black text-2xl">← JAKWO</Link><b>Upload War Ad</b></header>
  <section className="max-w-6xl mx-auto p-4 grid lg:grid-cols-[380px_1fr] gap-6">
   <div className="space-y-4">
    <h1 className="text-4xl font-black">Place Your War Photo</h1>
    <p className="text-gray-600">Upload photo, add clickable ad link, drag/resize freely, pay USDC, publish automatically.</p>
    <label className="font-bold">Ad name</label><input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Project / meme name"/>
    <label className="font-bold">Clickable link</label><input className="input" value={link} onChange={e=>setLink(e.target.value)} placeholder="https://x.com/... or website"/>
    <label className="font-bold">Photo</label><input className="input" type="file" accept="image/*" onChange={e=>onFile(e.target.files?.[0])}/>
    <div className="border rounded-xl p-4"><p className="text-sm text-gray-500">Live price</p><p className="text-4xl font-black">${price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p><p className="text-sm">{Math.round(size.w)} × {Math.round(size.h)} px • USDC on Solana</p></div>
    {wallet?<p className="font-bold text-green-700">Connected {short(wallet)}</p>:<button className="btn" onClick={connect}>Connect Phantom</button>}
    <button className="btn dark w-full" disabled={busy} onClick={paid?()=>publish():pay}>{busy?"Working...":paid?"Publish Ad":"Pay & Publish"}</button>
    <p className="text-sm text-gray-600 break-words">Receiver wallet: {SITE.receiverWallet}</p><p className="text-sm font-bold">{status}</p>
   </div>
   <div><h2 className="font-black mb-2">Drag your photo. Pull the corner to resize.</h2><div ref={box} className="relative h-[720px] border-4 border-black rounded-xl grid-bg overflow-hidden bg-white">
    {preview?<div className="absolute select-none" onMouseDown={()=>setDrag('move')} style={{left:pos.x,top:pos.y,width:size.w,height:size.h,cursor:'move'}}><img src={preview} className="w-full h-full object-cover rounded-lg border-2 border-black shadow-xl" alt="preview"/><div className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded">${price.toFixed(2)}</div><div className="handle" onMouseDown={e=>{e.stopPropagation();setDrag('resize')}}/></div>:<div className="absolute inset-0 grid place-items-center text-gray-400 font-black text-3xl">UPLOAD IMAGE PREVIEW</div>}
   </div></div>
  </section>
 </main>
}
