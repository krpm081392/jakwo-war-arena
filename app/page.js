'use client';
import {useEffect, useMemo, useState} from 'react';
import Link from 'next/link';
import {fetchTable, memeFiles, memePath, TWITTER, TELEGRAM} from './lib';

const placements = [
  ['10948.jpg','BULLS NEVER SLEEP',58,22,16,-8], ['10952.jpg','HOODIE WOJAK',18,24,15,8],
  ['10955.jpg','DEGEN BRAIN',46,27,16,-5], ['10956.jpg','LIFE NOT FOUND',62,31,15,8],
  ['10959.jpg','MCDONALD ARC',75,30,15,-7], ['10951.jpg','NO RISK NO LAMBO',72,56,16,6],
  ['10957.jpg','PEPE SEES YOU',84,63,15,-6], ['10958.jpg','WAGMI?',65,69,14,9],
  ['10949.jpg','MARKET PAIN',9,61,16,-7], ['10945.jpg','COPE HARDER',31,70,15,-9],
  ['10950.jpg','OLD WAR',45,75,15,5], ['10946.jpg','SLEEP IS FUD',54,68,16,-2],
  ['10947.jpg','STILL HERE',22,78,15,-8], ['10953.jpg','BLOOD RED',50,84,14,9],
  ['10944.jpg','GM SURVIVOR',83,79,15,-7], ['10954.jpg','NIGHT SCROLL',34,50,13,5]
];

function Header(){
  return <>
    <div className="top-head">
      <Link href="/" className="brand"><span>JAKWO</span><b>ARENA ADS</b></Link>
      <div className="top-actions">
        <a className="jakwo-pump-exact" href="https://pump.fun/coin/EgarvX6JFtcqmjXw5aAvk9yTLa3CnwNmdbwAmwPNpump" target="_blank" rel="noopener noreferrer" aria-label="Open JAKWO on Pump.fun"><img src="/pump-fun-logo.png" alt="Pump.fun JAKWO" /></a>
        <button className="btn black" onClick={()=>window.dispatchEvent(new Event('connect-wallet'))}>CONNECT</button>
        <a className="btn tan" href={TWITTER} target="_blank">X</a>
        <a className="btn tan" href={TELEGRAM} target="_blank">TG</a>
      </div>
    </div>
    <div className="ticker"><div className="live-label">LIVE</div><div className="ticker-mask"><div className="ticker-track">No fake numbers. Real arena stats only. &nbsp;&nbsp;&nbsp; Buy. Place. Block. Repeat. &nbsp;&nbsp;&nbsp; Ads are permanent forever — only buried by newer wars. &nbsp;&nbsp;&nbsp; Latest war: NONE &nbsp;&nbsp;&nbsp;</div></div></div>
  </>;
}

function Stats({ads}){
  const total = ads.length;
  const volume = ads.reduce((s,a)=>s+Number(a.price||0),0);
  const latest = ads[0]?.name || 'NONE';
  const top = ads.length ? (ads.slice().sort((a,b)=>Number(b.price||0)-Number(a.price||0))[0]?.name || 'NONE') : 'NONE YET';
  return <div className="stats-bar">
    <div><strong>{total}</strong><span>TOTAL ADS</span></div>
    <div><strong>{volume.toFixed(2)}</strong><span>USDC IN ARENA</span></div>
    <div><strong>{latest}</strong><span>LATEST WAR</span></div>
    <div><strong>{top}</strong><span>TOP WARLORD</span></div>
  </div>;
}

function MemeWall({ads, onImage}){
  return <div className="meme-wall" aria-hidden="false">
    {placements.map((p,i)=><button key={i} className="poster" style={{left:p[2]+'%', top:p[3]+'%', width:p[4]+'vw', transform:`rotate(${p[5]}deg)`}} onClick={()=>onImage(memePath(p[0]))}>
      <img src={memePath(p[0])} alt=""/><em>{p[1]}</em>
    </button>)}
    {ads.map((ad,i)=><a key={ad.id||i} className="real-ad" href={ad.link_url||'#'} target="_blank" style={{left:(Number(ad.x)||100)/40+'%', top:(Number(ad.y)||100)/26+'%', width: Math.max(38, Math.min(280, Number(ad.w)||80))+'px', height: Math.max(38, Math.min(280, Number(ad.h)||80))+'px', zIndex:50+i}}><img src={ad.image_url} alt={ad.name||'ad'}/></a>)}
  </div>;
}

function FloatingPanel({open,title,onClose,children}){
  if(!open) return null;
  return <div className="float-panel"><div className="panel-head"><b>{title}</b><button onClick={onClose}>×</button></div>{children}</div>
}

function WarChat(){
  const [open,setOpen]=useState(false);
  return <>
    <button className="floating-btn chat-btn" onClick={()=>setOpen(true)}>💬 WAR CHAT</button>
    <FloatingPanel open={open} title="WAR CHAT" onClose={()=>setOpen(false)}>
      <p className="muted">Read free. Connect Phantom to troll. No links allowed in chat.</p>
      <div className="chat-lines">
        <p><b>System:</b> Arena opened. Connect wallet to chat.</p>
        <p><b>Admin:</b> No links in chat. Ads can have links.</p>
        <p><b>Jakwo:</b> Buy. Place. Block. Repeat.</p>
      </div>
      <div className="chat-input"><input placeholder="Connect wallet to chat" disabled/><button>➤</button></div>
    </FloatingPanel>
  </>;
}

function Rules({open,onClose}){
  return <FloatingPanel open={open} title="RULES OF THE ARENA" onClose={onClose}>
    <ol className="rules-list">
      <li>Upload one image ad.</li><li>Attach one external link.</li><li>Choose size and position.</li><li>Pay USDC on Solana.</li><li>After publish: no edit, no move, no delete, no refund.</li><li>Ads live forever but can be covered by newer ads.</li><li>No phishing, malware, hate, explicit, impersonation, or illegal ads.</li>
    </ol>
    <p className="danger">This is not a billboard. It is a battlefield.</p>
  </FloatingPanel>
}

function Warlords({ads, open, onClose}){
  const list = ads.slice().sort((a,b)=>Number(b.price||0)-Number(a.price||0)).slice(0,5);
  return <FloatingPanel open={open} title="TOP WARLORDS" onClose={onClose}>
    <div className="lords-list">{list.length?list.map((a,i)=><p key={i}>#{i+1} <b>{a.name}</b> <span>{Number(a.price||0).toFixed(2)} USDC</span></p>):<p>No warlords yet. Be first.</p>}</div>
  </FloatingPanel>
}

export default function Home(){
  const [ads,setAds]=useState([]); const [rules,setRules]=useState(false); const [lords,setLords]=useState(false); const [light,setLight]=useState(null);
  useEffect(()=>{ fetchTable('war_ads','select=*&order=created_at.desc&limit=100').then(setAds); },[]);
  return <main className="home">
    <Header/><Stats ads={ads}/>
    <section className="arena-home">
      <MemeWall ads={ads} onImage={setLight}/>
      <div className="hero-card">
        <small>PERMANENT INTERNET BATTLEFIELD</small>
        <h1>BUY.<br/>PLACE.<br/>BLOCK.<br/>REPEAT.</h1>
        <p>Every image becomes part of the wall forever. Visible or buried, it stays in arena history.</p>
      </div>
      <div className="mobile-controls">
        <Link className="btn tan" href="/story">READ STORY</Link>
        <button className="btn tan" onClick={()=>setRules(true)}>RULES</button>
        <button className="btn tan" onClick={()=>setLords(true)}>🏆 LORDS</button>
      </div>
      <Link className="floating-btn enter-btn" href="/upload">⚔ ENTER WAR</Link>
      <button className="floating-btn rules-btn desktop-only" onClick={()=>setRules(true)}>RULES</button>
      <button className="floating-btn lords-btn desktop-only" onClick={()=>setLords(true)}>🏆 TOP WARLORDS</button>
      <Link className="floating-btn story-btn desktop-only" href="/story">READ STORY</Link>
      <WarChat/><Rules open={rules} onClose={()=>setRules(false)}/><Warlords ads={ads} open={lords} onClose={()=>setLords(false)}/>
    </section>
    {light && <div className="lightbox" onClick={()=>setLight(null)}><button>×</button><img src={light} alt="expanded"/></div>}
  </main>
}
