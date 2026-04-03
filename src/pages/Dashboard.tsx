import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/backend";
import { callAI } from "@/lib/ai";
import BottomNav from "@/components/BottomNav";
import OnboardingTour, { type TourStep } from "@/components/OnboardingTour";
import { Activity, Timer, Shield, LogOut, Loader2, CalendarDays, Eye, Trash2, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const tourSteps: TourStep[] = [
  { target: "[data-tour='ai-training']", title: "Seu foco de hoje", description: "A cada dia, o sistema analisa seu perfil e sugere o treino mais coerente. Clique em 'Iniciar' para começar.", placement: "bottom" },
  { target: "[data-tour='week-calendar']", title: "Sua semana", description: "Visualize sua rotina semanal. Dias com marcação já têm treino organizado.", placement: "bottom" },
  { target: "[data-tour='stats']", title: "Seus indicadores", description: "Acompanhe treinos da semana, nível físico e total de sessões concluídas.", placement: "top" },
  { target: "[data-tour='nav-treinos']", title: "Biblioteca de treinos", description: "Explore treinos organizados por posição, categoria e nível de dificuldade.", placement: "top" },
  { target: "[data-tour='nav-ranking']", title: "Ranking semanal", description: "Acompanhe sua consistência em comparação com outros atletas.", placement: "top" },
  { target: "[data-tour='nav-coach']", title: "Coach de apoio", description: "Use o coach para tirar dúvidas e ajustar foco no seu processo.", placement: "top" },
];

interface Profile {
  name: string; position: string; age: number; level: string;
  trainings_this_week: number; total_trainings: number; physical_level: number; days_until_game: number;
}

const levelColors: Record<string, string> = {
  Iniciante: "bg-muted text-muted-foreground",
  Titular: "bg-primary/15 text-primary border-primary/20",
  Estrela: "bg-highlight/15 text-highlight border-highlight/20",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [aiSuggestion, setAiSuggestion] = useState<{ title: string; description: string; exercises: any[] } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [weekDays, setWeekDays] = useState<{ date: Date; hasTraining: boolean; label: string; trainingId?: string; trainingTitle?: string }[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    let isMounted = true;

    const fetchData = async () => {
      setProfileLoading(true);
      try {
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles").select("*").eq("user_id", user.id).maybeSingle();
        if (profileError) throw profileError;

        let currentProfile = existingProfile;
        if (!currentProfile) {
          const { data: createdProfile, error: createProfileError } = await supabase
            .from("profiles").insert({
              user_id: user.id,
              name: user.user_metadata?.name || user.email?.split("@")[0] || "Atleta",
              email: user.email || null,
            }).select("*").single();
          if (createProfileError) throw createProfileError;
          currentProfile = createdProfile;
        }

        if (!isMounted || !currentProfile) return;
        setProfile(currentProfile);

        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 6);

        const [{ count }, { data: scheduled }] = await Promise.all([
          supabase.from("completed_trainings").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("scheduled_trainings").select("id, scheduled_date, status, training_title").eq("user_id", user.id)
            .gte("scheduled_date", format(weekStart, "yyyy-MM-dd")).lte("scheduled_date", format(weekEnd, "yyyy-MM-dd")),
        ]);

        if (!isMounted) return;
        setCompletedCount(count || 0);

        const days = Array.from({ length: 7 }, (_, i) => {
          const date = addDays(weekStart, i);
          const match = (scheduled || []).find((s: any) => isSameDay(new Date(s.scheduled_date + "T12:00:00"), date));
          return { date, hasTraining: !!match, label: format(date, "EEE", { locale: ptBR }).slice(0, 3), trainingId: match?.id, trainingTitle: match?.training_title };
        });
        setWeekDays(days);

        const cacheKey = `daily_suggestion_${new Date().toDateString()}`;
        let cached: string | null = null;
        try { cached = localStorage.getItem(cacheKey); } catch { /* blocked */ }
        if (cached) { try { setAiSuggestion(JSON.parse(cached)); return; } catch { try { localStorage.removeItem(cacheKey); } catch { /* */ } } }

        setAiLoading(true);
        try {
          const result = await callAI(
            [{ role: "user", content: "Sugira o melhor treino para hoje." }],
            "daily-suggestion",
            { position: currentProfile.position, level: currentProfile.level, trainingsThisWeek: currentProfile.trainings_this_week, physicalLevel: currentProfile.physical_level, totalTrainings: currentProfile.total_trainings }
          );
          if (!isMounted) return;
          const parsed = JSON.parse(result);
          setAiSuggestion(parsed);
          try { localStorage.setItem(cacheKey, JSON.stringify(parsed)); } catch { /* */ }
        } catch (error) {
          console.error("Error generating daily suggestion:", error);
          // Don't block the dashboard — the user can still navigate and use the app
        }
        finally { if (isMounted) setAiLoading(false); }
      } catch (error) {
        console.error("Error loading dashboard:", error);
        if (isMounted) { setProfile(null); toast.error("Não foi possível carregar seu painel."); }
      } finally { if (isMounted) setProfileLoading(false); }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [user, authLoading, navigate]);

  const chartData = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    score: Math.floor(Math.sin(i * 0.5) * 15 + Math.cos(i * 0.3) * 10) + (profile?.physical_level || 75),
  })), [profile?.physical_level]);

  if (authLoading || profileLoading) return <DashboardSkeleton />;
  if (!profile) return <DashboardErrorState />;

  const handleStartTraining = () => {
    if (!aiSuggestion) { toast.error("Aguarde o direcionamento de hoje!"); return; }
    navigate("/active-training", { state: { training: aiSuggestion, position: profile.position } });
  };

  const removeScheduledTraining = async (trainingId: string) => {
    if (!user) return;
    const { error } = await supabase.from("scheduled_trainings").delete().eq("id", trainingId).eq("user_id", user.id);
    if (error) { toast.error("Erro ao remover treino"); return; }
    setWeekDays((prev) => prev.map((d) => d.trainingId === trainingId ? { ...d, hasTraining: false, trainingId: undefined, trainingTitle: undefined } : d));
    toast.success("Treino removido.");
  };

  const handleLogout = async () => { await signOut(); navigate("/"); };
  const trainedDays = weekDays.filter(d => d.hasTraining).length;

  return (
    <div className="min-h-screen bg-background pb-20 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden px-4 pt-6 pb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-2 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,hsl(145_65%_42%/0.06),transparent_50%)]" />
        <div className="relative flex items-center gap-3 animate-fade-in max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center text-xl">⚽</div>
          <div className="flex-1">
            <h2 className="font-heading text-lg font-extrabold text-foreground tracking-tight">{profile.name}</h2>
            <p className="text-xs text-muted-foreground">{profile.position} · {profile.age} anos</p>
          </div>
          <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border", levelColors[profile.level] || levelColors.Iniciante)}>
            {profile.level}
          </span>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors ml-1">
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-3 space-y-4 max-w-md mx-auto">
        {/* === FOCUS OF THE DAY === */}
        <div className="premium-card rounded-2xl p-5 animate-slide-up" data-tour="ai-training" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-1">
            <p className="section-title text-primary">Seu foco de hoje</p>
            {aiLoading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
          </div>
          <h3 className="font-heading text-base font-bold tracking-tight text-foreground mb-1">
            {aiSuggestion ? aiSuggestion.title : "Preparando seu direcionamento..."}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            {aiSuggestion
              ? aiSuggestion.description
              : "O próximo passo da sua evolução começa na consistência do que você faz agora."}
          </p>

          {aiSuggestion?.exercises && (
            <div className="space-y-1.5 mb-4">
              {aiSuggestion.exercises.slice(0, 4).map((ex: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs bg-surface-2 rounded-lg px-3 py-2">
                  <span className="text-foreground font-medium">{ex.name}</span>
                  <span className="text-muted-foreground">{ex.sets}x{ex.reps}</span>
                </div>
              ))}
            </div>
          )}

          <Button onClick={handleStartTraining} disabled={aiLoading} className="w-full h-12 font-heading font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
            Iniciar treino de hoje
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* === WEEK PROGRESS === */}
        {weekDays.length > 0 && (
          <div className="premium-card rounded-2xl p-4 animate-slide-up" data-tour="week-calendar" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="section-title text-primary mb-0.5">Sua semana em construção</p>
                <p className="text-[11px] text-muted-foreground">
                  {trainedDays === 0
                    ? "Sua evolução depende menos de intensidade isolada e mais de consistência."
                    : `${trainedDays}/7 dias com treino organizado`}
                </p>
              </div>
              <button onClick={() => navigate("/calendario")} className="text-xs text-primary font-semibold hover:underline">
                Calendário
              </button>
            </div>
            <div className="flex justify-between mt-3">
              {weekDays.map(({ date, hasTraining, label, trainingId, trainingTitle }, i) => {
                const isToday = isSameDay(date, new Date());
                const dayContent = (
                  <div className="flex flex-col items-center gap-1">
                    <span className={cn("text-[10px] font-medium uppercase", isToday ? "text-primary" : "text-muted-foreground")}>{label}</span>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      hasTraining && isToday ? "bg-primary text-primary-foreground" :
                      hasTraining ? "bg-primary/15 text-primary" :
                      isToday ? "border-2 border-primary text-primary" :
                      "bg-surface-2 text-muted-foreground"
                    )}>{format(date, "d")}</div>
                    {hasTraining && <div className="w-1 h-1 rounded-full bg-primary" />}
                  </div>
                );

                if (!hasTraining) return <button key={i} onClick={() => navigate("/calendario")} className="flex flex-col items-center gap-1">{dayContent}</button>;

                return (
                  <Popover key={i}>
                    <PopoverTrigger asChild><button className="flex flex-col items-center gap-1">{dayContent}</button></PopoverTrigger>
                    <PopoverContent className="w-44 p-2" side="top" align="center">
                      {trainingTitle && <p className="text-xs font-medium text-foreground mb-2 px-1 truncate">{trainingTitle}</p>}
                      <button onClick={() => navigate("/calendario")} className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors">
                        <Eye className="w-3.5 h-3.5 text-primary" /><span>Ver treino</span>
                      </button>
                      <button onClick={() => trainingId && removeScheduledTraining(trainingId)} className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-destructive/10 text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /><span>Remover</span>
                      </button>
                    </PopoverContent>
                  </Popover>
                );
              })}
            </div>
          </div>
        )}

        {/* === STATS === */}
        <div className="grid grid-cols-3 gap-3" data-tour="stats">
          {[
            { icon: Activity, label: "Semana", value: `${profile.trainings_this_week}/5`, color: "text-primary", bg: "bg-primary/10 border-primary/15" },
            { icon: Shield, label: "Nível", value: `${profile.physical_level}%`, color: "text-accent", bg: "bg-accent/10 border-accent/15" },
            { icon: Timer, label: "Sessões", value: `${completedCount}`, color: "text-primary", bg: "bg-primary/10 border-primary/15" },
          ].map(({ icon: Icon, label, value, color, bg }, i) => (
            <div key={label} className="premium-card rounded-2xl p-3 text-center animate-slide-up" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
              <div className={cn("w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center border", bg)}>
                <Icon className={cn("w-4 h-4", color)} />
              </div>
              <p className="text-lg font-heading font-extrabold">{value}</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* === EVOLUTION CHART === */}
        <div className="premium-card rounded-2xl p-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="section-title text-primary mb-0.5">Seu processo recente</p>
              <p className="text-[11px] text-muted-foreground">Acompanhe sua construção e veja onde seu ritmo está avançando.</p>
            </div>
            <button onClick={() => navigate("/historico")} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Ver mais
            </button>
          </div>
          <div className="h-28 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Tooltip
                  contentStyle={{ background: "hsl(220 18% 11%)", border: "1px solid hsl(220 15% 16%)", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "hsl(215 15% 50%)" }}
                />
                <Line type="monotone" dataKey="score" stroke="hsl(145 65% 42%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* === QUICK ACTIONS === */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <button onClick={() => navigate("/personal")} className="premium-card rounded-2xl p-4 text-left group">
            <CalendarDays className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-heading text-xs font-bold text-foreground">Plano semanal</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Organize sua rotina</p>
          </button>
          <button onClick={() => navigate("/avaliacao")} className="premium-card rounded-2xl p-4 text-left group">
            <TrendingUp className="w-5 h-5 text-accent mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-heading text-xs font-bold text-foreground">Avaliação</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Seus indicadores</p>
          </button>
        </div>
      </div>

      <BottomNav />
      <OnboardingTour steps={tourSteps} storageKey="dashboard-tour-seen" />
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-background p-4 space-y-4">
    <div className="h-20 bg-surface-2 rounded-xl animate-pulse" />
    <div className="h-40 bg-surface-2 rounded-xl animate-pulse" />
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-surface-2 rounded-xl animate-pulse" />)}
    </div>
    <div className="h-36 bg-surface-2 rounded-xl animate-pulse" />
  </div>
);

const DashboardErrorState = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="max-w-sm w-full text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto text-2xl">⚠️</div>
      <div className="space-y-2">
        <h2 className="text-xl font-heading font-bold text-foreground">Não foi possível carregar seu painel</h2>
        <p className="text-sm text-muted-foreground">Tente recarregar a página ou entre novamente.</p>
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={() => window.location.reload()} className="w-full">Recarregar</Button>
        <Button variant="outline" onClick={() => window.location.assign("/login")} className="w-full">Ir para login</Button>
      </div>
    </div>
  </div>
);

export default Dashboard;
