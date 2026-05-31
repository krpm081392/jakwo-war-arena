const cfg = window.JAKWO_CONFIG || {};
const state = { wallet: localStorage.getItem('jakwo_wallet') || '', draft: null, dragging: null, resizing: null, offsetX:0, offsetY:0 };
const $ = (id)=>document.getElementById(id);
const panelContent = $('panelContent');

function init(){
  $('twitterLink').href = cfg.TWITTER || '#';
  $('telegramLink').href = cfg.TELEGRAM || '#';
  updateWalletUI();
  loadLocalAds();
  bindEvents();
  updateStats();
}
function bindEvents(){
  $('connectWallet')?.addEventListener('click', connectWallet);
  $('placeAdBtn')?.addEventListener('click', openSheet);
  $('mobilePlaceAd')?.addEventListener('click', openSheet);
  $('closeSheet')?.addEventListener('click', closeSheet);
  $('closePanel')?.addEventListener('click', ()=>$('panel').classList.add('hidden'));
  document.querySelectorAll('[data-panel]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.panel)));
  $('imageInput')?.addEventListener('change', handleImage);
  $('sizeSlider')?.addEventListener('input', applySliderSize);
  $('deleteDraft')?.addEventListener('click', deleteDraft);
  $('deployBtn')?.addEventListener('click', deployDraft);
  window.addEventListener('storage',()=>{ state.wallet=localStorage.getItem('jakwo_wallet')||''; updateWalletUI(); });
}
async function connectWallet(){
  try{
    if(window.solana && window.solana.isPhantom){
      const res = await window.solana.connect();
      state.wallet = res.publicKey.toString();
    }else{
      const demo = confirm('Phantom not detected. Use demo wallet for UI testing?');
      if(!demo) return;
      state.wallet = 'DEMO-' + Math.random().toString(36).slice(2,8).toUpperCase();
    }
    localStorage.setItem('jakwo_wallet', state.wallet);
    updateWalletUI();
  }catch(e){ alert('Wallet connect cancelled.'); }
}
function shortWallet(w){return w ? w.slice(0,4)+'...'+w.slice(-4) : 'Connect Phantom'}
function updateWalletUI(){ const b=$('connectWallet'); if(b) b.textContent = shortWallet(state.wallet); }

function openPanel(type){
  const html = {
    rules: rulesHTML(),
    chat: chatHTML(),
    story: storyHTML(),
    lords: lordsHTML()
  }[type] || '';
  panelContent.innerHTML = html;
  $('panel').classList.remove('hidden');
  if(type==='chat') bindChat();
}
function rulesHTML(){return `<div class="rules-text"><h2>📜 MEME WAR ADS ARENA – OFFICIAL RULES</h2>
<h3>1. Overview</h3><p>Meme War Ads Arena is a digital advertising battleground where users upload an image ad with one external link, place it anywhere, resize it freely before deployment, and pay based on the size/coverage they choose. Ads are permanent once placed and can be blocked or covered by future ads. There are no removals, no edits, and no refunds after deployment.</p>
<h3>2. Pricing</h3><p>Minimum ad cost is <b>0.50 USDC</b>. Full arena domination is <b>1,000,000 USDC</b>. Price is calculated by the size of the ad on the arena.</p>
<h3>3. Placement Rules</h3><p>✔ Users may place their ad anywhere. ✔ Before deployment, users may move, resize, delete, or change the draft. ✔ After deployment, the ad cannot be moved, removed, resized, or edited. ✔ Ads can be placed on top of or covering other ads. Whoever places last on that spot is visible. Older ads remain underneath.</p>
<h3>4. Blocking and War Rules</h3><p>Users can block or cover other ads by placing a new ad on top. No refunds if your ad gets covered. Fight back by buying and placing another ad.</p><blockquote>This is not a billboard. It’s a battlefield.</blockquote>
<h3>5. Permanency</h3><p>Once an ad is placed, it becomes part of permanent arena history. Visible or buried, but never removed unless it violates safety rules.</p>
<h3>6. External Links</h3><p>Each ad can include one clickable external link. JAKWO does not verify external links. Clicking any link is at your own risk.</p>
<h3>7. Restrictions</h3><p>🚫 Hate, racism, violence, extremist content, pornography, malware, phishing, wallet drainers, illegal links, impersonation, and false guaranteed profit ads are prohibited. Violating ads may be removed without refund.</p>
<h3>8. Final Rule</h3><blockquote>Buy. Place. Block. Repeat.</blockquote></div>`}
function storyHTML(){return `<h2>📖 The Story</h2><p>The internet became a battlefield. Memes became weapons. Attention became territory.</p><p>JAKWO is the arena where every image becomes history. You do not rent space. You claim it.</p><p><a class="btn" href="story.html">Open full story</a></p>`}
function lordsHTML(){const ads=getAds(); const by={}; ads.forEach(a=>{by[a.wallet||'unknown']=(by[a.wallet||'unknown']||0)+Number(a.amount||0)}); const rows=Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([w,a],i)=>`<p><b>#${i+1}</b> ${shortWallet(w)} — ${a.toFixed(2)} USDC</p>`).join('')||'<p>No warlords yet.</p>';return `<h2>🏆 Top Warlords</h2>${rows}`}
function chatHTML(){return `<h2>💬 War Chat</h2><div id="chatMessages" class="rules-text"><p>Connect wallet to send messages.</p></div><input id="chatInput" class="input" placeholder="Troll message, no links"><button id="sendChat" class="btn primary" style="margin-top:10px">Send</button>`}
function bindChat(){ $('sendChat').addEventListener('click',()=>{ if(!state.wallet) return alert('Connect wallet first.'); const msg=$('chatInput').value.trim(); if(!msg) return; if(/https?:\/\//i.test(msg)) return alert('No links in chat.'); const box=$('chatMessages'); box.innerHTML += `<p><b>${shortWallet(state.wallet)}:</b> ${escapeHTML(msg)}</p>`; $('chatInput').value=''; });}

function openSheet(){ $('adSheet').classList.remove('hidden'); }
function closeSheet(){ $('adSheet').classList.add('hidden'); }
function handleImage(e){ const file=e.target.files[0]; if(!file) return; const url=URL.createObjectURL(file); createDraft(url); }
function createDraft(url){ deleteDraft(); const arena=$('draftLayer'); const el=document.createElement('div'); el.className='draft-ad'; el.style.left='120px'; el.style.top='120px'; el.style.width='120px'; el.style.height='120px'; el.innerHTML=`<img src="${url}"><button class="draft-delete">×</button><div class="resize-handle"></div>`; arena.appendChild(el); state.draft={el,url,w:120,h:120,x:120,y:120}; bindDraft(el); updatePrice(); closeSheet(); }
function bindDraft(el){
  el.querySelector('.draft-delete').addEventListener('click', deleteDraft);
  el.addEventListener('pointerdown', e=>{ if(e.target.classList.contains('resize-handle')||e.target.classList.contains('draft-delete')) return; state.dragging=el; const r=el.getBoundingClientRect(); state.offsetX=e.clientX-r.left; state.offsetY=e.clientY-r.top; el.setPointerCapture(e.pointerId); });
  el.querySelector('.resize-handle').addEventListener('pointerdown', e=>{ state.resizing=el; el.setPointerCapture(e.pointerId); e.stopPropagation(); });
  el.addEventListener('pointermove', e=>{ if(state.dragging===el){ const parent=$('arenaViewport').getBoundingClientRect(); const x=e.clientX-parent.left+$('arenaViewport').scrollLeft-state.offsetX; const y=e.clientY-parent.top+$('arenaViewport').scrollTop-state.offsetY; setDraftPos(x,y); } if(state.resizing===el){ const r=el.getBoundingClientRect(); const nw=Math.max(40,e.clientX-r.left); const nh=Math.max(40,e.clientY-r.top); setDraftSize(nw,nh); } });
  el.addEventListener('pointerup', e=>{state.dragging=null;state.resizing=null;});
}
function setDraftPos(x,y){ if(!state.draft)return; state.draft.x=Math.max(0,x); state.draft.y=Math.max(0,y); state.draft.el.style.left=state.draft.x+'px'; state.draft.el.style.top=state.draft.y+'px'; }
function setDraftSize(w,h){ if(!state.draft)return; state.draft.w=w; state.draft.h=h; state.draft.el.style.width=w+'px'; state.draft.el.style.height=h+'px'; $('sizeSlider').value=Math.min(100,Math.max(1,Math.round((w*h)/(1200*900)*100))); updatePrice(); }
function applySliderSize(){ if(!state.draft)return; const pct=Number($('sizeSlider').value)/100; const area=1200*900*pct; const side=Math.sqrt(area); setDraftSize(side,side); }
function calcPrice(){ if(!state.draft)return cfg.MIN_PRICE||.5; const cov=Math.min(1,(state.draft.w*state.draft.h)/(1200*900)); const min=cfg.MIN_PRICE||.5,max=cfg.MAX_PRICE||1000000; return min + Math.pow(cov,2.15)*(max-min); }
function updatePrice(){ const price=calcPrice(); const cov=state.draft?((state.draft.w*state.draft.h)/(1200*900)*100):0; $('liveCost').textContent=price.toLocaleString(undefined,{maximumFractionDigits:2})+' USDC'; $('sheetPrice').textContent=price.toLocaleString(undefined,{maximumFractionDigits:2})+' USDC'; $('coverageText').textContent=cov.toFixed(2)+'%'; }
function deleteDraft(){ if(state.draft?.el) state.draft.el.remove(); state.draft=null; updatePrice(); }
function deployDraft(){
  if(!state.draft) return alert('Choose a photo first.');
  if(!state.wallet) return alert('Connect Phantom first.');
  const voucher=$('voucherCode').value.trim();
  const price=calcPrice();
  const ok = voucher ? confirm('Use voucher and deploy? Code will be burned in production.') : confirm(`Production must open Phantom payment for ${price.toFixed(2)} USDC. For UI test, lock this ad now?`);
  if(!ok) return;
  const ad={id:Date.now(),image:state.draft.url,link:$('adLink').value.trim(),wallet:state.wallet,amount:voucher?0:price,x:state.draft.x,y:state.draft.y,w:state.draft.w,h:state.draft.h,created_at:new Date().toISOString(),voucher_code:voucher||''};
  const ads=getAds(); ads.push(ad); localStorage.setItem('jakwo_ads',JSON.stringify(ads));
  addAdToDom(ad); deleteDraft(); closeSheet(); updateStats(); warImpact(price); alert('Ad locked in demo state. Production payment verification still required before public launch.');
}
function getAds(){ try{return JSON.parse(localStorage.getItem('jakwo_ads')||'[]')}catch{return[]} }
function loadLocalAds(){ getAds().forEach(addAdToDom); updateStats(); }
function addAdToDom(ad){ const el=document.createElement('a'); el.className='war-ad locked'; el.href=ad.link||'#'; el.target='_blank'; el.style.left=ad.x+'px'; el.style.top=ad.y+'px'; el.style.width=ad.w+'px'; el.style.height=ad.h+'px'; el.style.zIndex=100+Number(ad.id||0)%100000; el.title=`${Number(ad.amount||0).toFixed(2)} USDC • ${shortWallet(ad.wallet)}`; el.innerHTML=`<img src="${ad.image}">`; $('adLayer').appendChild(el); $('emptyCallout').style.display='none'; }
function updateStats(){ const ads=getAds(); $('totalAds').textContent=ads.length; const vol=ads.reduce((s,a)=>s+Number(a.amount||0),0); $('usdcVolume').textContent=vol.toLocaleString(undefined,{maximumFractionDigits:2}); $('latestWar').textContent=ads.length?shortWallet(ads[ads.length-1].wallet):'None'; const top={}; ads.forEach(a=>top[a.wallet]=(top[a.wallet]||0)+Number(a.amount||0)); const tw=Object.entries(top).sort((a,b)=>b[1]-a[1])[0]; $('topWarlord').textContent=tw?shortWallet(tw[0]):'None'; if(ads.length)$('emptyCallout').style.display='none'; }
function warImpact(price){ document.body.classList.add('impact'); if(navigator.vibrate) navigator.vibrate(price>100000?[250,80,250,80,250]:[80]); setTimeout(()=>document.body.classList.remove('impact'),900); if(price>=1000000) alert('🚨 TSUNAMI ALERT: ARENA DOMINATOR DETECTED. Lockdown mode should trigger in production.'); }
function escapeHTML(s){return s.replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
init();
