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
  let chatChannel = null;
  const ADS_KEY = 'jakwo_deployed_ads_v1';
  const isMobile = () => /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || navigator.maxTouchPoints > 0 || ('ontouchstart' in window);
  const esc = (v) => String(v || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const supa = (() => {
    try {
      const url = config.supabaseUrl || config.NEXT_PUBLIC_SUPABASE_URL || '';
      const key = config.supabaseAnonKey || config.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (window.supabase && url && key) return window.supabase.createClient(url, key);
    } catch(_e) {}
    return null;
  })();

  const storyHTML = `
    <h2>Jakwo and Wojak Story</h2>
    <p>They said he was always talking to himself.</p>
    <p>Not loudly, not like someone losing their mind—just softly, as if trying to convince the air that it could understand him.</p>
    <p>In those murmurs lived two voices.</p>
    <p>One called itself Wojak, the other Jakwo.</p>
    <p>No one else could tell them apart, but inside his head they felt like separate people sharing the same heartbeat.</p>
    <p>At first they agreed on everything.</p>
    <p>Wojak handled the noise of the world—the jokes, the routines, the practiced smiles.</p>
    <p>Jakwo preferred the quiet corners, sketching thoughts in notebooks, writing the words that Wojak could never say aloud.</p>
    <p>Together they made one whole person: visible and invisible, loud and still.</p>
    <p>But the world doesn't reward stillness.</p>
    <p>Every room, every screen, every friend wanted the bright half, the one who could make sadness sound funny.</p>
    <p>So Wojak stepped forward more and more, until Jakwo had to shrink just to make space.</p>
    <p>At night, when the house was silent, Jakwo whispered back:</p>
    <blockquote>You're forgetting where the feelings come from.</blockquote>
    <p>Wojak smiled at the dark ceiling.</p>
    <blockquote>Someone has to keep us alive.</blockquote>
    <p>The next morning, only Wojak's name was written on the coffee cup.</p>

    <h2>The Becoming</h2>
    <p>Days began to blur into one another.</p>
    <p>Wojak laughed in the mirror every morning, testing expressions like an actor rehearsing a part.</p>
    <p>He learned which smiles earned him company, which tired shrug made people call him "relatable."</p>
    <p>Every reaction from others felt like applause.</p>
    <p>He started to believe that applause was the same thing as love.</p>
    <p>Jakwo stayed in the corners of their shared mind, watching.</p>
    <p>He could still feel everything—each embarrassment, each tiny rejection—but he wasn't allowed to speak.</p>
    <p>Whenever he tried to rise, Wojak covered him with a joke, a meme, a quick line to change the subject.</p>
    <p>It worked. People liked Wojak.</p>
    <p>Online, it was even easier.</p>
    <p>A single image, a sad face sketched in black lines, could carry whole oceans of feeling.</p>
    <p>People reposted it, captioned it, remade it.</p>
    <p>They said, "That's me."</p>
    <p>But none of them knew whose feeling it really was.</p>
    <p>At night Jakwo whispered again:</p>
    <blockquote>They think they're seeing you, but they're seeing me.</blockquote>
    <p>Wojak pretended not to hear.</p>
    <blockquote>It doesn't matter. We're both inside the frame.</blockquote>
    <p>The world began to tell that face the Wojak face, and Wojak accepted the name as truth.</p>
    <p>He didn't notice that Jakwo's side of the mind was turning grey—smudged like an erased pencil drawing.</p>

    <h2>The Fading</h2>
    <p>The internet loved Wojak.</p>
    <p>His face became a language — a shorthand for everything people couldn't say out loud.</p>
    <p>Loneliness, nostalgia, exhaustion — they all wore that same weary smile.</p>
    <p>Each time someone shared him, Wojak felt more real.</p>
    <p>He could almost hear the clicking keyboards as a pulse.</p>
    <p>The world was breathing his name.</p>
    <p>Jakwo, meanwhile, drifted further from the noise.</p>
    <p>He watched from behind the pixels, where memory and feeling lived.</p>
    <p>Every new variation — the Doomer, the Boomer, the Coomer, the NPC — felt like a piece of himself carved off and handed to strangers.</p>
    <p>He wanted to protest, to tell them they were seeing the quiet half of one man's sadness, not a joke.</p>
    <p>But no one hears the shadow behind the linework.</p>
    <blockquote>You've become what they want.</blockquote>
    <p>Jakwo said one night.</p>
    <blockquote>I became what they needed.</blockquote>
    <p>Wojak replied.</p>
    <p>There was no malice in the words... just a tired understanding.</p>
    <p>To exist online was to be useful, repeatable, editable.</p>
    <p>To be human was to disappear.</p>
    <p>So Jakwo stayed silent.</p>
    <p>He let Wojak wear the world's feelings like masks — each meme a costume in an endless play.</p>
    <p>The applause grew louder.</p>
    <p>The silence inside him grew wider.</p>
    <p>Sometimes, late at night, Wojak would catch a glimpse of his own reflection on the dark screen and flinch.</p>
    <p>For a moment, he couldn't tell whose eyes looked back at him.</p>
    <p>Were they his — or Jakwo's?</p>
    <p>The face was familiar, but the emotion behind it wasn't always his own.</p>

    <h2>The Echo</h2>
    <p>Fame has no sound until the noise stops.</p>
    <p>Wojak didn't notice it at first—the quiet between reposts, the hours when no one tagged his name.</p>
    <p>He had grown used to the rhythm of attention: the likes, the laughter, the recognition that made him feel real.</p>
    <p>Now, when the timelines scrolled past without him, he felt a small panic.</p>
    <p>If no one was looking, did he still exist?</p>
    <p>In the stillness, a voice stirred.</p>
    <blockquote>You were never the one they saw.</blockquote>
    <p>Jakwo whispered.</p>
    <p>Wojak frowned into the monitor's glow.</p>
    <blockquote>Then who was it?</blockquote>
    <blockquote>Me. It was always me. You only borrowed what I felt.</blockquote>
    <p>The words stung like cold air.</p>
    <p>Wojak wanted to argue, but he couldn't remember the last time he had truly felt anything himself.</p>
    <p>The sadness, the empathy, the weary humor that made people nod—those things had once lived somewhere deep inside.</p>
    <p>Now they were templates, expressions he could summon on command.</p>
    <p>He scrolled through pages of his own face: the same eyes, the same tired lines, remade a thousand ways.</p>
    <p>Each version looked honest, but none of them belonged to him anymore.</p>
    <p>They were Jakwo's ghosts.</p>
    <p>That night he dreamed of a mirror with two reflections.</p>
    <p>One was himself, smiling as always.</p>
    <p>The other was standing slightly behind, half in shadow, its eyes clear and alive.</p>
    <p>When he reached to touch the glass, the shadow spoke his name—and the mirror cracked.</p>
    <p>Wojak woke with a start, his screen still glowing.</p>
    <p>For the first time, he typed his twin's name into the search bar: Jakwo.</p>
    <p>Nothing came up. No face, no meme, no trace.</p>
    <p>Only silence.</p>

    <h2>The Real Face</h2>
    <p>The next morning, Wojak sat in front of the blank screen.</p>
    <p>No templates. No captions. No crowds waiting for another face to wear.</p>
    <p>Just white light and the faint hum of the machine.</p>
    <p>He thought about all the versions of himself that existed out there — millions of faces, none quite right.</p>
    <p>Each one a borrowed mood, a performance, a whisper stolen from somewhere deep within.</p>
    <p>Jakwo had given him those whispers.</p>
    <p>Every tear, every sigh, every tremor of sincerity had come from that quiet half buried under noise.</p>
    <p>Now, with the internet finally silent around him, Wojak felt the emptiness where Jakwo had once lived.</p>
    <blockquote>I wanted to be you. You were supposed to be the stronger one.</blockquote>
    <p>The silence seemed to stretch.</p>
    <p>For a moment, he thought he heard the old, calm voice again:</p>
    <blockquote>You became me. And I became the space you left behind.</blockquote>
    <p>He understood then that there had never been two of them—only one self split by the weight of pretending.</p>
    <p>Jakwo was not gone.</p>
    <p>He was the unspoken feeling inside every smile Wojak had faked, every joke he had used to survive.</p>
    <p>He was still there, behind the picture, inside the linework, quiet but unbroken.</p>
    <p>Wojak closed his eyes and let the screen fade to black.</p>
    <p>In the reflection, he saw both of them: the mask and the face beneath it, finally still, finally together.</p>
    <p>For the first time, there was no need to perform.</p>
    <p>For the first time, he didn't have to choose who spoke.</p>
    <p>He whispered their shared name once more—softly, as if testing how it sounded when it meant both:</p>
    <blockquote>Wojakwo.</blockquote>
    <p>And somewhere, far beyond the screen, the silence smiled back.</p>`;
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
  function updateWallet(){
    const btn = $('#connectBtn');
    btn.textContent = shortWallet(wallet);
    btn.title = wallet ? 'Click to disconnect wallet' : 'Connect Phantom wallet';
    $$('.wallet-required').forEach(el=>{
      el.disabled = !wallet;
      el.placeholder = wallet ? 'Type message...' : 'Connect wallet to chat';
    });
  }
  function saveStats(){ localStorage.setItem('jakwo_stats', JSON.stringify(stats)); }
  function renderStats(){
    $('#totalAds').textContent = stats.total;
    $('#arenaVolume').textContent = Number(stats.volume).toFixed(2);
    $('#latestWar').textContent = stats.latest || 'None';
    $('#topWarlord').textContent = stats.top || 'None';
  }
  function parseMoneyValue(raw){
    let txt = String(raw || '').trim().toLowerCase().replace(/[$,\s]/g,'');
    if(!txt) return 0;
    let mult = 1;
    if(txt.endsWith('m')){ mult = 1000000; txt = txt.slice(0,-1); }
    else if(txt.endsWith('k')){ mult = 1000; txt = txt.slice(0,-1); }
    const v = Number(txt);
    if(!Number.isFinite(v)) return 0;
    return v * mult;
  }
  function manualBudgetValue(){
    const input = $('#budgetInput');
    const v = input ? parseMoneyValue(input.value) : 0;
    return Number.isFinite(v) && v >= 0.5 ? Math.max(0.5, Math.min(1000000, v)) : 0;
  }
  function arenaPricingArea(){
    // Price must follow the currently visible battlefield, not total document height.
    // 100% of the visible arena = 1,000,000 USDC. Minimum = 0.50 USDC.
    const r = arena.getBoundingClientRect();
    return Math.max(1, r.width * r.height);
  }
  function priceFor(el){
    if(!el) return {coverage:.01, price:.5};
    const ar = arena.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const iw = Math.max(0, Math.min(er.right, ar.right) - Math.max(er.left, ar.left));
    const ih = Math.max(0, Math.min(er.bottom, ar.bottom) - Math.max(er.top, ar.top));
    const arenaArea = arenaPricingArea();
    const visibleAdArea = Math.max(1, iw * ih);
    const rawCoverage = (visibleAdArea / arenaArea) * 100;
    const coverage = Math.min(100, Math.max(.01, rawCoverage));
    let price = Math.max(.5, Math.min(1000000, (coverage / 100) * 1000000));
    if(el.dataset.budgetMode === '1'){
      const b = manualBudgetValue();
      if(b) price = b;
    }
    return {coverage, price};
  }
  function activeVoucherValue(){
    const input = $('#voucherCode');
    return input ? voucherValue(input.value) : 0;
  }
  function updatePrice(){
    const p = currentAd ? priceFor(currentAd) : {coverage:.1, price:.5};
    const vv = currentAd ? activeVoucherValue() : 0;
    const displayPrice = Math.max(0.5, Math.min(1000000, vv || p.price || 0.5));
    $('#costText').textContent = `${displayPrice.toFixed(2)} USDC`;
    $('#coverageText').textContent = `${p.coverage.toFixed(2)}%`;
    $('#sheetPrice').textContent = `${displayPrice.toFixed(2)} USDC`;
  }
  function openSheet(){
    if(sheet.classList.contains('open')){ closeSheet(); return; }
    closePanel();
    sheet.classList.add('open'); sheet.setAttribute('aria-hidden','false');
  }
  function closeSheet(){ sheet.classList.remove('open'); sheet.setAttribute('aria-hidden','true'); }
  function openPanel(type){
    if(!panel.classList.contains('hidden') && panel.dataset.type === type){ closePanel(); return; }
    closeSheet();
    const map = {
      rules: rulesHTML,
      story: storyHTML,
      leaderboard: `<h2>🏆 TOP WARLORDS</h2><p>No confirmed paid warlords yet.</p><p>Leaderboard will rank advertisers by real paid volume.</p>`,
      chat: `<h2>💬 WAR CHAT</h2><p>Read free. Connect wallet to troll. No links allowed in chat.</p><div id="chatMessages" class="chat-messages"></div><div class="chat-row"><input id="chatInput" class="wallet-required" placeholder="Connect wallet to chat"><button id="chatSend" class="chat-send wallet-required">SEND</button></div>`
    };
    panel.dataset.type = type;
    panelContent.innerHTML = map[type] || '';
    panel.classList.remove('hidden');
    updateWallet();
    if(type === 'chat'){
      const input = panel.querySelector('#chatInput');
      const send = panel.querySelector('#chatSend');
      const messages = panel.querySelector('#chatMessages');
      const localChatRows = () => { try { return JSON.parse(localStorage.getItem('jakwo_chat') || '[]'); } catch(_e){ return []; } };
      const normalizeChat = (r) => ({ wallet: r.wallet || 'Anon', text: r.message || r.text || '', at: r.created_at || r.at || '' });
      const drawRows = (rows) => {
        messages.innerHTML = rows.length ? rows.map(r => `<p><b>${esc(r.wallet)}</b>: ${esc(r.text)}</p>`).join('') : '<p><b>System:</b> Connect wallet to join the war chat.</p>';
        messages.scrollTop = messages.scrollHeight;
      };
      const renderChat = async () => {
        let rows = [];
        if(supa){
          try{
            const { data, error } = await supa.from('chat_messages').select('*').order('created_at', { ascending:true }).limit(100);
            if(error) throw error;
            if(Array.isArray(data)) rows = data.map(normalizeChat);
          }catch(e){ console.warn('Supabase chat load failed:', e); }
        }
        if(!rows.length) rows = localChatRows();
        drawRows(rows);
      };
      const sendChat = async () => {
        if(!wallet){ alert('Connect wallet first to chat.'); return; }
        const text = (input.value || '').trim();
        if(!text) return;
        if(/https?:\/\/|www\.|t\.me|discord\.gg/i.test(text)){ alert('No links allowed in war chat.'); return; }
        const row = { wallet: shortWallet(wallet), text: text.slice(0,160), at: Date.now() };
        if(supa){
          try{
            const { error } = await supa.from('chat_messages').insert({ wallet: row.wallet, message: row.text });
            if(error) throw error;
          }catch(e){
            console.warn('Supabase chat send failed, saving local fallback:', e);
            const rows = localChatRows(); rows.push(row); localStorage.setItem('jakwo_chat', JSON.stringify(rows.slice(-80)));
          }
        } else {
          const rows = localChatRows(); rows.push(row); localStorage.setItem('jakwo_chat', JSON.stringify(rows.slice(-80)));
        }
        input.value = '';
        await renderChat();
      };
      if(supa){
        try{
          if(chatChannel) supa.removeChannel(chatChannel);
          chatChannel = supa.channel('jakwo-war-chat-live')
            .on('postgres_changes', { event:'INSERT', schema:'public', table:'chat_messages' }, () => renderChat())
            .subscribe();
        }catch(e){ console.warn('Supabase realtime chat failed:', e); }
      }
      input?.addEventListener('focus', () => panel.classList.add('keyboard-mode'));
      input?.addEventListener('blur', () => panel.classList.remove('keyboard-mode'));
      input?.addEventListener('keydown', e => { if(e.key === 'Enter') sendChat(); });
      send?.addEventListener('click', sendChat);
      renderChat();
      if(supa){ setTimeout(()=>renderChat(), 1200); }
      updateWallet();
    }
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
    const ad = document.createElement('div');
    ad.className = 'ad editing';
    ad.style.left = '14%'; ad.style.top = '18%'; ad.style.width = '40px'; ad.style.height = '40px';
    ad.innerHTML = `<button class="x" title="Remove">×</button><img src="${src}" alt="war ad"><span class="resize"></span>`;
    arena.appendChild(ad);
    currentAd = ad; ad.dataset.budgetMode='0'; const bi=$('#budgetInput'); if(bi) bi.value=''; makeInteractive(ad); updatePrice();
  }
  function getLocalAds(){
    try { return JSON.parse(localStorage.getItem(ADS_KEY) || '[]'); } catch(_e){ return []; }
  }
  function setLocalAds(rows){
    localStorage.setItem(ADS_KEY, JSON.stringify(rows || []));
  }
  function adRecordFromElement(el, amount){
    const img = el.querySelector('img');
    return {
      id: el.dataset.id || ('ad_' + Date.now() + '_' + Math.random().toString(16).slice(2)),
      image_url: img ? img.src : '',
      link: el.dataset.link || '',
      wallet: wallet || '',
      amount: Number(amount || 0),
      x: parseFloat(el.style.left) || 0,
      y: parseFloat(el.style.top) || 0,
      w: el.offsetWidth || parseFloat(el.style.width) || 40,
      h: el.offsetHeight || parseFloat(el.style.height) || 40,
      name: el.dataset.name || 'War Ad',
      locked: true,
      created_at: new Date().toISOString()
    };
  }
  function renderDeployedAd(r){
    if(!r || !r.image_url) return;
    const ad = document.createElement('div');
    ad.className = 'ad locked';
    ad.dataset.id = r.id || '';
    ad.dataset.name = r.name || 'War Ad';
    ad.dataset.link = r.link || '';
    ad.style.left = (Number(r.x) || 0) + 'px';
    ad.style.top = (Number(r.y) || 0) + 'px';
    ad.style.width = Math.max(40, Number(r.w) || 40) + 'px';
    ad.style.height = Math.max(40, Number(r.h) || 40) + 'px';
    ad.innerHTML = `<img src="${r.image_url}" alt="war ad">`;
    if(r.link){
      ad.classList.add('clickable-ad');
      ad.title = `Open ${r.name || 'War Ad'}`;
      ad.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); window.open(r.link, '_blank', 'noopener,noreferrer'); });
    }
    arena.appendChild(ad);
  }
  async function saveDeployedAd(el, amount){
    const rec = adRecordFromElement(el, amount);
    el.dataset.id = rec.id;
    const rows = getLocalAds().filter(a => a.id !== rec.id);
    rows.push(rec);
    setLocalAds(rows);
    if(supa){
      try{
        const dbRec = { image_url: rec.image_url, link: rec.link, wallet: rec.wallet, amount: rec.amount, x: rec.x, y: rec.y, w: rec.w, h: rec.h, name: rec.name, locked: true, voucher_code: cleanVoucher($('#voucherCode')?.value || '') || null, tx_signature: el.dataset.tx || null };
        const oldId = rec.id;
        const { data, error } = await supa.from('ads').insert(dbRec).select('id').single();
        if(!error && data?.id){ rec.id = data.id; el.dataset.id = data.id; const updated = getLocalAds().filter(a => a.id !== oldId && a.id !== data.id); updated.push({...rec, id:data.id}); setLocalAds(updated); }
      }catch(e){ console.warn('Supabase ad save failed, local save still kept:', e); }
    }
  }
  async function loadDeployedAds(){
    let rows = [];
    if(supa){
      try{
        const { data, error } = await supa.from('ads').select('*').order('created_at', { ascending:true }).limit(500);
        if(!error && Array.isArray(data)) rows = data;
      }catch(e){ console.warn('Supabase ad load failed:', e); }
    }
    if(!rows.length) rows = getLocalAds();
    rows.forEach(renderDeployedAd);
    // Real stats from global rows when Supabase is available.
    if(rows.length){
      stats.total = rows.length;
      stats.volume = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
      const latest = rows[rows.length - 1];
      stats.latest = latest?.name || 'Latest War';
      const byWallet = {};
      rows.forEach(r => { const w = r.wallet || 'Anon'; byWallet[w] = (byWallet[w] || 0) + (Number(r.amount) || 0); });
      const top = Object.entries(byWallet).sort((a,b)=>b[1]-a[1])[0];
      stats.top = top ? (top[0].length > 10 ? shortWallet(top[0]) : top[0]) : 'None';
      saveStats(); renderStats();
    }
  }

  function makeInteractive(el){
    let dragging=false, resizing=false, sx=0, sy=0, sl=0, st=0, sw=0, sh=0;
    const down = (e) => {
      if(el.classList.contains('locked')) return;
      const t = e.target;
      if(t.classList.contains('x')){ el.remove(); currentAd=null; updatePrice(); return; }
      const p = e.touches ? e.touches[0] : e;
      sx=p.clientX; sy=p.clientY; sl=parseFloat(el.style.left)||0; st=parseFloat(el.style.top)||0; sw=el.offsetWidth; sh=el.offsetHeight;
      resizing = t.classList.contains('resize'); dragging = !resizing; if(resizing) el.dataset.budgetMode='0'; el.setPointerCapture?.(e.pointerId||0);
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
      if(wallet){
        if(confirm('Disconnect wallet?')){
          try{ await (window.solana || window.phantom?.solana)?.disconnect?.(); }catch(_e){}
          wallet = '';
          localStorage.removeItem('jakwo_wallet');
          updateWallet();
        }
        return;
      }
      const provider = window.solana?.isPhantom ? window.solana : (window.phantom?.solana?.isPhantom ? window.phantom.solana : null);
      if(provider){
        const r = await provider.connect({ onlyIfTrusted:false });
        wallet = r.publicKey.toString();
      } else {
        if(isMobile()){
          const target = encodeURIComponent(window.location.href);
          const ref = encodeURIComponent(window.location.origin);
          window.location.href = `https://phantom.app/ul/browse/${target}?ref=${ref}`;
          return;
        }
        alert('Phantom wallet not found. Install Phantom or open this site in Phantom browser.');
        return;
      }
      localStorage.setItem('jakwo_wallet', wallet);
      updateWallet();
    }catch(e){
      console.warn('Wallet connect failed:', e);
      alert('Wallet connect cancelled or failed. Try opening in Phantom browser.');
    }
  }

  function cleanVoucher(code){
    return (code || '').trim().toUpperCase().replace(/,/g,'');
  }
  function usedVouchers(){
    try { return JSON.parse(localStorage.getItem('jakwo_used_vouchers') || '[]'); }
    catch(_e){ return []; }
  }
  function isVoucherUsed(code){
    const c = cleanVoucher(code);
    return !!c && usedVouchers().includes(c);
  }
  function markVoucherUsed(code){
    const c = cleanVoucher(code);
    if(!c) return;
    const used = usedVouchers();
    if(!used.includes(c)){
      used.push(c);
      localStorage.setItem('jakwo_used_vouchers', JSON.stringify(used));
    }
  }
  function voucherValue(code){
    const c = cleanVoucher(code);
    if(!c) return 0;
    if(c === 'TEST') return 0.5;
    const m = c.match(/(?:^|[-_\s])(1000000|1000|500|100|0\.5|050|50|5)(?:$|[-_\s])/);
    if(!m) return 0;
    if(m[1] === '050') return 0.5;
    return Number(m[1]);
  }
  function resizeAdToPrice(target){
    if(!currentAd || !target) return;
    currentAd.dataset.budgetMode='1';
    const clamped = Math.max(0.5, Math.min(1000000, target));
    const input = $('#budgetInput'); if(input) input.value = clamped.toFixed(2);
    const ar = arena.getBoundingClientRect();
    if(clamped >= 999999){
      currentAd.style.left = Math.max(0, arena.scrollLeft) + 'px';
      currentAd.style.top = Math.max(0, arena.scrollTop) + 'px';
      currentAd.style.width = Math.round(ar.width) + 'px';
      currentAd.style.height = Math.round(ar.height) + 'px';
      updatePrice();
      return;
    }
    const arenaArea = arenaPricingArea();
    const coverage = Math.min(99.99, Math.max(.00005, clamped / 1000000 * 100));
    const area = Math.max(1600, arenaArea * coverage / 100);
    const width = Math.max(40, Math.sqrt(area * 4 / 3));
    const height = Math.max(40, width * 0.75);
    currentAd.style.width = Math.round(width) + 'px';
    currentAd.style.height = Math.round(height) + 'px';
    updatePrice();
  }

  async function payUsdc(amount){
    const provider = window.solana?.isPhantom ? window.solana : (window.phantom?.solana?.isPhantom ? window.phantom.solana : null);
    if(!provider){
      alert('Phantom not found. Install Phantom or open this site inside Phantom browser.');
      throw new Error('No Phantom provider');
    }
    if(!provider.publicKey){
      const r = await provider.connect({ onlyIfTrusted:false });
      wallet = r.publicKey.toString();
      localStorage.setItem('jakwo_wallet', wallet);
      updateWallet();
    }
    if(!window.solanaWeb3){
      alert('Solana payment library failed to load. Refresh and try again.');
      throw new Error('solanaWeb3 missing');
    }
    const web3 = window.solanaWeb3;
    const rpc = config.solanaRpc || config.NEXT_PUBLIC_SOLANA_RPC || 'https://api.mainnet-beta.solana.com';
    const receiverWallet = config.receiverWallet || config.NEXT_PUBLIC_RECEIVER_WALLET || '';
    if(!receiverWallet){
      alert('Receiver wallet missing in config.js');
      throw new Error('receiver wallet missing');
    }
    const connection = new web3.Connection(rpc, 'confirmed');
    const payer = provider.publicKey;
    const receiver = new web3.PublicKey(receiverWallet);
    const mint = new web3.PublicKey(config.usdcMint || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    const TOKEN_PROGRAM_ID = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    const ASSOCIATED_TOKEN_PROGRAM_ID = new web3.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
    const SYSVAR_RENT_PUBKEY = new web3.PublicKey('SysvarRent111111111111111111111111111111111');
    const getAta = async (owner) => (await web3.PublicKey.findProgramAddress(
      [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];
    const senderAta = await getAta(payer);
    const receiverAta = await getAta(receiver);
    const senderInfo = await connection.getAccountInfo(senderAta);
    if(!senderInfo){
      alert('No USDC token account found in this wallet. Add mainnet USDC first.');
      throw new Error('sender USDC ATA missing');
    }
    const instructions = [];
    const receiverInfo = await connection.getAccountInfo(receiverAta);
    if(!receiverInfo){
      instructions.push(new web3.TransactionInstruction({
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
          { pubkey: receiverAta, isSigner: false, isWritable: true },
          { pubkey: receiver, isSigner: false, isWritable: false },
          { pubkey: mint, isSigner: false, isWritable: false },
          { pubkey: web3.SystemProgram.programId, isSigner: false, isWritable: false },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }
        ],
        data: new Uint8Array([])
      }));
    }
    const amountUnits = BigInt(Math.round(Number(amount) * 1_000_000));
    const data = new Uint8Array(10);
    data[0] = 12; // TransferChecked
    let n = amountUnits;
    for(let i=0;i<8;i++){ data[1+i] = Number(n & 255n); n >>= 8n; }
    data[9] = 6; // USDC decimals
    instructions.push(new web3.TransactionInstruction({
      programId: TOKEN_PROGRAM_ID,
      keys: [
        { pubkey: senderAta, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: receiverAta, isSigner: false, isWritable: true },
        { pubkey: payer, isSigner: true, isWritable: false }
      ],
      data
    }));
    const tx = new web3.Transaction().add(...instructions);
    tx.feePayer = payer;
    const latestBlockhash = await connection.getLatestBlockhash('finalized');
    tx.recentBlockhash = latestBlockhash.blockhash;
    let sig;
    if(provider.signAndSendTransaction){
      const res = await provider.signAndSendTransaction(tx);
      sig = res.signature;
    } else {
      const signed = await provider.signTransaction(tx);
      sig = await connection.sendRawTransaction(signed.serialize());
    }
    await connection.confirmTransaction({ signature: sig, blockhash: latestBlockhash.blockhash, lastValidBlockHeight: latestBlockhash.lastValidBlockHeight }, 'confirmed');
    return sig;
  }

  async function deploy(){
    if(!currentAd){ alert('Upload and place a photo first.'); return; }
    if(!wallet){ alert('Connect wallet first.'); return; }
    const voucher = cleanVoucher($('#voucherCode').value);
    const name = ($('#adName').value || 'Unnamed War Ad').trim().slice(0,40);
    const budgetInput = $('#budgetInput');
    const budgetVal = budgetInput ? Number(budgetInput.value) : 0;
    if(budgetVal >= 0.5) resizeAdToPrice(budgetVal);
    let p = priceFor(currentAd);

    let paymentSignature = '';
    if(voucher){
      if(isVoucherUsed(voucher)){
        alert('This voucher was already used on this browser. One voucher = one ad only.'); return;
      }
      let voucherTier = voucherValue(voucher);
      let dbVoucher = null;
      if(supa){
        try{
          const { data, error } = await supa.from('voucher_codes').select('*').eq('code', voucher).single();
          if(error || !data) throw error || new Error('Voucher not found');
          if(data.used || data.disabled){ alert('Voucher already used or disabled.'); return; }
          dbVoucher = data;
          voucherTier = Number(data.tier) || voucherTier;
        }catch(e){
          alert('Invalid voucher code.'); return;
        }
      } else if(!(location.hostname === 'localhost' && voucher === 'TEST')){
        alert('Voucher validation needs Supabase.'); return;
      }
      if(voucherTier > 0){
        resizeAdToPrice(voucherTier);
        p = priceFor(currentAd);
        p.price = voucherTier;
      }
      currentAd.dataset.voucherId = dbVoucher?.id || '';
    } else {
      try{
        $('#deployBtn').disabled = true;
        $('#deployBtn').textContent = 'OPENING PHANTOM...';
        paymentSignature = await payUsdc(p.price);
      }catch(e){
        console.warn('Payment failed:', e);
        $('#deployBtn').disabled = false;
        $('#deployBtn').textContent = 'DEPLOY TO WAR';
        return;
      }
    }
    const deployedAd = currentAd;
    let adLink = ($('#adLink').value || '').trim();
    if(adLink && !/^https?:\/\//i.test(adLink)) adLink = 'https://' + adLink;

    deployedAd.classList.remove('editing');
    deployedAd.classList.add('locked');
    deployedAd.dataset.name = name;
    deployedAd.dataset.link = adLink;
    deployedAd.title = adLink ? `Open ${name}` : name;

    if(adLink){
      deployedAd.classList.add('clickable-ad');
      deployedAd.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(adLink, '_blank', 'noopener,noreferrer');
      });
    }

    if(voucher){
      markVoucherUsed(voucher);
      if(supa && deployedAd.dataset.voucherId){
        try{ await supa.from('voucher_codes').update({ used:true, used_by: wallet, used_at: new Date().toISOString() }).eq('id', deployedAd.dataset.voucherId); }catch(e){ console.warn('Voucher update failed:', e); }
      }
    }
    if(paymentSignature) deployedAd.dataset.tx = paymentSignature;
    await saveDeployedAd(deployedAd, voucher ? 0 : p.price);
    $('#voucherCode').value = '';
    stats.total += 1; stats.volume += voucher ? 0 : Number(p.price || 0); stats.latest = name; stats.top = name; saveStats(); renderStats(); announce(name, voucher ? 0 : p.price); impact(); closeSheet(); currentAd=null; updatePrice();
    $('#deployBtn').disabled = false;
    $('#deployBtn').textContent = 'DEPLOY TO WAR';
    alert(paymentSignature ? 'Payment confirmed. Ad deployed and locked forever.' : 'Voucher accepted. Ad deployed and locked forever.');
  }

  $('#connectBtn').onclick = connect;
  $('#addBtn').onclick = openSheet; $('#mobileAddBtn').onclick = openSheet; $('#closeSheet').onclick = closeSheet;
  $('#closePanel').onclick = closePanel;
  $('#deployBtn').onclick = deploy;
  const budgetEl = $('#budgetInput');
  const applyBudget = (normalize=false) => {
    if(!budgetEl) return;
    let v = parseMoneyValue(budgetEl.value);
    if(!Number.isFinite(v) || v < 0.5) v = normalize ? 0.5 : 0;
    if(v){
      v = Math.max(0.5, Math.min(1000000, v));
      if(normalize) budgetEl.value = v.toFixed(2);
      resizeAdToPrice(v);
    }
  };
  budgetEl?.addEventListener('input', () => applyBudget(false));
  budgetEl?.addEventListener('keyup', () => applyBudget(false));
  budgetEl?.addEventListener('change', () => applyBudget(true));
  budgetEl?.addEventListener('blur', () => applyBudget(true));
  $('#voucherCode').addEventListener('change', e => { const v = voucherValue(e.target.value); if(v) resizeAdToPrice(v); });
  $('#voucherCode').addEventListener('input', e => { const v = voucherValue(e.target.value); if(v) resizeAdToPrice(v); });
  $('#imageInput').onchange = (e)=>{ const file=e.target.files[0]; if(!file) return; const r=new FileReader(); r.onload=()=>addAd(r.result); r.readAsDataURL(file); };
  $$('#xLink').forEach(a=>a.href=config.twitter||a.href); $$('#tgLink').forEach(a=>a.href=config.telegram||a.href);
  $$('[data-panel]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.panel)));

  loadDeployedAds(); updateWallet(); renderStats(); updatePrice();
})();

/* PATCH: draggable/playable decorative stickers in sidebar/topbar only */
(function(){
  function initDecorStickers(){
    document.querySelectorAll('.wojak-card').forEach(function(el){
      if(el.dataset.ready==='1') return;
      el.dataset.ready='1';
      let dragging=false, sx=0, sy=0, ox=0, oy=0, moved=false;
      const getXY=()=>({x:parseFloat(el.dataset.x||0),y:parseFloat(el.dataset.y||0)});
      const setXY=(x,y)=>{el.dataset.x=x; el.dataset.y=y; el.style.translate=x+'px '+y+'px';};
      el.addEventListener('pointerdown',function(e){
        dragging=true; moved=false; sx=e.clientX; sy=e.clientY; const p=getXY(); ox=p.x; oy=p.y; el.setPointerCapture(e.pointerId);
      });
      el.addEventListener('pointermove',function(e){
        if(!dragging) return;
        const dx=e.clientX-sx, dy=e.clientY-sy;
        if(Math.abs(dx)+Math.abs(dy)>3) moved=true;
        setXY(ox+dx, oy+dy);
      });
      el.addEventListener('pointerup',function(e){
        dragging=false;
        try{el.releasePointerCapture(e.pointerId)}catch(_){}
        if(!moved){ el.classList.remove('spin'); void el.offsetWidth; el.classList.add('spin'); }
      });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initDecorStickers); else initDecorStickers();
})();
