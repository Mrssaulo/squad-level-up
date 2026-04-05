// Stripe product/price IDs for Pro Futebol SM
export const PLANS = {
  monthly: {
    product_id: "prod_UGUKe0wVs5Pbj8",
    price_id: "price_1THxLpK6eHUew2Hbqbpgyb0M",
    label: "Mensal",
    price: "R$ 19,90",
    interval: "/mês",
  },
  quarterly: {
    product_id: "prod_UGUKe0wVs5Pbj8",
    price_id: "price_1TIniCK6eHUew2HbtyvNGM94",
    label: "Trimestral",
    price: "R$ 49,90",
    interval: "/trimestre",
    badge: "Economize 16%",
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanByProductId(productId: string | null): PlanKey | null {
  if (!productId) return null;
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.product_id === productId) return key as PlanKey;
  }
  return null;
}
