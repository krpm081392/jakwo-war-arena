JAKWO payment deploy patch

Changed only the deploy payment bug:
- Budget input value is now respected during deploy. If you type 0.50, deploy uses 0.50 and it will not jump to 581+.
- Manual budget input is free text and keeps the typed price.
- Drag/resize still updates the budget input.
- 1m / 1000000 still resizes to full visible arena.
- Phantom USDC payment now tries fallback Solana RPC endpoints if api.mainnet-beta.solana.com returns 403 Access Forbidden.

No UI redesign included.
