// Stripe product/price IDs for Pro Futebol SM
export const PLANS = {
  monthly: {
    product_id: "prod_UGrTccxgb5XqYq",
    price_id: "price_1TIJl1K9r3HkkZHnLusugTlu",
    label: "Mensal",
    price: "R$ 29,90",
    interval: "/mês",
  },
  quarterly: {
    product_id: "prod_UGrVQdyHP74P0F",
    price_id: "price_1TIJmXK9r3HkkZHn4qxcE2pv",
    label: "Trimestral",
    price: "R$ 79,90",
    interval: "/trimestre",
    badge: "Economize 11%",
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
