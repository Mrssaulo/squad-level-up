import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/lib/backend";
import { PLANS, type PlanKey } from "@/lib/plans";
import { Check, Crown, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const FREE_FEATURES = [
  "Acesso inicial ao sistema",
  "Visão básica da rotina",
  "Treinos selecionados",
  "Uso limitado do coach",
  "Acompanhamento inicial",
];

const PREMIUM_FEATURES = [
  "Plano semanal completo",
  "Rotina mais personalizada",
  "Calendário completo",
  "Evolução detalhada",
  "Histórico ampliado",
  "Coach de apoio com uso ampliado",
  "Experiência completa de evolução",
];

const Planos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribed, planKey, subscriptionEnd, checkSubscription } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const handleCheckout = async (key: PlanKey) => {
    if (!user) { navigate("/login"); return; }
    setLoadingPlan(key);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: PLANS[key].price_id },
      });
      if (error) throw error;
      if (data?.error) { toast.error(data.error); return; }
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast.error("Erro ao iniciar checkout. Tente novamente.");
      console.error(err);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManage = async () => {
    setLoadingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      toast.error("Erro ao abrir portal de gestão.");
    } finally {
      setLoadingPortal(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">Planos</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
        {/* Hero */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Crown className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Desbloqueie uma rotina de evolução mais completa</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Entre na versão premium para ter mais profundidade, mais personalização e mais consistência na sua preparação.
          </p>
        </div>

        {/* Active plan info */}
        {subscribed && (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Seu plano: Premium {planKey === "quarterly" ? "Trimestral" : "Mensal"}</span>
            </div>
            {subscriptionEnd && (
              <p className="text-xs text-muted-foreground">
                Próxima renovação: {format(new Date(subscriptionEnd), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            )}
            <Button variant="outline" size="sm" onClick={handleManage} disabled={loadingPortal} className="w-full">
              {loadingPortal ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gerenciar assinatura"}
            </Button>
          </div>
        )}

        {/* Free plan */}
        <div className={cn("rounded-2xl border p-5 space-y-4", !subscribed ? "border-border bg-card" : "border-border/50 bg-card/50 opacity-60")}>
          <div>
            <h3 className="text-base font-bold text-foreground">Grátis</h3>
            <p className="text-xs text-muted-foreground mt-1">Comece sua jornada</p>
          </div>
          <ul className="space-y-2">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          {!subscribed && (
            <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard")}>
              Continuar no grátis
            </Button>
          )}
        </div>

        {/* Premium plans */}
        <div className="space-y-3">
          {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(([key, plan]) => {
            const isActive = subscribed && planKey === key;
            return (
              <div
                key={key}
                className={cn(
                  "rounded-2xl border p-5 space-y-4 relative overflow-hidden",
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-primary/30 bg-card hover:border-primary/50 transition-colors"
                )}
              >
                {"badge" in plan && plan.badge && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h3 className="text-base font-bold text-foreground">Premium {plan.label}</h3>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.interval}</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {PREMIUM_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isActive ? (
                  <div className="text-center text-xs font-semibold text-primary">Seu plano atual</div>
                ) : !subscribed ? (
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    onClick={() => handleCheckout(key)}
                    disabled={!!loadingPlan}
                  >
                    {loadingPlan === key ? <Loader2 className="w-4 h-4 animate-spin" /> : `Assinar ${plan.label}`}
                  </Button>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Fine print */}
        <p className="text-center text-[11px] text-muted-foreground/60 pb-4">
          Pagamento seguro via Stripe. Cancele a qualquer momento.
        </p>
      </div>
    </div>
  );
};

export default Planos;
