# JAKWO Meme War Ads — Deploy Guide

## What is included

- Page 1: vintage JAKWO TIMES war wall
- Running news ticker
- Clickable meme ads
- Overlapping ads allowed
- Wallet-only troll chat with no links
- Leaderboard
- Page 2: clean white upload page
- Drag + resize ad freely
- Live USDC price calculation
- Phantom wallet USDC payment to your wallet
- Auto publish after payment
- Owner admin canvas: `/admin`
- Admin can edit news ticker, background, meme photos, and text without code

## Supabase setup

1. Open Supabase dashboard.
2. Go to SQL Editor.
3. Open `supabase-schema.sql` from this ZIP.
4. Copy everything and click Run.

Your bucket name must be:

```txt
jakwo
```

It must be PUBLIC.

## Vercel environment variables

Add these in Vercel Project Settings > Environment Variables:

```txt
NEXT_PUBLIC_SUPABASE_URL=https://qfonfztznecycwfbpnhx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ftx8e2MlI3aEAK43hlLzlQ_wQWvNqpB
NEXT_PUBLIC_SUPABASE_BUCKET=jakwo
NEXT_PUBLIC_RECEIVER_WALLET=7YhjDDUMCq9eS2wRYv2rcLqFoSt7rN1N8FkG1CQavQHq
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
NEXT_PUBLIC_TWITTER_URL=https://x.com/jakw0o
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/+hJ-0IQGfYTRmYjM0
NEXT_PUBLIC_ADMIN_PASSWORD=make-your-own-password
```

Never add private key or seed phrase.

## Pages

- `/` homepage war wall
- `/upload` user upload/payment page
- `/admin` owner no-code editor

## Testing

Use Phantom wallet with Solana USDC. Minimum price starts at $0.50 depending on image size.
