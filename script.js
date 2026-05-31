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
<h3>1. Overview</h3><p>Meme War Ads Arena is a digital advertising battleground where users upload one image ad with one external link and place it anywhere on the arena. Before final deployment, users may move, resize, replace, or delete the draft. Once deployed after payment or a valid voucher, the ad becomes permanent and locked. It cannot be moved, resized, edited, deleted, or refunded. Future ads can cover it.</p>
<h3>2. Payment and Pricing</h3><p>Minimum placement starts at <b>0.50 USDC</b>. Full arena domination costs <b>1,000,000 USDC</b>. Price is calculated from the ad's size / arena coverage while the user resizes it. Users may buy multiple ads.</p>
<h3>3. Placement Rules</h3><p>✔ Users may place their ad anywhere on the arena. ✔ Before deployment, users may freely move and resize their draft. ✔ After deployment, the ad cannot be moved, removed, resized, or edited. ✔ Ads can be placed on top of or covering other ads. ✔ The newest ad on that area remains visible.</p><blockquote>Whoever places last on that spot is visible. Older ads remain underneath but are not removed.</blockquote>
<h3>4. Blocking and War Rules</h3><p>Users can block or cover other ads by placing a new ad on top. Ads cannot be reactivated or reclaimed unless a new ad is purchased and placed again. No refunds if your ad gets covered. Users can fight back by buying and placing more ads.</p><blockquote>This is not a billboard. It’s a battlefield.</blockquote>
<h3>5. Permanency</h3><p><b>Move after deployment:</b> ❌ No<br><b>Resize after deployment:</b> ❌ No<br><b>Edit image/link:</b> ❌ No<br><b>Remove/delete:</b> ❌ No<br><b>Refund:</b> ❌ No<br><b>Purchase another ad:</b> ✔ Yes<br><b>Cover/block other ads:</b> ✔ Yes</p><blockquote>Once an ad is placed, it becomes part of permanent arena history.</blockquote>
<h3>6. External Links and Click Risk</h3><p>Each ad can include one clickable external link such as a website, Telegram, X/Twitter, YouTube, product page, token, or project page. Meme War Ads Arena does not verify or guarantee the safety of external links. Clicking any link is at your own risk.</p>
<h3>7. Content Restrictions</h3><p>🚫 Hate, racism, violence, extremist content<br>🚫 Pornographic or sexually explicit material<br>🚫 Malware, phishing, wallet drainers, illegal links<br>🚫 Fake impersonation of people, brands, or companies<br>🚫 False financial claims or “guaranteed profit” ads</p><p>If an ad violates these rules, it may be removed without refund.</p>
<h3>8. Liability Disclaimer</h3><p>Meme War Ads Arena is a public user-generated advertising platform. All ads, images, and external links are uploaded and managed by users. We do not verify, approve, or validate the accuracy, safety, or legitimacy of any advertisement. Advertisers are fully responsible for their uploaded content. Users click on ads at their own risk. Meme War Ads Arena is not liable for any financial loss, scam, or damage caused by user-posted content or links.</p>
<h3>9. Reporting Ads</h3><p>Users may report illegal content, unsafe links, hate, scams, or explicit material. Reported ads may be reviewed and removed if confirmed to violate content policies. Refunds will not be given for removed ads.</p>
<h3>10. Final Rule</h3><blockquote>Buy. Place. Block. Repeat. Once your ad enters the arena, it lives there forever — visible or buried, but never removed.</blockquote></div>`}
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
