export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const RECEIVER_WALLET = process.env.NEXT_PUBLIC_RECEIVER_WALLET || '';
export const TWITTER = process.env.NEXT_PUBLIC_TWITTER || 'https://x.com/jakw0o';
export const TELEGRAM = process.env.NEXT_PUBLIC_TELEGRAM || '#';

export const memeFiles = [
  '10944.jpg','10945.jpg','10946.jpg','10947.jpg','10948.jpg','10949.jpg','10950.jpg','10951.jpg',
  '10952.jpg','10953.jpg','10954.jpg','10955.jpg','10956.jpg','10957.jpg','10958.jpg','10959.jpg'
];

export function memePath(file){ return `/memes/${file}`; }

export function headers(){
  return { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' };
}

export async function fetchTable(table, query='select=*'){
  if(!SUPABASE_URL || !SUPABASE_KEY) return [];
  try{
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, { headers: headers(), cache: 'no-store' });
    if(!r.ok) return [];
    return await r.json();
  }catch{ return []; }
}

export async function insertRow(table, row){
  if(!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase env missing');
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method:'POST', headers:{...headers(), Prefer:'return=representation'}, body: JSON.stringify(row)
  });
  const text = await r.text();
  if(!r.ok) throw new Error(text || `Insert failed ${r.status}`);
  try{return JSON.parse(text)[0];}catch{return null;}
}

export async function uploadImage(file){
  if(!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase env missing');
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const path = `ads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/jakwo/${path}`, {
    method:'POST',
    headers:{ apikey: SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, 'Content-Type': file.type || 'application/octet-stream', 'x-upsert':'true' },
    body:file
  });
  if(!r.ok){ throw new Error(await r.text()); }
  return `${SUPABASE_URL}/storage/v1/object/public/jakwo/${path}`;
}

export function priceForSize(w,h){
  const arena = 4000*2600;
  const pct = (Math.max(20,w)*Math.max(20,h))/arena;
  const raw = 0.5 + Math.pow(pct, 1.25) * 1000000;
  return Math.max(0.5, Math.min(1000000, Number(raw.toFixed(2))));
}
