import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { callAI } from "@/lib/ai";
import BottomNav from "@/components/BottomNav";
import { Activity, Timer, Shield, Trophy, LogOut, Brain, Loader2, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Profile {
  name: string;
  position: string;
  age: number;
  level: string;
  trainings_this_week: number;
  total_trainings: number;
  physical_level: number;
  days_until_game: number;
}

const levelColors: Record<string, string> = {
  Iniciante: "bg-muted text-muted-foreground",
  Titular: "bg-primary/20 text-primary",
  Estrela: "bg-highlight/20 text-highlight",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [aiSuggestion, setAiSuggestion] = useState<{ title: string; description: string; exercises: any[] } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [weekDays, setWeekDays] = useState<{ date: Date; hasTraining: boolean; label: string }[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const fetchData = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) setProfile(data);

      const { count } = await supabase
        .from("completed_trainings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setCompletedCount(count || 0);

      // Fetch week schedule
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekEnd = addDays(weekStart, 6);
      const { data: scheduled } = await supabase
        .from("scheduled_trainings")
        .select("scheduled_date, status")
        .eq("user_id", user.id)
        .gte("scheduled_date", format(weekStart, "yyyy-MM-dd"))
        .lte("scheduled_date", format(weekEnd, "yyyy-MM-dd"));

      const days = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(weekStart, i);
        const hasTraining = (scheduled || []).some(
          (s: any) => isSameDay(new Date(s.scheduled_date + "T12:00:00"), date)
        );
        return {
          date,
          hasTraining,
          label: format(date, "EEE", { locale: ptBR }).slice(0, 3),
        };
      });
      setWeekDays(days);

      // AI daily suggestion
      if (data) {
        setAiLoading(true);
        try {
          const result = await callAI(
            [{ role: "user", content: "Sugira o melhor treino para hoje." }],
            "daily-suggestion",
            { position: data.position, level: data.level, trainingsThisWeek: data.trainings_this_week, physicalLevel: data.physical_level, totalTrainings: data.total_trainings }
          );
          const parsed = JSON.parse(result);
          setAiSuggestion(parsed);
        } catch { /* silent fail */ }
        setAiLoading(false);
      }
    };
    fetchData();
  }, [user, authLoading, navigate]);

  if (authLoading || !profile) return <DashboardSkeleton />;

  const chartData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    score: Math.floor(Math.random() * 30) + profile.physical_level - 15,
  }));

  const handleStartTraining = () => {
    if (!aiSuggestion) {
      toast.error("Aguarde a IA gerar o treino do dia!");
      return;
    }
    navigate("/active-training", {
      state: {
        training: aiSuggestion,
        position: profile.position,
      },
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="gradient-field px-4 pt-6 pb-8">
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl border-2 border-primary/50">
            ⚽
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-lg font-bold text-foreground">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.position} • {profile.age} anos</p>
          </div>
          <span className={cn("px-3 py-1 rounded-full text-xs font-bold", levelColors[profile.level] || levelColors.Iniciante)}>
            {profile.level === "Estrela" && "⭐ "}{profile.level}
          </span>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4 max-w-md mx-auto">
        {/* AI Training Suggestion */}
        <div className="gradient-card rounded-xl p-5 border border-border/30 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-3">
            {aiLoading ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <Brain className="w-5 h-5 text-primary" />}
            <h3 className="font-heading text-base font-bold">
              {aiSuggestion ? "🧠 Treino sugerido pela IA" : "Treino de hoje"}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {aiSuggestion ? aiSuggestion.title : `Força e resistência — ${profile.position === "Goleiro" ? "reflexos e explosão" : "condicionamento e potência"}`}
          </p>
          {aiSuggestion && (
            <p className="text-xs text-muted-foreground mb-3">{aiSuggestion.description}</p>
          )}
          {aiSuggestion?.exercises && (
            <div className="space-y-1.5 mb-4">
              {aiSuggestion.exercises.slice(0, 4).map((ex: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs bg-muted/30 rounded-lg px-3 py-1.5">
                  <span className="text-foreground font-medium">{ex.name}</span>
                  <span className="text-muted-foreground">{ex.sets}x{ex.reps}</span>
                </div>
              ))}
            </div>
          )}
          <Button
            onClick={handleStartTraining}
            className="w-full h-12 font-heading font-bold bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            🔥 Iniciar aquecimento
          </Button>
        </div>

        {/* Week Summary */}
        {weekDays.length > 0 && (
          <div className="gradient-card rounded-xl p-4 border border-border/20 animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="w-4 h-4 text-highlight" />
              <h3 className="font-heading text-sm font-bold">Semana</h3>
            </div>
            <div className="flex justify-between">
              {weekDays.map(({ date, hasTraining, label }, i) => {
                const isToday = isSameDay(date, new Date());
                return (
                  <button
                    key={i}
                    onClick={() => navigate("/calendario")}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className={cn(
                      "text-[10px] font-medium uppercase",
                      isToday ? "text-primary" : "text-muted-foreground"
                    )}>
                      {label}
                    </span>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      hasTraining && isToday
                        ? "bg-primary text-primary-foreground"
                        : hasTraining
                        ? "bg-primary/20 text-primary"
                        : isToday
                        ? "border-2 border-primary text-primary"
                        : "bg-muted/30 text-muted-foreground"
                    )}>
                      {format(date, "d")}
                    </div>
                    {hasTraining && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Activity, label: "Treinos semana", value: `${profile.trainings_this_week}/5`, color: "text-primary" },
            { icon: Shield, label: "Nível físico", value: `${profile.physical_level}%`, color: "text-highlight" },
            { icon: Timer, label: "Treinos total", value: `${completedCount}`, color: "text-primary" },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <div
              key={label}
              className="gradient-card rounded-xl p-3 border border-border/20 text-center animate-slide-up"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <Icon className={cn("w-5 h-5 mx-auto mb-1", color)} />
              <p className="text-lg font-heading font-bold">{value}</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="gradient-card rounded-xl p-4 border border-border/20 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-highlight" />
            <h3 className="font-heading text-sm font-bold">Evolução — 30 dias</h3>
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Tooltip
                  contentStyle={{ background: "hsl(222 40% 10%)", border: "1px solid hsl(220 20% 18%)", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "hsl(215 20% 55%)" }}
                />
                <Line type="monotone" dataKey="score" stroke="hsl(142 72% 37%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-background p-4 space-y-4">
    <div className="h-20 bg-muted/50 rounded-xl animate-pulse" />
    <div className="h-36 bg-muted/50 rounded-xl animate-pulse" />
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted/50 rounded-xl animate-pulse" />)}
    </div>
    <div className="h-40 bg-muted/50 rounded-xl animate-pulse" />
  </div>
);

export default Dashboard;
