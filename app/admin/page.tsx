"use client"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import { SITE } from "@/lib/config"
import type { SiteSettings } from "@/lib/types"

async function fileToDataUrl(file:File){return await new Promise<string>((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result));r.onerror=rej;r.readAsDataURL(file)})}

type Dec = {type:'image'|'text'; url?:string; text?:string; x:number; y:number; w:number; h:number; size?:number}

export default function Admin(){
 const board=useRef<HTMLDivElement>(null)
 const [pass,setPass]=useState("")
 const [ok,setOk]=useState(false)
 const [settings,setSettings]=useState<SiteSettings>({id:1,ticker_items:["🔥 JAKWO TIMES LIVE","⚔️ Meme war ads started","💬 Wallet chat open"],background_url:null,decorations:[]})
 const [selected,setSelected]=useState<number|null>(null)
 const [drag,setDrag]=useState(false)
 const [status,setStatus]=useState("")
 useEffect(()=>{ if(localStorage.getItem('jakwoAdmin')==='yes'){setOk(true);load()}},[])
 async function login(){ if(pass===SITE.adminPassword){localStorage.setItem('jakwoAdmin','yes');setOk(true);load()} else alert('Wrong password') }
 async function load(){ const {data}=await supabase.from('site_settings').select('*').eq('id',1).maybeSingle(); if(data)setSettings(data as SiteSettings) }
 async function upload(file:File){ const ext=(file.name.split('.').pop()||'png').toLowerCase(); const path=`admin/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`; const up=await supabase.storage.from(SITE.bucket).upload(path,file,{contentType:file.type,upsert:false}); if(up.error)return await fileToDataUrl(file); return supabase.storage.from(SITE.bucket).getPublicUrl(path).data.publicUrl }
 async function setBg(file?:File){ if(!file)return; const url=await upload(file); setSettings(s=>({...s,background_url:url})) }
 async function addImage(file?:File){ if(!file)return; const url=await upload(file); setSettings(s=>({...s,decorations:[...(s.decorations||[]),{type:'image',url,x:80,y:80,w:160,h:160}]})) }
 function addText(){ const text=prompt('Text to add?')||'BREAKING NEWS'; setSettings(s=>({...s,decorations:[...(s.decorations||[]),{type:'text',text,x:120,y:120,w:240,h:80,size:32}]})) }
 function updateTicker(v:string){ setSettings(s=>({...s,ticker_items:v.split('\n').map(x=>x.trim()).filter(Boolean)})) }
 async function save(){ setStatus('Saving...'); const {error}=await supabase.from('site_settings').upsert(settings); setStatus(error?error.message:'Saved! Homepage updated.') }
 function move(e:React.MouseEvent){ if(!drag||selected===null||!board.current)return; const r=board.current.getBoundingClientRect(); const d=[...settings.decorations]; d[selected]={...d[selected],x:Math.max(0,e.clientX-r.left-d[selected].w/2),y:Math.max(0,e.clientY-r.top-d[selected].h/2)}; setSettings(s=>({...s,decorations:d})) }
 function resize(i:number, dw:number, dh:number){ const d=[...settings.decorations]; d[i]={...d[i],w:Math.max(30,d[i].w+dw),h:Math.max(30,d[i].h+dh),size:Math.max(10,(d[i].size||32)+Math.round(dw/8))}; setSettings(s=>({...s,decorations:d})) }
 function del(){ if(selected===null)return; const d=[...settings.decorations]; d.splice(selected,1); setSettings(s=>({...s,decorations:d,})); setSelected(null) }
 if(!ok)return <main className="white-page grid place-items-center"><div className="max-w-sm w-full p-6 border rounded-xl"><h1 className="text-3xl font-black mb-4">JAKWO Admin</h1><input className="input" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Admin password"/><button className="btn dark mt-4 w-full" onClick={login}>Login</button><p className="text-sm text-gray-500 mt-3">Set NEXT_PUBLIC_ADMIN_PASSWORD in Vercel.</p></div></main>
 return <main className="white-page">
  <header className="p-5 flex justify-between items-center border-b"><Link href="/" className="font-black text-2xl">← JAKWO</Link><button className="btn dark" onClick={save}>Save Changes</button></header>
  <section className="grid lg:grid-cols-[360px_1fr] gap-4 p-4">
   <aside className="space-y-4"><h1 className="text-3xl font-black">Owner Canvas Editor</h1><p>No code needed. Change top news, background, photos, memes, and text.</p>
    <label className="font-bold">News ticker, one line each</label><textarea className="input h-40" value={(settings.ticker_items||[]).join('\n')} onChange={e=>updateTicker(e.target.value)}/>
    <label className="font-bold">Change background</label><input className="input" type="file" accept="image/*" onChange={e=>setBg(e.target.files?.[0])}/>
    <label className="font-bold">Add meme/photo decoration</label><input className="input" type="file" accept="image/*" onChange={e=>addImage(e.target.files?.[0])}/>
    <div className="flex gap-2"><button className="btn" onClick={addText}>Add Text</button><button className="btn" onClick={del}>Delete Selected</button></div>
    <p className="font-bold">{status}</p><p className="text-sm text-gray-500">Tip: click item, drag it. Use + / - resize buttons on selected item.</p>
   </aside>
   <div><h2 className="font-black mb-2">Homepage design canvas</h2><div ref={board} className="relative h-[760px] rounded-xl border-4 border-black overflow-hidden bg-[#ead49a]" onMouseMove={move} onMouseUp={()=>setDrag(false)}>
    {settings.background_url&&<img src={settings.background_url} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="bg"/>}
    {(settings.decorations||[]).map((d:Dec,i:number)=><div key={i} className="admin-item" onMouseDown={()=>{setSelected(i);setDrag(true)}} style={{left:d.x,top:d.y,width:d.w,height:d.h,zIndex:i+1,outline:selected===i?'4px solid red':'none',fontSize:d.size||32}}>{d.type==='text'?<div className="font-black p-2">{d.text}</div>:<img src={d.url} className="w-full h-full object-contain" alt="dec"/>}{selected===i&&<div className="absolute -top-10 left-0 flex gap-1"><button className="btn" onClick={(e)=>{e.stopPropagation();resize(i,20,20)}}>+</button><button className="btn" onClick={(e)=>{e.stopPropagation();resize(i,-20,-20)}}>-</button></div>}</div>)}
   </div></div>
  </section>
 </main>
}
