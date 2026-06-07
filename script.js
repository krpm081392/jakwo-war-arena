(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const arena = $('#arena');
  const sheet = $('#sheet');
  const panel = $('#panel');
  const panelContent = $('#panelContent');
  const config = window.JAKWO_CONFIG || {};
  // FIXED FOREVER ARENA SIZE: same world on desktop/phone. Screen is only a camera.
  const ARENA_WIDTH = 5000;
  const ARENA_HEIGHT = 3000;
  const ARENA_AREA = ARENA_WIDTH * ARENA_HEIGHT;
  const MIN_PRICE = 0.50;
  const MAX_PRICE = 1000000;
  let wallet = localStorage.getItem('jakwo_wallet') || '';
  let currentAd = null;
  let stats = JSON.parse(localStorage.getItem('jakwo_stats_v3_fresh') || '{"total":0,"volume":0,"latest":"None","top":"None"}');
  let chatChannel = null;
  let adsChannel = null;
  const ADS_KEY = 'jakwo_deployed_ads_v3_fresh';
  const CHAT_KEY = 'jakwo_chat_v3_fresh';
  const STATS_KEY = 'jakwo_stats_v3_fresh';
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

  function setVoucherStatus(msg, type='info'){
    let el = document.getElementById('voucherStatus');
    const input = document.getElementById('voucherCode');
    if(!el && input){
      el = document.createElement('div');
      el.id = 'voucherStatus';
      el.style.cssText = 'font-size:12px;font-weight:900;margin:3px 0 6px;min-height:16px;color:#f6e7bb;';
      input.insertAdjacentElement('afterend', el);
    }
    if(!el) return;
    el.textContent = msg || '';
    el.style.color = type === 'ok' ? '#24ff66' : type === 'bad' ? '#ff5757' : '#f6e7bb';
  }


  if(new URLSearchParams(location.search).get('reset') === '1'){
    try{
      localStorage.removeItem(ADS_KEY);
      localStorage.removeItem(CHAT_KEY);
      localStorage.removeItem(STATS_KEY);
      localStorage.removeItem('jakwo_used_vouchers');
      localStorage.removeItem('jakwo_stats');
      localStorage.removeItem('jakwo_deployed_ads_v1');
      localStorage.removeItem('jakwo_chat');
    }catch(_e){}
  }

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
  function saveStats(){ localStorage.setItem(STATS_KEY, JSON.stringify(stats)); }
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
    // Pricing is based on the fixed permanent battlefield, never the device screen.
    // 5000 x 3000 = 100% arena = 1,000,000 USDC.
    return ARENA_AREA;
  }
  function minAdArea(){
    // The smallest visible ad on screen is the 0.50 USDC floor.
    // This prevents a 40x40 image from being priced like thousands of USDC.
    return 40 * 40;
  }
  function priceFromArea(visibleAdArea){
    const arenaArea = arenaPricingArea();
    const minArea = Math.min(minAdArea(), arenaArea);
    const clampedArea = Math.max(minArea, Math.min(arenaArea, visibleAdArea));
    if(arenaArea <= minArea) return 0.5;
    const ratio = (clampedArea - minArea) / (arenaArea - minArea);
    return Math.max(0.5, Math.min(1000000, 0.5 + ratio * (1000000 - 0.5)));
  }
  function areaFromPrice(price){
    const arenaArea = arenaPricingArea();
    const minArea = Math.min(minAdArea(), arenaArea);
    const p = Math.max(0.5, Math.min(1000000, Number(price) || 0.5));
    if(p >= 999999.99) return arenaArea;
    const ratio = (p - 0.5) / (1000000 - 0.5);
    return Math.max(minArea, Math.min(arenaArea, minArea + ratio * (arenaArea - minArea)));
  }
  function priceFor(el){
    if(!el) return {coverage:.00005, price:MIN_PRICE};
    const arenaArea = arenaPricingArea();
    // Use world/ad size, not visible viewport size, so laptop/phone/zoom do not change price.
    const adArea = Math.max(1, (el.offsetWidth || parseFloat(el.style.width) || 40) * (el.offsetHeight || parseFloat(el.style.height) || 40));
    const clampedArea = Math.max(minAdArea(), Math.min(arenaArea, adArea));
    let coverage = Math.min(100, Math.max(.00005, (clampedArea / arenaArea) * 100));
    let price = priceFromArea(clampedArea);
    const manual = Number(el.dataset.manualPrice || 0);
    if(Number.isFinite(manual) && manual >= MIN_PRICE){
      price = Math.max(MIN_PRICE, Math.min(MAX_PRICE, manual));
      const area = areaFromPrice(price);
      coverage = Math.min(100, Math.max(.00005, (area / arenaArea) * 100));
    }
    return {coverage, price};
  }
  function activeVoucherValue(){
    const input = $('#voucherCode');
    return input ? voucherValue(input.value) : 0;
  }
  function formatMoney(v){
    const n = Math.max(0, Number(v) || 0);
    return n.toLocaleString(undefined, { minimumFractionDigits: n < 1 ? 2 : 0, maximumFractionDigits: 2 });
  }
  function formatBudgetValue(v){
    const n = Math.max(0.5, Math.min(1000000, Number(v) || 0.5));
    if(n >= 1000000) return '1000000';
    if(n < 1) return n.toFixed(2);
    if(Number.isInteger(n)) return String(n);
    return n.toFixed(2).replace(/\.00$/,'').replace(/(\.\d*?)0+$/,'$1');
  }
  function setText(id, value){ const el = $(id); if(el) el.textContent = value; }
  function updatePrice(){
    const p = currentAd ? priceFor(currentAd) : {coverage:.00005, price:.5};
    const vv = currentAd ? activeVoucherValue() : 0;
    const displayPrice = Math.max(0.5, Math.min(1000000, vv || p.price || 0.5));
    setText('#costText', `${displayPrice.toFixed(2)} USDC`);
    setText('#liveCost', `${displayPrice.toFixed(2)} USDC`);
    setText('#coverageText', `${p.coverage < 0.01 ? p.coverage.toFixed(5) : p.coverage.toFixed(2)}%`);
    setText('#sheetPrice', `${displayPrice.toFixed(2)} USDC`);
    setText('#priceText', `${displayPrice.toFixed(2)} USDC`);
    const bi = $('#budgetInput');
    if(currentAd && bi && document.activeElement !== bi){
      // When user drags/resizes the ad, keep the budget/price input synced.
      bi.value = formatBudgetValue(displayPrice);
    }
  }
  function openSheet(){
    updateLockdownUI();
    if(getLockUntil() > Date.now()){ alert('☢ Arena is in $1M lockdown. Wait for the 1-hour hazard timer to finish.'); return; }
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
      leaderboard: leaderboardHTML(),
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
      const localChatRows = () => { try { return JSON.parse(localStorage.getItem(CHAT_KEY) || '[]'); } catch(_e){ return []; } };
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
            const rows = localChatRows(); rows.push(row); localStorage.setItem(CHAT_KEY, JSON.stringify(rows.slice(-80)));
          }
        } else {
          const rows = localChatRows(); rows.push(row); localStorage.setItem(CHAT_KEY, JSON.stringify(rows.slice(-80)));
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
  const LOCK_KEY = 'jakwo_1m_lockdown_until';
  let lockdownTimerHandle = null;
  function ensureLockdownBanner(){
    let el = $('#lockdownBanner');
    if(!el){
      el = document.createElement('div');
      el.id = 'lockdownBanner';
      el.innerHTML = `<div class="lock-icon">☢</div><div><b>HAZARD LOCKDOWN ACTIVE</b><span id="lockdownTimer">60:00</span><small>$1,000,000 WAR AD bought — arena deploy is locked for 1 hour.</small></div>`;
      document.body.appendChild(el);
    }
    return el;
  }
  function getLockUntil(){ return Number(localStorage.getItem(LOCK_KEY) || 0); }
  function setLockUntil(ts){ localStorage.setItem(LOCK_KEY, String(ts)); updateLockdownUI(); }
  function formatCountdown(ms){
    const total = Math.max(0, Math.ceil(ms/1000));
    const m = String(Math.floor(total/60)).padStart(2,'0');
    const sec = String(total%60).padStart(2,'0');
    return `${m}:${sec}`;
  }
  function updateLockdownUI(){
    const until = getLockUntil();
    const left = until - Date.now();
    const banner = ensureLockdownBanner();
    const active = left > 0;
    banner.classList.toggle('show', active);
    document.body.classList.toggle('lockdown-active', active);
    const timer = $('#lockdownTimer'); if(timer) timer.textContent = formatCountdown(left);
    ['#deployBtn','#addBtn','#mobileAddBtn'].forEach(sel=>{ const b=$(sel); if(b) b.disabled = active; });
    if(active && !lockdownTimerHandle){ lockdownTimerHandle = setInterval(updateLockdownUI, 1000); }
    if(!active && lockdownTimerHandle){ clearInterval(lockdownTimerHandle); lockdownTimerHandle=null; }
  }
  function triggerLockdown(){
    const until = Date.now() + 60*60*1000;
    setLockUntil(Math.max(getLockUntil(), until));
  }
  function maybeLockdownFromRows(rows){
    let until = getLockUntil();
    (rows || []).forEach(r=>{
      const a = Math.max(Number(r.amount||0), Number(r.display_amount||0));
      if(a >= 1000000){
        const t = r.created_at ? new Date(r.created_at).getTime() : Date.now();
        if(Number.isFinite(t)) until = Math.max(until, t + 60*60*1000);
      }
    });
    if(until > getLockUntil()) setLockUntil(until); else updateLockdownUI();
  }
  function visualEffectClass(amount){
    const a = Number(amount || 0);
    if(a >= 1000000) return 'effect-lockdown';
    if(a >= 900000) return 'effect-meteor';
    if(a >= 800000) return 'effect-nuke';
    if(a >= 700000) return 'effect-red-alert';
    if(a >= 600000) return 'effect-blackout';
    if(a >= 500000) return 'effect-earthquake';
    if(a >= 400000) return 'effect-fire';
    if(a >= 300000) return 'effect-crack';
    if(a >= 200000) return 'effect-fall';
    if(a >= 100000) return 'effect-heavy-shake';
    const low = ['effect-crack','effect-fall','effect-heavy-shake','effect-static','effect-dust'];
    if(a >= 1000) return low[Math.floor(Math.random()*low.length)];
    return 'effect-small-pop';
  }
  function impact(amount=0){
    const flash = $('#impactFlash');
    let alertBox = $('#warAlert');
    if(!alertBox){
      alertBox = document.createElement('div');
      alertBox.id = 'warAlert';
      document.body.appendChild(alertBox);
    }
    const a = Number(amount || 0);
    let text = '⚔ NEW WAR AD DEPLOYED';
    let dur = 900;
    if(a >= 1000000){ text = '☢ HAZARD ALERT — $1M ARENA LOCKDOWN STARTED: 1 HOUR'; dur = 4200; triggerLockdown(); }
    else if(a >= 900000){ text = '☄ METEOR IMPACT — 900K WAR STRIKE'; dur = 2600; }
    else if(a >= 800000){ text = '💥 NUKE WARNING — 800K WAR STRIKE'; dur = 2500; }
    else if(a >= 700000){ text = '🚨 RED ALERT — 700K WAR STRIKE'; dur = 2300; }
    else if(a >= 600000){ text = '⚫ BLACKOUT — 600K WAR STRIKE'; dur = 2200; }
    else if(a >= 500000){ text = '🌋 EARTHQUAKE — 500K WAR STRIKE'; dur = 2100; }
    else if(a >= 400000){ text = '🔥 FIRE STORM — 400K WAR STRIKE'; dur = 1900; }
    else if(a >= 300000){ text = '裂 CRACKED ARENA — 300K WAR STRIKE'; dur = 1800; }
    else if(a >= 200000){ text = '⬇ FIELD FALLING — 200K WAR STRIKE'; dur = 1700; }
    else if(a >= 100000){ text = '⚠ HEAVY SHAKE — 100K WAR STRIKE'; dur = 1600; }
    else if(a >= 1000){ text = '⚠ RANDOM WAR EFFECT TRIGGERED'; dur = 1300; }
    const cls = visualEffectClass(a);
    document.body.classList.add('war-effect', cls);
    flash?.classList.add(a >= 1000000 ? 'mega-flash' : 'flash');
    alertBox.textContent = text;
    alertBox.className = 'show ' + cls;
    try{ if(navigator.vibrate) navigator.vibrate(a >= 1000000 ? [350,140,350,140,600] : [110,70,110]); }catch(_e){}
    try{
      const AC = window.AudioContext || window.webkitAudioContext;
      if(AC){
        const ctx = new AC();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = a >= 1000000 ? 'square' : 'sawtooth';
        osc.frequency.value = a >= 1000000 ? 120 : 320;
        gain.gain.value = 0.04;
        osc.connect(gain); gain.connect(ctx.destination); osc.start();
        setTimeout(()=>{ try{osc.stop(); ctx.close();}catch(_e){} }, a >= 1000000 ? 900 : 250);
      }
    }catch(_e){}
    setTimeout(()=>{
      document.body.classList.remove('war-effect', cls);
      flash?.classList.remove('flash','mega-flash');
      alertBox.classList.remove('show', cls);
    }, dur);
  }
  function paidAmount(r){ return Math.max(0, Number(r?.amount || 0)); }
  function adDisplayName(r){ return (r?.name || r?.ad_name || 'War Ad').toString().slice(0,40); }
  function buildLiveFeed(rows){
    const latest10 = (rows || []).slice(-10).reverse();
    if(!latest10.length) return 'Buy. Place. Block. Repeat. • Every ad is permanent • Bigger space costs more • New ads can cover old ads • No refunds after deployment •';
    return latest10.map(r => `🚨 ${adDisplayName(r)} launched a new war ad for ${paidAmount(r).toFixed(2)} USDC`).join(' • ') + ' •';
  }
  function announce(name, price){
    const txt = `🚨 ${name} launched a new war ad for ${Number(price||0).toFixed(2)} USDC • `;
    const current = ($('#tickerText').textContent || '').split(' • ').filter(Boolean);
    const cleaned = current.filter(x => !/Buy\. Place|Every ad|Bigger space|New ads|No refunds/i.test(x));
    const next = [txt.replace(/ • $/,''), ...cleaned].slice(0,10).join(' • ') + ' •';
    $('#tickerText').textContent = next;
  }
  function refreshStatsFromRows(rows){
    rows = Array.isArray(rows) ? rows : [];
    stats.total = rows.length;
    stats.volume = rows.reduce((sum, r) => sum + paidAmount(r), 0);
    const latest = rows[rows.length - 1];
    stats.latest = latest ? adDisplayName(latest) : 'None';
    const paidByWallet = {};
    rows.forEach(r => {
      const amt = paidAmount(r);
      if(amt > 0){
        const key = r.wallet || 'Anon';
        paidByWallet[key] = (paidByWallet[key] || 0) + amt;
      }
    });
    const top = Object.entries(paidByWallet).sort((a,b)=>b[1]-a[1])[0];
    stats.top = top ? (top[0].length > 10 ? shortWallet(top[0]) : top[0]) : 'None';
    const t = $('#tickerText'); if(t) t.textContent = buildLiveFeed(rows);
    saveStats(); renderStats();
  }
  function leaderboardHTML(){
    const rows = window.__JAKWO_ROWS || [];
    const paidByWallet = {};
    rows.forEach(r => { const amt = paidAmount(r); if(amt>0){ const k=r.wallet||'Anon'; paidByWallet[k]=(paidByWallet[k]||0)+amt; } });
    const top = Object.entries(paidByWallet).sort((a,b)=>b[1]-a[1]).slice(0,10);
    if(!top.length) return `<h2>🏆 TOP WARLORDS</h2><p>No confirmed paid warlords yet.</p><p>Leaderboard will rank advertisers by real paid volume.</p>`;
    return `<h2>🏆 TOP WARLORDS</h2><ol class="leader-list">${top.map(([w,a])=>`<li><b>${esc(w.length>10?shortWallet(w):w)}</b> — ${formatMoney(a)} USDC</li>`).join('')}</ol>`;
  }
  function addAd(src){
    // Only one unpaid preview is allowed. Choosing another photo replaces the old preview.
    arena.querySelectorAll('.ad.editing').forEach(n => n.remove());
    currentAd = null;

    const ad = document.createElement('div');
    ad.className = 'ad editing';

    // Place preview inside the current camera view using real px, not %, so first drag never jumps.
    const startX = Math.max(0, (document.querySelector('.app')?.scrollLeft || 0) + 120);
    const startY = Math.max(0, (document.querySelector('.app')?.scrollTop || 0) + 120);
    ad.style.left = startX + 'px';
    ad.style.top = startY + 'px';
    ad.style.width = '40px';
    ad.style.height = '40px';
    ad.innerHTML = `<button class="x" title="Remove">×</button><img src="${src}" alt="war ad"><span class="resize"></span>`;
    arena.appendChild(ad);
    currentAd = ad;
    ad.dataset.budgetMode='0';
    ad.dataset.manualPrice='';
    const bi=$('#budgetInput'); if(bi) bi.value='';
    makeInteractive(ad);
    updatePrice();
  }
  function getLocalAds(){
    try { return JSON.parse(localStorage.getItem(ADS_KEY) || '[]'); } catch(_e){ return []; }
  }
  function setLocalAds(rows){
    localStorage.setItem(ADS_KEY, JSON.stringify(rows || []));
  }
  function arenaSizeForSave(){
    // Fixed forever world size. Do not use screen size here.
    return { w: ARENA_WIDTH, h: ARENA_HEIGHT };
  }
  function adRecordFromElement(el, amount){
    const img = el.querySelector('img');
    const size = arenaSizeForSave();
    const x = Math.max(0, el.offsetLeft || parseFloat(el.style.left) || 0);
    const y = Math.max(0, el.offsetTop || parseFloat(el.style.top) || 0);
    const w = Math.max(40, el.offsetWidth || parseFloat(el.style.width) || 40);
    const h = Math.max(40, el.offsetHeight || parseFloat(el.style.height) || 40);
    return {
      id: el.dataset.id || ('ad_' + Date.now() + '_' + Math.random().toString(16).slice(2)),
      image_url: img ? img.src : '',
      link: el.dataset.link || '',
      wallet: wallet || '',
      amount: Number(amount || 0),
      x, y, w, h,
      x_percent: (x / size.w) * 100,
      y_percent: (y / size.h) * 100,
      w_percent: (w / size.w) * 100,
      h_percent: (h / size.h) * 100,
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
    const size = arenaSizeForSave();
    const hasPct = r.x_percent !== undefined && r.x_percent !== null && r.w_percent !== undefined && r.w_percent !== null;
    const x = hasPct ? (Number(r.x_percent) || 0) / 100 * size.w : (Number(r.x) || 0);
    const y = hasPct ? (Number(r.y_percent) || 0) / 100 * size.h : (Number(r.y) || 0);
    const w = hasPct ? (Number(r.w_percent) || 0) / 100 * size.w : (Number(r.w) || 40);
    const h = hasPct ? (Number(r.h_percent) || 0) / 100 * size.h : (Number(r.h) || 40);
    ad.style.left = Math.max(0, x) + 'px';
    ad.style.top = Math.max(0, y) + 'px';
    ad.style.width = Math.max(40, w) + 'px';
    ad.style.height = Math.max(40, h) + 'px';
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

    // Keep local emergency backup only until Supabase confirms the save.
    const rows = getLocalAds().filter(a => a.id !== rec.id);
    rows.push(rec);
    setLocalAds(rows);

    if(supa){
      try{
        const voucherCode = cleanVoucher($('#voucherCode')?.value || '') || null;
        const tx = el.dataset.tx || null;
        const common = {
          image_url: rec.image_url,
          link: rec.link,
          wallet: rec.wallet,
          amount: rec.amount,
          display_amount: Number(el.dataset.displayAmount || rec.amount || 0),
          x: rec.x, y: rec.y, w: rec.w, h: rec.h,
          name: rec.name,
          locked: true
        };
        const commonNoDisplay = { ...common }; delete commonNoDisplay.display_amount;
        const tries = [
          { ...common, voucher_code: voucherCode, tx_signature: tx, x_percent: rec.x_percent, y_percent: rec.y_percent, w_percent: rec.w_percent, h_percent: rec.h_percent },
          { ...commonNoDisplay, voucher_code: voucherCode, tx_signature: tx, x_percent: rec.x_percent, y_percent: rec.y_percent, w_percent: rec.w_percent, h_percent: rec.h_percent },
          { ...commonNoDisplay, voucher_code: voucherCode, tx_signature: tx },
          { ...commonNoDisplay }
        ];
        let saved = false, lastError = null;
        for(const payload of tries){
          const { error } = await supa.from('ads').insert(payload);
          if(!error){ saved = true; break; }
          lastError = error;
          console.warn('Supabase ad save attempt failed, retrying smaller payload:', error);
        }
        if(saved){
          console.log('SUPABASE AD SAVED');
          // Supabase is the source of truth for all devices. Clear local emergency duplicate.
          setLocalAds(getLocalAds().filter(a => a.id !== rec.id));
          return true;
        } else {
          console.error('Supabase ad save failed after retries:', lastError);
          return false;
        }
      }catch(e){
        console.warn('Supabase ad save failed, local save still kept:', e);
        return false;
      }
    }
    return false;
  }

  let loadAdsBusy = false;
  let lastAdsJson = '';
  async function loadDeployedAds(){
    if(loadAdsBusy) return;
    loadAdsBusy = true;
    let rows = [];
    let loadedFromSupabase = false;
    if(supa){
      try{
        const { data, error } = await supa.from('ads').select('*').order('created_at', { ascending:true }).limit(1000);
        if(error) throw error;
        if(Array.isArray(data)){ rows = data; loadedFromSupabase = true; }
      }catch(e){ console.warn('Supabase ad load failed, using local fallback:', e); }
    }

    // Supabase is the source of truth across devices. Local is only an offline fallback.
    if(!loadedFromSupabase){
      rows = getLocalAds();
    }

    const adKey = (r) => String(r.id || r.tx_signature || ((r.image_url||'') + '|' + (r.name||'') + '|' + (r.amount||'')));
    const dedupedRows = [];
    const seen = new Set();
    for(const r of rows){
      const key = adKey(r);
      if(key && !seen.has(key)){ dedupedRows.push(r); seen.add(key); }
    }
    rows = dedupedRows;
    maybeLockdownFromRows(rows);

    const json = JSON.stringify(rows.map(r => [r.id, r.tx_signature, r.created_at, r.x, r.y, r.w, r.h, r.x_percent, r.y_percent, r.w_percent, r.h_percent, r.amount, r.display_amount, r.name]));
    if(json !== lastAdsJson){
      arena.querySelectorAll('.ad.locked').forEach(n => n.remove());
      rows.forEach(renderDeployedAd);
      lastAdsJson = json;
    }

    window.__JAKWO_ROWS = rows;
    refreshStatsFromRows(rows);
    loadAdsBusy = false;
  }

  function makeInteractive(el){
    let dragging=false, resizing=false;
    let sx=0, sy=0, sl=0, st=0, sw=0, sh=0, dragOffsetX=0, dragOffsetY=0, activePointer=null;
    let raf=0, lastEvent=null, priceDirty=false;

    const applyMove = () => {
      raf = 0;
      const e = lastEvent;
      if(!e || (!dragging && !resizing)) return;
      const dx=e.clientX-sx, dy=e.clientY-sy;
      if(resizing){
        el.dataset.manualPrice = '';
        const maxW = Math.max(40, arenaSizeForSave().w - sl);
        const maxH = Math.max(40, arenaSizeForSave().h - st);
        el.style.width = Math.min(maxW, Math.max(40, sw+dx))+'px';
        el.style.height = Math.min(maxH, Math.max(40, sh+dy))+'px';
      }
      if(dragging){
        const maxX=Math.max(0, arenaSizeForSave().w - el.offsetWidth);
        const maxY=Math.max(0, arenaSizeForSave().h - el.offsetHeight);
        el.style.left = Math.min(maxX, Math.max(0, e.clientX - dragOffsetX))+'px';
        el.style.top = Math.min(maxY, Math.max(0, e.clientY - dragOffsetY))+'px';
      }
      priceDirty = true;
    };

    const stop = () => {
      dragging = false;
      resizing = false;
      if(raf){ cancelAnimationFrame(raf); raf=0; applyMove(); }
      try{ if(activePointer !== null) el.releasePointerCapture?.(activePointer); }catch(_e){}
      activePointer = null;
      lastEvent = null;
      document.body.classList.remove('dragging-ad');
      if(priceDirty){ priceDirty=false; updatePrice(); }
    };

    const beginMove = (e, mode) => {
      sx=e.clientX; sy=e.clientY; sl=el.offsetLeft || 0; st=el.offsetTop || 0; sw=el.offsetWidth; sh=el.offsetHeight;
      dragOffsetX = e.clientX - sl;
      dragOffsetY = e.clientY - st;
      resizing = mode === 'resize';
      dragging = mode === 'drag';
      activePointer = e.pointerId;
      el.dataset.budgetMode='0';
      try{ el.setPointerCapture?.(e.pointerId); }catch(_e){}
      document.body.classList.add('dragging-ad');
    };

    const down = (e) => {
      if(el.classList.contains('locked')) return;
      if(e.pointerType === 'mouse' && e.button !== 0) return;
      const t = e.target;
      if(t.classList.contains('x')){ el.remove(); if(currentAd===el) currentAd=null; updatePrice(); return; }
      beginMove(e, t.classList.contains('resize') ? 'resize' : 'drag');
      e.preventDefault();
    };

    const move = (e) => {
      if(el.classList.contains('locked')) return stop();
      if(activePointer !== null && e.pointerId !== activePointer) return;
      if(!dragging && !resizing) return;
      lastEvent = e;
      if(!raf) raf = requestAnimationFrame(applyMove);
      e.preventDefault();
    };

    el.addEventListener('pointerdown', down, {passive:false});
    window.addEventListener('pointermove', move, {passive:false});
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    window.addEventListener('blur', stop);
    document.addEventListener('mouseleave', stop);
  }
  async function connect(){
    try{
      if(wallet){
        if(confirm('Disconnect wallet?')){
          const provider = window.solana?.isPhantom ? window.solana : (window.phantom?.solana?.isPhantom ? window.phantom.solana : null);
          try{ await provider?.disconnect?.(); }catch(_e){}
          wallet = '';
          localStorage.removeItem('jakwo_wallet');
          sessionStorage.removeItem('jakwo_wallet');
          updateWallet();
          alert('Wallet disconnected from JAKWO.');
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
    // Admin generates codes like JAKWO-500-XXXXX-001 and JAKWO-0D5-XXXXX-001
    const m = c.match(/(?:^|[-_\s])(1000000|1000|500|100|0D5|0\.5|050)(?:$|[-_\s])/);
    if(!m) return 0;
    if(m[1] === '0D5' || m[1] === '0.5' || m[1] === '050') return 0.5;
    return Number(m[1]);
  }
  async function lookupVoucher(code){
    const c = cleanVoucher(code);
    if(!c) return { ok:false, reason:'empty', tier:0 };
    if(!supa){
      const tier = voucherValue(c);
      if(c === 'TEST' || tier > 0) return { ok:!isVoucherUsed(c), reason:isVoucherUsed(c)?'used':'valid', tier, local:true };
      return { ok:false, reason:'invalid', tier:0 };
    }
    try{
      // Use limit(1), not .single(), so unused/invalid vouchers do not throw 406.
      const { data, error } = await supa.from('voucher_codes').select('id,code,tier,used,disabled,used_by,used_at').eq('code', c).limit(1);
      if(error){ console.warn('Voucher lookup error:', error); return { ok:false, reason:'invalid', error, tier:0 }; }
      const row = Array.isArray(data) && data.length ? data[0] : null;
      if(!row) return { ok:false, reason:'invalid', tier:0 };
      const tier = Number(row.tier ?? row.value ?? row.amount ?? row.price) || voucherValue(c) || 0;
      if(row.disabled) return { ok:false, reason:'disabled', row, tier };
      if(row.used) return { ok:false, reason:'used', row, tier };
      return { ok:true, reason:'valid', row, tier };
    }catch(e){
      console.warn('Voucher lookup exception:', e);
      return { ok:false, reason:'invalid', error:e, tier:0 };
    }
  }
  function showVoucherResult(v){
    if(!v || v.reason === 'empty') return setVoucherStatus('');
    if(v.ok) return setVoucherStatus(`✅ Voucher valid: ${formatMoney(v.tier || 0)} USDC`, 'ok');
    if(v.reason === 'used') return setVoucherStatus('❌ Voucher already used', 'bad');
    if(v.reason === 'disabled') return setVoucherStatus('❌ Voucher disabled', 'bad');
    return setVoucherStatus('❌ Invalid voucher', 'bad');
  }
  function resizeAdToPrice(target, updateInput=false){
    if(!currentAd || !target) return;
    const clamped = Math.max(0.5, Math.min(1000000, Number(target) || 0.5));
    const input = $('#budgetInput'); if(input && updateInput) input.value = formatBudgetValue(clamped);
    currentAd.dataset.manualPrice = String(clamped);
    if(clamped >= 999999.99){
      // 1M = exactly the whole fixed battlefield, not the current screen.
      currentAd.style.left = '0px';
      currentAd.style.top = '0px';
      currentAd.style.width = ARENA_WIDTH + 'px';
      currentAd.style.height = ARENA_HEIGHT + 'px';
      updatePrice();
      return;
    }
    const area = areaFromPrice(clamped);
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
    // Prefer public RPCs first. api.mainnet-beta.solana.com often returns 403/rate-limit on Vercel/browser.
    const configuredRpc = config.solanaRpc || config.NEXT_PUBLIC_SOLANA_RPC || '';
    const rpcList = [
      configuredRpc && !configuredRpc.includes('api.mainnet-beta.solana.com') ? configuredRpc : '',
      'https://rpc.ankr.com/solana',
      'https://solana-rpc.publicnode.com',
      'https://solana.public-rpc.com',
      configuredRpc && configuredRpc.includes('api.mainnet-beta.solana.com') ? configuredRpc : ''
    ].filter(Boolean);
    const receiverWallet = config.receiverWallet || config.NEXT_PUBLIC_RECEIVER_WALLET || '';
    if(!receiverWallet){
      alert('Receiver wallet missing in config.js');
      throw new Error('receiver wallet missing');
    }
    let connection = null;
    let lastRpcError = null;
    for(const rpc of rpcList){
      try{
        const test = new web3.Connection(rpc, 'confirmed');
        await test.getLatestBlockhash('confirmed');
        connection = test;
        break;
      }catch(e){ lastRpcError = e; console.warn('RPC failed, trying next:', rpc, e); }
    }
    if(!connection){
      alert('Solana RPC is blocked or unavailable. Try again, or use a custom RPC in config.js.');
      throw lastRpcError || new Error('No working Solana RPC');
    }
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
    // Do not lose the ad if Phantom already sent/paid but RPC confirmation expires.
    // We still try to confirm, but if confirmation times out/BlockheightExceeded happens,
    // deploy continues with the transaction signature so the buyer receives the ad.
    try{
      await connection.confirmTransaction({ signature: sig, blockhash: latestBlockhash.blockhash, lastValidBlockHeight: latestBlockhash.lastValidBlockHeight }, 'confirmed');
    }catch(confirmErr){
      console.warn('Payment was sent but confirmation failed/expired. Continuing deploy with signature:', sig, confirmErr);
      // Best-effort status check across backup RPCs. If unavailable, still continue with signature.
      for(const rpc of rpcList){
        try{
          const c = new web3.Connection(rpc, 'confirmed');
          const st = await c.getSignatureStatuses([sig], { searchTransactionHistory:true });
          const v = st && st.value && st.value[0];
          if(v && v.err){ throw new Error('Transaction failed: ' + JSON.stringify(v.err)); }
          if(v && (v.confirmationStatus === 'confirmed' || v.confirmationStatus === 'finalized')) break;
        }catch(statusErr){ console.warn('Signature status check failed on RPC:', rpc, statusErr); }
      }
    }
    return sig;
  }

  async function deploy(){
    updateLockdownUI();
    if(getLockUntil() > Date.now()){ alert('☢ Arena is in $1M lockdown. Wait for the 1-hour hazard timer to finish.'); return; }
    if(!currentAd){ alert('Upload and place a photo first.'); return; }
    if(!wallet){ alert('Connect wallet first.'); return; }
    const voucher = cleanVoucher($('#voucherCode').value);
    const name = ($('#adName').value || 'Unnamed War Ad').trim().slice(0,40);
    const budgetInput = $('#budgetInput');
    let budgetVal = budgetInput ? parseMoneyValue(budgetInput.value) : 0;
    if(budgetInput && budgetInput.value.trim() && budgetVal < 0.5){
      alert('Minimum war price is 0.50 USDC.');
      budgetInput.value = '0.50';
      budgetVal = 0.5;
    }
    if(budgetVal >= 0.5) resizeAdToPrice(budgetVal);
    let p = priceFor(currentAd);

    let paymentSignature = '';
    if(voucher){
      const vcheck = await lookupVoucher(voucher);
      showVoucherResult(vcheck);
      if(!vcheck.ok){
        alert(vcheck.reason === 'used' ? 'Voucher already used.' : vcheck.reason === 'disabled' ? 'Voucher disabled.' : 'Invalid voucher code.');
        return;
      }
      let voucherTier = Number(vcheck.tier) || voucherValue(voucher) || 0.5;
      if(voucherTier > 0){
        resizeAdToPrice(voucherTier);
        p = priceFor(currentAd);
        p.price = voucherTier;
      }
      currentAd.dataset.voucherId = vcheck.row?.id || '';
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
      if(supa){
        try{
          const updatePayload = { used:true, used_by: wallet, used_at: new Date().toISOString() };
          let q = supa.from('voucher_codes').update(updatePayload);
          if(deployedAd.dataset.voucherId) q = q.eq('id', deployedAd.dataset.voucherId);
          else q = q.eq('code', voucher);
          const { error } = await q;
          if(error) throw error;
          setVoucherStatus('✅ Voucher used and burned', 'ok');
        }catch(e){
          console.warn('Voucher update failed:', e);
          setVoucherStatus('⚠️ Ad deployed, but voucher status update failed. Check admin.', 'bad');
        }
      } else {
        setVoucherStatus('✅ Voucher used', 'ok');
      }
    }
    if(paymentSignature) deployedAd.dataset.tx = paymentSignature;
    deployedAd.dataset.displayAmount = String(p.price || 0);
    const visualAmount = Number(p.price || 0);
    const paidAmountToSave = voucher ? 0 : visualAmount;
    console.log('PAYMENT OK, SAVING AD...', { paymentSignature, price:p.price, voucher });
    await saveDeployedAd(deployedAd, paidAmountToSave);
    console.log('AD SAVE STEP FINISHED');
    $('#voucherCode').value = '';
    announce(name, visualAmount); impact(visualAmount);
    await loadDeployedAds();
    setTimeout(loadDeployedAds, 1200);
    closeSheet(); currentAd=null; updatePrice();
    $('#deployBtn').disabled = false;
    $('#deployBtn').textContent = 'DEPLOY TO WAR';
    alert(paymentSignature ? 'Payment confirmed. Ad deployed and locked forever.' : 'Voucher accepted. Ad deployed and locked forever.');
  }

  $('#connectBtn').onclick = connect;
  $('#addBtn').onclick = openSheet; $('#mobileAddBtn').onclick = openSheet; $('#closeSheet').onclick = closeSheet;
  $('#closePanel').onclick = closePanel;
  $('#deployBtn').onclick = deploy;
  const budgetEl = $('#budgetInput');
  const applyBudget = () => {
    if(!budgetEl) return;
    const raw = budgetEl.value;
    // Free text input: user can erase .00, type 1m, 1000, 0.50, etc.
    if(raw.trim() === ''){ updatePrice(); return; }
    let v = parseMoneyValue(raw);
    if(Number.isFinite(v) && v >= 0.5){
      v = Math.max(0.5, Math.min(1000000, v));
      resizeAdToPrice(v, false);
      if(currentAd) currentAd.dataset.manualPrice = String(v);
    }
  };
  budgetEl?.addEventListener('input', applyBudget);
  budgetEl?.addEventListener('keyup', applyBudget);
  budgetEl?.addEventListener('change', applyBudget);
  budgetEl?.addEventListener('blur', applyBudget);
  let voucherTimer;
  const handleVoucherInput = (e) => {
    const code = cleanVoucher(e.target.value);
    clearTimeout(voucherTimer);
    if(!code){ setVoucherStatus(''); return; }
    const rough = voucherValue(code);
    if(rough) resizeAdToPrice(rough);
    setVoucherStatus('Checking voucher...');
    voucherTimer = setTimeout(async()=>{
      const result = await lookupVoucher(code);
      showVoucherResult(result);
      if(result.ok && result.tier) resizeAdToPrice(result.tier);
    }, 350);
  };
  $('#voucherCode').addEventListener('change', handleVoucherInput);
  $('#voucherCode').addEventListener('input', handleVoucherInput);
  async function fileToCompressedDataUrl(file){
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          try{
            const max = 900;
            const scale = Math.min(1, max / Math.max(img.width, img.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(img.width * scale));
            canvas.height = Math.max(1, Math.round(img.height * scale));
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.72));
          }catch(_e){ resolve(reader.result); }
        };
        img.onerror = () => resolve(reader.result);
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  $('#imageInput').onchange = async (e)=>{ const file=e.target.files[0]; if(!file) return; const dataUrl = await fileToCompressedDataUrl(file); addAd(dataUrl); };
  $$('#xLink').forEach(a=>a.href=config.twitter||a.href); $$('#tgLink').forEach(a=>a.href=config.telegram||a.href);
  $$('[data-panel]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.panel)));




  let realtimePoll = null;
  function setupAdsRealtime(){
    const reloadAll = () => { loadDeployedAds(); };
    if(supa){
      try{
        if(adsChannel) supa.removeChannel(adsChannel);
        adsChannel = supa.channel('jakwo-war-ads-live')
          .on('postgres_changes', { event:'INSERT', schema:'public', table:'ads' }, reloadAll)
          .on('postgres_changes', { event:'UPDATE', schema:'public', table:'ads' }, reloadAll)
          .on('postgres_changes', { event:'DELETE', schema:'public', table:'ads' }, reloadAll)
          .subscribe((status)=>{
            console.log('ADS REALTIME:', status);
            if(status === 'SUBSCRIBED') reloadAll();
          });
      }catch(e){ console.warn('Supabase ads realtime failed:', e); }
    }
    // Fallback: if Supabase Realtime is not enabled for ads, this still updates other devices without refresh.
    if(realtimePoll) clearInterval(realtimePoll);
    realtimePoll = setInterval(()=>{
      if(document.visibilityState !== 'hidden') loadDeployedAds();
    }, 3000);
    window.addEventListener('focus', loadDeployedAds);
    document.addEventListener('visibilitychange', () => { if(document.visibilityState !== 'hidden') loadDeployedAds(); });
  }

  function initMobileStageZoom(){
    const app = document.querySelector('.app');
    if(!app || !arena) return;
    let scale = Number(arena.dataset.zoom || 1) || 1;
    let startDist = 0;
    let startScale = 1;
    let startWorldX = 0;
    let startWorldY = 0;
    let focalX = 0;
    let focalY = 0;
    const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
    const apply = ()=>{
      arena.style.transformOrigin = '0 0';
      arena.style.transform = `scale(${scale})`;
      arena.dataset.zoom = String(scale);
      // Keep scrollable camera size matching the transformed battlefield.
      arena.style.marginRight = Math.max(0, ARENA_WIDTH * (scale - 1)) + 'px';
      arena.style.marginBottom = Math.max(0, ARENA_HEIGHT * (scale - 1)) + 'px';
    };
    const distance = (t1,t2)=>Math.hypot(t1.clientX-t2.clientX,t1.clientY-t2.clientY);
    const focalPoint = (touches)=>{
      const r = app.getBoundingClientRect();
      return {
        x: ((touches[0].clientX + touches[1].clientX) / 2) - r.left,
        y: ((touches[0].clientY + touches[1].clientY) / 2) - r.top
      };
    };
    app.addEventListener('touchstart', (e)=>{
      if(e.touches && e.touches.length === 2){
        startDist = distance(e.touches[0], e.touches[1]);
        startScale = scale;
        const f = focalPoint(e.touches);
        focalX = f.x; focalY = f.y;
        startWorldX = (app.scrollLeft + focalX) / startScale;
        startWorldY = (app.scrollTop + focalY) / startScale;
      }
    }, {passive:true});
    app.addEventListener('touchmove', (e)=>{
      if(e.touches && e.touches.length === 2){
        e.preventDefault();
        const d = distance(e.touches[0], e.touches[1]);
        if(startDist > 0){
          scale = clamp(startScale * (d / startDist), 0.65, 3);
          apply();
          app.scrollLeft = Math.max(0, startWorldX * scale - focalX);
          app.scrollTop = Math.max(0, startWorldY * scale - focalY);
        }
      }
    }, {passive:false});
    // Buttons for desktop/phone testing if present.
    document.querySelectorAll('.zoom-mini button').forEach((b,idx)=>{
      b.addEventListener('click',()=>{
        const old = scale;
        scale = clamp(idx===0 ? scale/1.15 : scale*1.15, 0.65, 3);
        const cx = app.clientWidth/2, cy = app.clientHeight/2;
        const wx = (app.scrollLeft + cx) / old, wy = (app.scrollTop + cy) / old;
        apply(); app.scrollLeft = wx*scale-cx; app.scrollTop = wy*scale-cy;
      });
    });
    apply();
  }

  initMobileStageZoom();
  updateLockdownUI();
  loadDeployedAds(); setupAdsRealtime(); updateWallet(); renderStats(); updatePrice();
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
