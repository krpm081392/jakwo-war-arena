'use client';
import {useState} from 'react';
import Link from 'next/link';
import {memePath} from '../lib';
const chapters=[
 ['10946.jpg','THE FACE THEY NEEDED','At first, Wojak was only a tired shape the internet used when words were not enough. He became every loss, every late night, every silent laugh, every failure people were too embarrassed to explain.'],
 ['10952.jpg','THE SILENCE UNDERNEATH','Behind the meme was Jakwo: the one who still felt. Quiet, unseen, and buried under every repost, he watched the world laugh at a face that was never fully his.'],
 ['10956.jpg','THE MARKET PAIN','Then came the charts, the rugs, the candles, the promises, and the red lines. Wojak became the trader who knew hope was dangerous but clicked buy anyway.'],
 ['10959.jpg','THE WORKER ARC','When the noise stopped, Wojak still had to wake up. The internet joked, the market dumped, and the uniform waited. The arena remembered everything.'],
 ['10948.jpg','THE WAR WALL','So Jakwo built a wall where every image could survive. Not clean. Not fair. Permanent. Covered maybe, forgotten never. Buy. Place. Block. Repeat.']
];
export default function Story(){ const [open,setOpen]=useState(null); return <main className="story-page"><nav><Link href="/">← BACK TO ARENA</Link><b>THE JAKWO CHRONICLES</b><Link href="/upload">ENTER WAR</Link></nav><section>{chapters.map((c,i)=><article key={i} className="story-chapter"><button onClick={()=>setOpen(memePath(c[0]))}><img src={memePath(c[0])}/></button><div><h2>{c[1]}</h2><p>{c[2]}</p></div></article>)}</section>{open&&<div className="lightbox" onClick={()=>setOpen(null)}><button>×</button><img src={open}/></div>}</main>}
