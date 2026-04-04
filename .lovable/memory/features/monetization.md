---
name: Monetization & Stripe Integration
description: Premium subscription system with Stripe checkout, subscription verification, and customer portal
type: feature
---
## Stripe Products
- Monthly: prod_UGrTccxgb5XqYq / price_1TIJl1K9r3HkkZHnLusugTlu (R$29.90/month)
- Quarterly: prod_UGrVQdyHP74P0F / price_1TIJmXK9r3HkkZHn4qxcE2pv (R$79.90/3 months)

## Edge Functions
- `create-checkout` — creates Stripe checkout session
- `check-subscription` — verifies subscription status, syncs profile.is_premium
- `customer-portal` — opens Stripe billing portal

## Frontend
- `src/lib/plans.ts` — plan definitions with product/price IDs
- `src/contexts/SubscriptionContext.tsx` — subscription state, auto-checks every 60s
- `src/pages/Planos.tsx` — plans comparison page at /planos
- `src/components/PremiumBadge.tsx` — discrete premium indicator
- `src/components/UpgradePrompt.tsx` — elegant upgrade CTA (compact and full variants)

## Premium Gating
- profiles.is_premium synced by check-subscription edge function
- SubscriptionProvider wraps all authenticated routes via AuthShell
- Dashboard shows upgrade prompt for free users, premium badge for subscribers
