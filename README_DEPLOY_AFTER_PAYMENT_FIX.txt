JAKWO deploy-after-payment fix

Changed only:
- Payment now prefers backup public Solana RPC endpoints before api.mainnet-beta.
- If Phantom sends the transaction but RPC confirmation expires, deploy continues with the transaction signature instead of stopping.
- Added console logs: PAYMENT OK, SAVING AD / AD SAVE STEP FINISHED.
- Disconnect wallet now clears local wallet state and updates button.

Not changed:
- UI layout
- chat behavior
- pricing/resize UI
- story/rules/leaderboard layout
