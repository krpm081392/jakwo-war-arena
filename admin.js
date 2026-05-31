const cfg = window.JAKWO_CONFIG || {};
const tiers=[{name:'Influencer',value:1000,max:50},{name:'Alpha',value:500,max:50},{name:'Community',value:100,max:100},{name:'Mini Warrior',value:.5,max:200}];
const $=id=>document.getElementById(id);
function codes(){try{return JSON.parse(localStorage.getItem('jakwo_vouchers')||'[]')}catch{return[]}}
function save(c){localStorage.setItem('jakwo_vouchers',JSON.stringify(c))}
$('adminLogin').onclick=()=>{ if($('adminPass').value!==cfg.ADMIN_PASSWORD) return alert('Wrong password'); $('adminPanel').classList.remove('hidden'); render(); }
function render(){ const all=codes(); $('tierList').innerHTML=tiers.map(t=>{const made=all.filter(c=>c.value===t.value).length; return `<div class="tier"><div><b>$${t.value}</b> ${t.name}<br><small>${made}/${t.max} generated</small></div><button class="btn primary" ${made>=t.max?'disabled':''} onclick="gen(${t.value})">Generate</button></div>`}).join(''); $('codeOutput').value=all.map(c=>`${c.code} | $${c.value} | ${c.used?'USED':'UNUSED'}`).join('\n'); }
window.gen=(value)=>{ const t=tiers.find(x=>x.value===value); const all=codes(); const made=all.filter(c=>c.value===value).length; if(made>=t.max) return alert('Max supply reached'); const code=`JAKWO-${String(value).replace('.','D')}-${Math.random().toString(36).slice(2,8).toUpperCase()}-${String(made+1).padStart(3,'0')}`; all.push({code,value,used:false,disabled:false,created_at:new Date().toISOString()}); save(all); render(); }
