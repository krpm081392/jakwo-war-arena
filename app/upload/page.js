'use client';
import {useEffect, useMemo, useRef, useState} from 'react';
import Link from 'next/link';
import {insertRow, priceForSize, uploadImage} from '../lib';

export default function Upload(){
  const [panel,setPanel]=useState(false);
  const [wallet,setWallet]=useState('');
  const [file,setFile]=useState(null);
  const [preview,setPreview]=useState('');
  const [name,setName]=useState('');
  const [link,setLink]=useState('');
  const [pos,setPos]=useState({x:1900,y:1200});
  const [size,setSize]=useState({w:80,h:80});
  const [drag,setDrag]=useState(false);
  const arenaRef=useRef(null);
  const price=useMemo(()=>priceForSize(size.w,size.h),[size]);

  async function connect(){
    try{
      if(!window.solana || !window.solana.isPhantom){ alert('Phantom not detected. Install Phantom or open inside Phantom browser.'); return; }
      const res=await window.solana.connect();
      setWallet(res.publicKey.toString());
    }catch(e){ alert(e.message||'Wallet connection cancelled'); }
  }
  useEffect(()=>{window.addEventListener('connect-wallet',connect); return()=>window.removeEventListener('connect-wallet',connect)},[]);
  function pick(e){ const f=e.target.files?.[0]; if(!f)return; setFile(f); const u=URL.createObjectURL(f); setPreview(u); setPanel(false); }
  function pointer(e){
    const rect=arenaRef.current?.getBoundingClientRect(); if(!rect)return;
    const clientX=e.touches?.[0]?.clientX ?? e.clientX; const clientY=e.touches?.[0]?.clientY ?? e.clientY;
    const x=Math.max(0, Math.min(4000-size.w, ((clientX-rect.left)/rect.width)*4000 - size.w/2));
    const y=Math.max(0, Math.min(2600-size.h, ((clientY-rect.top)/rect.height)*2600 - size.h/2));
    setPos({x,y});
  }
  async function publish(){
    if(!file){alert('Upload image first'); return;}
    if(!link){alert('Paste external link'); return;}
    try{
      if(!wallet){
        const demo=confirm('Phantom not connected. Continue demo publish?');
        if(!demo) return;
      }
      const image_url=await uploadImage(file);
      await insertRow('war_ads',{name:name||'Untitled War', image_url, link_url:link, x:pos.x, y:pos.y, w:size.w, h:size.h, price, wallet:wallet||'demo'});
      alert('War published!'); location.href='/';
    }catch(e){ alert(e.message || 'Publish failed'); }
  }
  const adStyle={left:`${(pos.x/4000)*100}%`,top:`${(pos.y/2600)*100}%`,width:`${(size.w/4000)*100}%`,height:`${(size.h/2600)*100}%`};
  return <main className="upload-page">
    <div className="upload-head"><Link href="/" className="brand"><span>JAKWO</span><b>WAR ARENA</b></Link><div><button className="btn phantom" onClick={connect}>{wallet?'CONNECTED':'CONNECT PHANTOM'}</button><button className="btn red" onClick={()=>setPanel(!panel)}>ADD AD</button></div></div>
    <div className="arena-canvas" ref={arenaRef} onMouseMove={drag?pointer:undefined} onMouseUp={()=>setDrag(false)} onTouchMove={drag?pointer:undefined} onTouchEnd={()=>setDrag(false)}>
      {preview && <div className="draft-ad" style={adStyle} onMouseDown={(e)=>{e.preventDefault();setDrag(true);pointer(e)}} onTouchStart={(e)=>{setDrag(true);pointer(e)}}><img src={preview}/><button className="draft-x" onClick={(e)=>{e.stopPropagation();setFile(null);setPreview('')}}>×</button><i /></div>}
    </div>
    {panel && <div className="ad-panel">
      <button className="panel-close" onClick={()=>setPanel(false)}>×</button><h2>ADD AD</h2>
      <label>1 Upload Image</label><label className="upload-box"><input type="file" accept="image/*" onChange={pick}/>{preview?'Image loaded. Drag it on the arena.':'Click or drag image here'}</label>
      <label>2 Paste External Link</label><input value={link} onChange={e=>setLink(e.target.value)} placeholder="https://yourlink.com"/>
      <label>3 Ad Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Project / ad name"/>
      <label>4 Size</label><div className="size-row"><input type="number" min="40" max="1000" value={size.w} onChange={e=>setSize(s=>({...s,w:Number(e.target.value)||40}))}/><input type="number" min="40" max="1000" value={size.h} onChange={e=>setSize(s=>({...s,h:Number(e.target.value)||40}))}/></div>
      <button className="btn phantom wide" onClick={connect}>{wallet?'Wallet Connected':'Connect Phantom'}</button><button className="btn red wide" onClick={publish}>SEND TO WAR 🚀</button>
    </div>}
    <div className="cost-badge"><b>{price.toFixed(2)} USDC</b><span className="desktop-cost">Selected area price</span></div>
  </main>
}
