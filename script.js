const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const cfg = window.JAKWO_CONFIG || {};
const state = { wallet: localStorage.getItem('jakwo_wallet') || '', image: '', coverage: 1, deployed: false };

function shortWallet(w){ return w ? w.slice(0,4)+'...'+w.slice(-4) : ''; }
function syncWallet(){
  const btn = $('#connectBtn'); if(!btn) return;
  if(state.wallet){ btn.textContent = shortWallet(state.wallet); btn.classList.add('connected'); }
  else { btn.textContent = 'CONNECT WALLET'; btn.classList.remove('connected'); }
}
async function connectWallet(){
  try{
    if(window.solana && window.solana.isPhantom){
      const res = await window.solana.connect();
      state.wallet = res.publicKey.toString();
    } else {
      state.wallet = 'DEMO'+Math.random().toString(36).slice(2,10).toUpperCase();
      alert('Phantom not detected. Demo wallet connected for testing.');
    }
    localStorage.setItem('jakwo_wallet', state.wallet); syncWallet();
  }catch(e){ alert('Wallet connection cancelled.'); }
}
function priceFromCoverage(c){
  const minCover = 0.0385;
  if(c >= 100) return 1000000;
  const p = 0.5 * Math.pow(c/minCover, 1.55);
  return Math.min(1000000, Math.max(0.5, p));
}
function fmt(n){ return n>=1000 ? n.toLocaleString(undefined,{maximumFractionDigits:0}) : n.toFixed(2); }
function updatePrice(){
  const p = priceFromCoverage(state.coverage);
  $('#coverageText') && ($('#coverageText').textContent = state.coverage.toFixed(state.coverage<1?2:1)+'%');
  $('#priceText') && ($('#priceText').textContent = fmt(p)+' USDC');
  $('#liveCost') && ($('#liveCost').textContent = fmt(p)+' USDC');
}
function openSheet(){ $('#sheet')?.classList.add('open'); }
function closeSheet(){ $('#sheet')?.classList.remove('open'); }
function loadImage(file){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => { state.image = e.target.result; $('#adPreview').src = state.image; $('#userAd').classList.remove('hidden'); $('#emptyWarfield')?.classList.add('hidden'); closeSheet(); updateAdSize(); };
  reader.readAsDataURL(file);
}
function updateAdSize(){
  const ad = $('#userAd'); if(!ad) return;
  const bf = $('#battlefield');
  const area = bf.clientWidth * bf.clientHeight * (state.coverage/100);
  const ratio = 1.55;
  const w = Math.sqrt(area*ratio); const h = w/ratio;
  ad.style.width = Math.max(40, Math.min(w, bf.clientWidth))+'px';
  ad.style.height = Math.max(30, Math.min(h, bf.clientHeight))+'px';
}
function makeDraggable(el){
  let sx=0,sy=0,ox=0,oy=0,drag=false;
  el.addEventListener('pointerdown', e=>{ if(e.target.classList.contains('remove')) return; drag=true; el.setPointerCapture(e.pointerId); sx=e.clientX; sy=e.clientY; ox=el.offsetLeft; oy=el.offsetTop; });
  el.addEventListener('pointermove', e=>{ if(!drag) return; const bf=$('#battlefield'); let x=ox+e.clientX-sx; let y=oy+e.clientY-sy; x=Math.max(0,Math.min(x,bf.clientWidth-el.offsetWidth)); y=Math.max(0,Math.min(y,bf.clientHeight-el.offsetHeight)); el.style.left=x+'px'; el.style.top=y+'px'; });
  el.addEventListener('pointerup', ()=>drag=false);
}
function deploy(){
  if(!state.image) return alert('Choose image first.');
  if(!state.wallet) return alert('Connect wallet first.');
  $('#confirmBtn').classList.remove('hidden');
  $('#deployBtn').textContent='PREVIEW ON ARENA';
}
function confirmDeploy(){
  const voucher = ($('#voucherCode')?.value || '').trim();
  if(!voucher && !confirm('This is the payment step. In final launch this opens Phantom USDC payment. Continue DEMO deploy for testing only?')) return;
  if(state.coverage >= 100){ alert('🚨 TSUNAMI ALERT: 1M DOMINATOR ACTIVE. Arena lockdown would start now.'); }
  impact();
  closeSheet();
  state.deployed = true; $('#userAd')?.classList.add('deployed','locked');
  $('#confirmBtn').classList.add('hidden');
  $('#deployBtn').textContent='DEPLOY TO WAR';
  const count = Number(localStorage.getItem('jakwo_ads')||0)+1;
  localStorage.setItem('jakwo_ads', count); $('#totalAds').textContent = count;
  $('#latestWar').textContent = 'YOUR AD';
  alert('✅ Ad deployed! Your weapon is now live in the arena.');
}
function impact(){
  document.body.classList.add('impact');
  const cards = $$('.meme-card');
  cards.sort(()=>Math.random()-.5).slice(0, state.coverage>30?5:2).forEach(c=>c.classList.add('fall'));
  if(navigator.vibrate) navigator.vibrate(state.coverage>=100?[300,100,300,100,600]:[80,60,120]);
  setTimeout(()=>document.body.classList.remove('impact'), 1200);
}
function panel(type){
  const content = $('#panelContent');
  const box = {
    rules:`<h2>RULES OF THE ARENA</h2><p><b>1.</b> Ads are permanent after deployment.<br><b>2.</b> No refunds after publish.<br><b>3.</b> No edits, no moving, no deleting after deploy.<br><b>4.</b> Ads can be covered by newer ads.<br><b>5.</b> Links are clicked at user risk.<br><b>6.</b> No phishing, malware, porn, hate, illegal content, impersonation, or scam links.<br><b>7.</b> Rule-breaking ads can be removed without refund.</p>`,
    chat:`<h2>WAR CHAT</h2><p>Read free. Connect wallet to troll. No links allowed in chat.</p><input placeholder='Connect wallet to chat' style='width:100%;padding:14px;background:#080a0d;color:#fff;border:1px solid #333;border-radius:8px'>`,
    lords:`<h2>TOP WARLORDS</h2><p>#1 NONE YET<br>#2 OPEN<br>#3 OPEN</p>`
  }[type] || '<h2>JAKWO</h2>';
  content.innerHTML = box; $('#panel').classList.remove('hidden');
}
function initAdmin(){
  if(!location.pathname.includes('admin')) return;
  const codes = JSON.parse(localStorage.getItem('jakwo_codes')||'[]');
  window.generateCodes = function(tier,max,count){
    const existing = codes.filter(c=>c.tier===tier).length;
    const can = Math.max(0, Math.min(count, max-existing));
    for(let i=0;i<can;i++) codes.push({code:`JAKWO-${tier}-${String(existing+i+1).padStart(4,'0')}-${Math.random().toString(36).slice(2,6).toUpperCase()}`,tier,used:false});
    localStorage.setItem('jakwo_codes', JSON.stringify(codes)); renderCodes();
  }
  window.renderCodes = function(){ const out=$('#codes'); if(out) out.textContent = JSON.stringify(codes,null,2); }
  renderCodes();
}

document.addEventListener('DOMContentLoaded',()=>{
  $('#xLink') && ($('#xLink').href = cfg.TWITTER || '#'); $('#tgLink') && ($('#tgLink').href = cfg.TELEGRAM || '#');
  syncWallet(); updatePrice(); $('#totalAds') && ($('#totalAds').textContent = localStorage.getItem('jakwo_ads') || '0');
  $('#connectBtn')?.addEventListener('click', connectWallet);
  $('#placeAdBtn')?.addEventListener('click', openSheet); $('#mobilePlaceBtn')?.addEventListener('click', openSheet); $('#emptyPlaceBtn')?.addEventListener('click', openSheet); $('#closeSheet')?.addEventListener('click', closeSheet);
  $('#imageInput')?.addEventListener('change',e=>loadImage(e.target.files[0])); $('#fileInput')?.addEventListener('change',e=>loadImage(e.target.files[0]));
  $('#coverageSlider')?.addEventListener('input',e=>{ state.coverage=Number(e.target.value); updatePrice(); updateAdSize(); });
  $('#deployBtn')?.addEventListener('click', deploy); $('#confirmBtn')?.addEventListener('click', confirmDeploy);
  $('#removeAd')?.addEventListener('click',()=>{$('#userAd').classList.add('hidden'); $('#emptyWarfield')?.classList.remove('hidden'); state.image='';});
  $$('.side-rail button,.mobile-nav button').forEach(b=>b.addEventListener('click',()=>panel(b.dataset.panel)));
  $('#closePanel')?.addEventListener('click',()=>$('#panel').classList.add('hidden'));
  $$('.meme-card').forEach(card=>{ makeDraggable(card); card.addEventListener('click',()=>{card.style.transition='transform .45s'; card.style.transform=`rotate(${Math.random()*40-20}deg) scale(${.95+Math.random()*.2})`; setTimeout(()=>card.style.transition='',500);}); });
  $('#userAd') && makeDraggable($('#userAd'));
  initAdmin();
});
