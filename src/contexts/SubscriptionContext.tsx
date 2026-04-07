import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/backend";
import { useAuth } from "@/contexts/AuthContext";
import { getPlanByProductId, type PlanKey } from "@/lib/plans";

interface SubscriptionState {
  subscribed: boolean;
  planKey: PlanKey | null;
  subscriptionEnd: string | null;
  loading: boolean;
  checkSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user, session } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [planKey, setPlanKey] = useState<PlanKey | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSubscription = useCallback(async () => {
    if (!session?.access_token) {
      setSubscribed(false);
      setPlanKey(null);
      setSubscriptionEnd(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      const isSubscribed = data?.subscribed ?? false;
      setSubscribed(isSubscribed);
      setPlanKey(getPlanByProductId(data?.product_id ?? null));
      setSubscriptionEnd(data?.subscription_end ?? null);
      // If edge function says not subscribed, double-check profile (manual premium)
      if (!isSubscribed && user) {
        const { data: profile } = await supabase.from("profiles").select("is_premium, premium_expires_at").eq("user_id", user.id).maybeSingle();
        if (profile?.is_premium && profile?.premium_expires_at && new Date(profile.premium_expires_at) > new Date()) {
          setSubscribed(true);
        }
      }
    } catch (err) {
      console.error("Error checking subscription:", err);
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("is_premium, premium_expires_at").eq("user_id", user.id).maybeSingle();
        if (profile?.is_premium && profile?.premium_expires_at && new Date(profile.premium_expires_at) > new Date()) {
          setSubscribed(true);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, user]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    checkSubscription();
    const interval = setInterval(checkSubscription, 60_000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  // Check on checkout return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      setTimeout(checkSubscription, 2000);
    }
  }, [checkSubscription]);

  return (
    <SubscriptionContext.Provider value={{ subscribed, planKey, subscriptionEnd, loading, checkSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
};
