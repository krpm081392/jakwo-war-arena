(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const arena = $('#arena');
  const sheet = $('#sheet');
  const panel = $('#panel');
  const panelContent = $('#panelContent');
  const config = window.JAKWO_CONFIG || {};
  let wallet = localStorage.getItem('jakwo_wallet') || '';
  let currentAd = null;
  let stats = JSON.parse(localStorage.getItem('jakwo_stats') || '{"total":0,"volume":0,"latest":"None","top":"None"}');

  const storyHTML = `
    <h2>THE STORY OF JAKWO</h2>
    <p>At first, Wojak was only a face — a tired shape the internet used when words were not enough.</p>
    <p>He became every loss, every late night, every silent laugh, every failure people were too embarrassed to explain.</p>
    <p>But beneath the meme was Jakwo: the one who still felt. The one who watched every brand, coin, creator, troll, and dream fight for attention in a world that never stopped scrolling.</p>
    <p>Then the internet became a battlefield. Memes became weapons. Attention became territory. Every image became a flag planted into history.</p>
    <p>JAKWO War Ads Arena was created for that war. Not a clean billboard. Not a boring ad slot. A permanent battlefield where anyone can place an image, attach a link, and fight for visibility.</p>
    <p>Some ads will rise. Some will be buried. Some will be covered by bigger attacks. But every placed ad becomes part of the arena's history.</p>
    <h2>BUY. PLACE. BLOCK. REPEAT.</h2>
    <p>This is not just advertising. This is internet territory.</p>`;

  const rulesHTML = `
    <h2>📜 MEME WAR ADS ARENA – OFFICIAL RULES</h2>
    <h3>1. Overview</h3>
    <p>Meme War Ads Arena is a digital advertising battleground where users purchase image ad space using USDT/USDC. Once purchased, users upload their image with one external link and place it anywhere on the arena. Ads are permanent once placed and can be blocked or covered by future ads. There are no removals, no resizing after deployment, and no refunds.</p>
    <h3>2. Payment and Pricing</h3>
    <p>Users resize freely before deployment. Price depends on arena coverage. Minimum cost is 0.50. Full arena cost is 1,000,000.</p>
    <h3>3. Placement Rules</h3>
    <ul><li>Users may place their ad anywhere on the arena.</li><li>Once deployed, the ad cannot be moved, removed, resized, or edited.</li><li>Ads can be placed on top of or covering other ads.</li><li>The most recently placed ad on that area remains visible.</li></ul>
    <h3>4. Blocking and War Rules</h3>
    <p>Users can block or cover other ads by placing a new ad on top. No refunds if your ad gets covered. Users can fight back by buying and placing more ads. This is not a billboard. It is a battlefield.</p>
    <h3>5. Permanency</h3>
    <ul><li>Move after placement: ❌ No</li><li>Resize after placement: ❌ No</li><li>Edit image/link: ❌ No</li><li>Remove/delete: ❌ No</li><li>Refund: ❌ No</li><li>Purchase another ad: ✔ Yes</li><li>Cover/block other ads: ✔ Yes</li></ul>
    <h3>6. External Links and Click Risk</h3>
    <p>Each ad can include one clickable external link. Meme War Ads Arena does not verify or guarantee the safety of external links. Clicking any link is at your own risk.</p>
    <h3>7. Content Restrictions</h3>
    <p>Strictly prohibited: hate, racism, violence, extremist content, pornographic/sexually explicit material, malware, phishing, wallet drainers, illegal links, fake impersonation, and false financial claims. Violating ads may be removed without refund.</p>
    <h3>8. Liability Disclaimer</h3>
    <p>Meme War Ads Arena is a public user-generated advertising platform. Advertisers are fully responsible for their uploaded content. Users click on ads at their own risk. Meme War Ads Arena is not liable for financial loss, scam, or damage caused by user-posted content or links.</p>
    <h3>9. Reporting Ads</h3><p>Users may report unsafe or illegal ads. Confirmed violations may be removed without refund.</p>
    <h3>10. Final Rule</h3><p><b>Buy. Place. Block. Repeat.</b> Once your ad enters the arena, it lives there forever — visible or buried, but never removed.</p>`;

  function shortWallet(w){ return w ? w.slice(0,4) + '...' + w.slice(-4) : 'CONNECT'; }
  function updateWallet(){ $('#connectBtn').textContent = shortWallet(wallet); }
  function saveStats(){ localStorage.setItem('jakwo_stats', JSON.stringify(stats)); }
  function renderStats(){
    $('#totalAds').textContent = stats.total;
    $('#arenaVolume').textContent = Number(stats.volume).toFixed(2);
    $('#latestWar').textContent = stats.latest || 'None';
    $('#topWarlord').textContent = stats.top || 'None';
  }
  function priceFor(el){
    if(!el) return 0.5;
    const arenaArea = arena.clientWidth * arena.scrollHeight;
    const adArea = el.offsetWidth * el.offsetHeight;
    const coverage = Math.min(100, Math.max(.01, (adArea / arenaArea) * 100));
    const price = Math.max(.5, Math.min(1000000, 0.5 + Math.pow(coverage/100, 2.4) * 999999.5));
    return {coverage, price};
  }
  function updatePrice(){
    const p = currentAd ? priceFor(currentAd) : {coverage:.1, price:.5};
    $('#costText').textContent = `${p.price.toFixed(2)} USDC`;
    $('#coverageText').textContent = `${p.coverage.toFixed(2)}%`;
    $('#sheetPrice').textContent = `${p.price.toFixed(2)} USDC`;
  }
  function openSheet(){ sheet.classList.add('open'); sheet.setAttribute('aria-hidden','false'); }
  function closeSheet(){ sheet.classList.remove('open'); sheet.setAttribute('aria-hidden','true'); }
  function openPanel(type){
    const map = {
      rules: rulesHTML,
      story: storyHTML,
      leaderboard: `<h2>🏆 TOP WARLORDS</h2><p>No confirmed paid warlords yet.</p><p>Leaderboard will rank advertisers by real paid volume.</p>`,
      chat: `<h2>💬 WAR CHAT</h2><p>Read free. Connect wallet to troll. No links allowed in chat.</p><input placeholder="Connect wallet to chat" style="width:100%;height:44px;padding:10px">`
    };
    panelContent.innerHTML = map[type] || '';
    panel.classList.remove('hidden');
  }
  function closePanel(){ panel.classList.add('hidden'); }
  function impact(){
    document.body.classList.add('shake'); $('#impactFlash').classList.add('flash');
    setTimeout(()=>{document.body.classList.remove('shake'); $('#impactFlash').classList.remove('flash')}, 600);
  }
  function announce(name, price){
    $('#tickerText').textContent = `🚨 ${name} launched a new war ad for ${price.toFixed(2)} USDC • Buy. Place. Block. Repeat. • New ads can cover old ads •`;
  }
  function addAd(src){
    $('#emptyCard')?.remove();
    const ad = document.createElement('div');
    ad.className = 'ad editing';
    ad.style.left = '14%'; ad.style.top = '18%'; ad.style.width = '120px'; ad.style.height = '90px';
    ad.innerHTML = `<button class="x" title="Remove">×</button><img src="${src}" alt="war ad"><span class="resize"></span>`;
    arena.appendChild(ad);
    currentAd = ad; makeInteractive(ad); updatePrice();
  }
  function makeInteractive(el){
    let dragging=false, resizing=false, sx=0, sy=0, sl=0, st=0, sw=0, sh=0;
    const down = (e) => {
      if(el.classList.contains('locked')) return;
      const t = e.target;
      if(t.classList.contains('x')){ el.remove(); currentAd=null; updatePrice(); return; }
      const p = e.touches ? e.touches[0] : e;
      sx=p.clientX; sy=p.clientY; sl=parseFloat(el.style.left)||0; st=parseFloat(el.style.top)||0; sw=el.offsetWidth; sh=el.offsetHeight;
      resizing = t.classList.contains('resize'); dragging = !resizing; el.setPointerCapture?.(e.pointerId||0);
    };
    const move = (e) => {
      if(el.classList.contains('locked')) return;
      if(!dragging && !resizing) return;
      const p = e.touches ? e.touches[0] : e; const dx=p.clientX-sx, dy=p.clientY-sy;
      if(resizing){ el.style.width = Math.max(40, sw+dx)+'px'; el.style.height = Math.max(40, sh+dy)+'px'; }
      if(dragging){ el.style.left = Math.max(0, sl+dx)+'px'; el.style.top = Math.max(0, st+dy+arena.scrollTop)+'px'; }
      updatePrice(); e.preventDefault();
    };
    const up = ()=>{dragging=false; resizing=false};
    el.addEventListener('pointerdown', down); window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  }
  async function connect(){
    try{
      if(window.solana?.isPhantom){ const r = await window.solana.connect(); wallet = r.publicKey.toString(); }
      else { wallet = 'DEMO' + Math.random().toString(36).slice(2,8).toUpperCase(); alert('Phantom not found. Demo wallet connected for testing.'); }
      localStorage.setItem('jakwo_wallet', wallet); updateWallet();
    }catch(e){ alert('Wallet connect cancelled.'); }
  }
  function deploy(){
    if(!currentAd){ alert('Upload and place a photo first.'); return; }
    if(!wallet){ alert('Connect wallet first.'); return; }
    const voucher = $('#voucherCode').value.trim().toUpperCase();
    const name = ($('#adName').value || 'Unnamed War Ad').trim().slice(0,40);
    const p = priceFor(currentAd);

    if(!voucher){
      alert('Payment required. This static test will NOT publish free. Use voucher TEST to demo lock, or wire Phantom USDC payment before public launch.');
      return;
    }
    if(!['TEST','PROMO','FIRST100'].includes(voucher) && !voucher.startsWith('JAKWO-')){
      alert('Invalid voucher code.'); return;
    }
    currentAd.classList.remove('editing'); currentAd.classList.add('locked');
    currentAd.dataset.name = name; currentAd.dataset.link = $('#adLink').value.trim();
    currentAd.addEventListener('click',()=>{ if(currentAd.dataset.link) window.open(currentAd.dataset.link,'_blank'); });
    stats.total += 1; stats.latest = name; stats.top = name; saveStats(); renderStats(); announce(name,p.price); impact(); closeSheet(); currentAd=null; updatePrice();
    alert('Ad deployed and locked for test. Real paid launch must replace voucher demo with verified USDC payment.');
  }

  $('#connectBtn').onclick = connect;
  $('#addBtn').onclick = openSheet; $('#mobileAddBtn').onclick = openSheet; $('#closeSheet').onclick = closeSheet;
  $('#closePanel').onclick = closePanel;
  $('#deployBtn').onclick = deploy;
  $('#imageInput').onchange = (e)=>{ const file=e.target.files[0]; if(!file) return; const r=new FileReader(); r.onload=()=>addAd(r.result); r.readAsDataURL(file); };
  $$('#xLink').forEach(a=>a.href=config.twitter||a.href); $$('#tgLink').forEach(a=>a.href=config.telegram||a.href);
  $$('[data-panel]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.panel)));

  updateWallet(); renderStats(); updatePrice();
})();
