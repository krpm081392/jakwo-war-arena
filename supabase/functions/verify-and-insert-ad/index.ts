import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const RECEIVER_WALLET = Deno.env.get('JAKWO_RECEIVER_WALLET') || '7YhjDDUMCq9eS2wRYv2rcLqFoSt7rN1N8FkG1CQavQHq';
const USDC_MINT = Deno.env.get('JAKWO_USDC_MINT') || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const SOLANA_RPC = Deno.env.get('JAKWO_SOLANA_RPC') || 'https://api.mainnet-beta.solana.com';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'content-type': 'application/json' } });
}

function cleanText(v: unknown, max = 300) {
  return String(v || '').trim().slice(0, max);
}

function safeNumber(v: unknown, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

async function getTransaction(signature: string) {
  const body = {
    jsonrpc: '2.0',
    id: 'jakwo-verify',
    method: 'getTransaction',
    params: [signature, { encoding: 'jsonParsed', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }],
  };
  const res = await fetch(SOLANA_RPC, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data?.error?.message || `RPC error ${res.status}`);
  return data.result;
}

function tokenAmount(balance: any) {
  const raw = balance?.uiTokenAmount?.amount;
  if (raw != null) return Number(raw) / 1_000_000;
  return Number(balance?.uiTokenAmount?.uiAmount || 0);
}

async function verifyUsdcPayment(signature: string, expectedAmount: number) {
  if (!signature || signature.length < 40) throw new Error('Missing transaction signature');
  if (!Number.isFinite(expectedAmount) || expectedAmount < 0.5) throw new Error('Invalid expected amount');

  const tx = await getTransaction(signature);
  if (!tx) throw new Error('Transaction not found yet. Wait a few seconds and try again.');
  if (tx.meta?.err) throw new Error('Transaction failed on-chain');

  const pre = tx.meta?.preTokenBalances || [];
  const post = tx.meta?.postTokenBalances || [];
  let receiverDelta = 0;

  for (const after of post) {
    if (after?.mint !== USDC_MINT) continue;
    if (after?.owner !== RECEIVER_WALLET) continue;
    const before = pre.find((b: any) => b.accountIndex === after.accountIndex && b.mint === after.mint);
    receiverDelta += tokenAmount(after) - tokenAmount(before || { uiTokenAmount: { amount: '0' } });
  }

  // Allow tiny rounding difference.
  if (receiverDelta + 0.000001 < expectedAmount) {
    throw new Error(`Payment amount mismatch. Expected ${expectedAmount} USDC, receiver gained ${receiverDelta} USDC.`);
  }

  return true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ ok: false, error: 'POST only' }, 405);

  try {
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) throw new Error('Supabase function secrets missing');

    const body = await req.json();
    const ad = body.ad || {};
    const voucherCode = cleanText(body.voucher_code || ad.voucher_code || '', 80).toUpperCase();
    const signature = cleanText(body.tx_signature || ad.tx_signature || '', 120);
    const expectedAmount = safeNumber(body.expected_amount || ad.display_amount || ad.amount, 0);

    if (!ad.image_url) throw new Error('Missing ad image');
    if (!ad.wallet) throw new Error('Missing wallet');

    // Block duplicate paid transaction signatures.
    if (signature) {
      const { data: existingSig, error: sigError } = await supabase
        .from('ads')
        .select('id')
        .eq('tx_signature', signature)
        .limit(1);
      if (sigError) throw sigError;
      if (existingSig && existingSig.length) throw new Error('Transaction signature already used');
    }

    let storedAmount = safeNumber(ad.amount, 0);
    let displayAmount = safeNumber(ad.display_amount || expectedAmount, storedAmount);

    if (voucherCode) {
      const { data: voucher, error: voucherError } = await supabase
        .from('voucher_codes')
        .select('*')
        .eq('code', voucherCode)
        .maybeSingle();
      if (voucherError) throw voucherError;
      if (!voucher) throw new Error('Invalid voucher');
      if (voucher.disabled) throw new Error('Voucher disabled');
      if (voucher.used) throw new Error('Voucher already used');
      displayAmount = safeNumber(voucher.tier, displayAmount || 0.5);
      storedAmount = 0;

      const { error: burnError } = await supabase
        .from('voucher_codes')
        .update({ used: true, used_by: ad.wallet, used_at: new Date().toISOString() })
        .eq('code', voucherCode)
        .eq('used', false);
      if (burnError) throw burnError;
    } else {
      await verifyUsdcPayment(signature, expectedAmount);
      storedAmount = expectedAmount;
      displayAmount = expectedAmount;
    }

    const payload: Record<string, unknown> = {
      image_url: cleanText(ad.image_url, 700000),
      link: cleanText(ad.link, 500),
      wallet: cleanText(ad.wallet, 120),
      amount: storedAmount,
      display_amount: displayAmount,
      x: safeNumber(ad.x, 0),
      y: safeNumber(ad.y, 0),
      w: Math.max(40, safeNumber(ad.w, 40)),
      h: Math.max(40, safeNumber(ad.h, 40)),
      x_percent: safeNumber(ad.x_percent, 0),
      y_percent: safeNumber(ad.y_percent, 0),
      w_percent: safeNumber(ad.w_percent, 0),
      h_percent: safeNumber(ad.h_percent, 0),
      name: cleanText(ad.name || 'War Ad', 60),
      locked: true,
      voucher_code: voucherCode || null,
      tx_signature: signature || null,
      deleted: false,
      is_deleted: false,
    };

    const { data, error } = await supabase.from('ads').insert(payload).select('id').single();
    if (error) throw error;
    return json({ ok: true, id: data?.id });
  } catch (e) {
    return json({ ok: false, error: e?.message || String(e) }, 400);
  }
});
