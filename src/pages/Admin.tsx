import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, Crown, DollarSign, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Stats {
  totalUsers: number;
  totalPremium: number;
  monthlyRevenue: number;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalPremium: 0, monthlyRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.email !== ADMIN_EMAIL) {
      navigate("/dashboard");
      return;
    }
    fetchStats();
  }, [user, authLoading]);

  const fetchStats = async () => {
    try {
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: totalPremium } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_premium", true);

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: subs } = await supabase
        .from("subscriptions")
        .select("amount")
        .eq("status", "active")
        .gte("created_at", startOfMonth.toISOString());

      const monthlyRevenue = subs?.reduce((sum, s) => sum + Number(s.amount), 0) || 0;

      setStats({
        totalUsers: totalUsers || 0,
        totalPremium: totalPremium || 0,
        monthlyRevenue,
      });
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const cards = [
    { label: "Total de Usuários", value: stats.totalUsers, icon: Users, color: "text-blue-400" },
    { label: "Usuários Premium", value: stats.totalPremium, icon: Crown, color: "text-accent" },
    { label: "Receita do Mês", value: `R$ ${stats.monthlyRevenue.toFixed(2)}`, icon: DollarSign, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Painel Admin</h1>
          </div>
        </div>

        <div className="grid gap-4">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="p-5 bg-card border-border/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-muted/50 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
