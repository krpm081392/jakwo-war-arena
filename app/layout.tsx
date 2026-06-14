import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "JAKWO Meme War Ads",
  description: "Clickable Solana meme ad war wall",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}<script dangerouslySetInnerHTML={{__html: `(function(){
  var URL='https://pump.fun/coin/EgarvX6JFtcqmjXw5aAvk9yTLa3CnwNmdbwAmwPNpump';
  var IMG='/pump-fun-logo.png';
  function makeBtn(){
    var a=document.createElement('a');
    a.href=URL; a.target='_blank'; a.rel='noopener noreferrer';
    a.className='jakwo-pump-exact';
    a.setAttribute('aria-label','Open JAKWO on Pump.fun');
    a.style.cssText='display:inline-flex!important;align-items:center!important;justify-content:center!important;width:48px!important;height:34px!important;padding:2px 4px!important;border:2px solid #2a1206!important;border-radius:12px!important;background:#fff4df!important;box-shadow:3px 3px 0 #261405!important;cursor:pointer!important;pointer-events:auto!important;z-index:999999!important;flex:0 0 auto!important;margin:0 4px!important;';
    var im=document.createElement('img');
    im.src=IMG; im.alt='Pump.fun JAKWO';
    im.style.cssText='display:block!important;height:28px!important;width:auto!important;max-width:40px!important;object-fit:contain!important;pointer-events:none!important;';
    a.appendChild(im);
    return a;
  }
  function installPump(){
    var existing=document.querySelector('a.jakwo-pump-exact, a[data-jakwo-pump], a.pump-link, a.pump-direct-link');
    if(existing){
      existing.href=URL; existing.target='_blank'; existing.rel='noopener noreferrer';
      existing.style.display='inline-flex'; existing.style.pointerEvents='auto'; existing.style.visibility='visible'; existing.style.opacity='1';
      existing.innerHTML='<img src="'+IMG+'" alt="Pump.fun JAKWO" style="display:block!important;height:28px!important;width:auto!important;max-width:40px!important;object-fit:contain!important;pointer-events:none!important;">';
      return;
    }
    var header=document.querySelector('header.topbar, .topbar, .top-head, .upload-head, header');
    if(!header) return;
    var actions=header.querySelector('.top-actions, .actions, nav, div:last-child') || header.lastElementChild || header;
    var wallet=header.querySelector('button, .wallet, .connect, [class*=wallet], [class*=connect]');
    var btn=makeBtn();
    btn.setAttribute('data-jakwo-pump','true');
    if(wallet && wallet.parentNode) wallet.parentNode.insertBefore(btn, wallet);
    else if(actions && actions.insertBefore) actions.insertBefore(btn, actions.firstChild);
    else header.appendChild(btn);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', installPump); else installPump();
  setTimeout(installPump,100); setTimeout(installPump,500); setTimeout(installPump,1500); setTimeout(installPump,3000);
})();`}} /></body></html>
}
