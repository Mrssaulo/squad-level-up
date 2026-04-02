import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { callAI } from "@/lib/ai";
import BottomNav from "@/components/BottomNav";
import OnboardingTour, { type TourStep } from "@/components/OnboardingTour";
import { Activity, Timer, Shield, Trophy, LogOut, Brain, Loader2, CalendarDays, Flame, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const tourSteps: TourStep[] = [
  {
    target: "[data-tour='ai-training']",
    title: "Treino com IA 🤖",
    description: "A cada dia, nossa IA analisa seu perfil e sugere o melhor treino. Clique em 'Iniciar' para começar com timer automático!",
    placement: "bottom",
  },
  {
    target: "[data-tour='week-calendar']",
    title: "Sua semana 📅",
    description: "Veja seus treinos agendados da semana. Os dias com bolinha verde já têm treino marcado!",
    placement: "bottom",
  },
  {
    target: "[data-tour='stats']",
    title: "Suas estatísticas 📊",
    description: "Acompanhe treinos da semana, nível físico e total de treinos completados em tempo real.",
    placement: "top",
  },
  {
    target: "[data-tour='nav-treinos']",
    title: "Biblioteca de Treinos 💪",
    description: "Explore mais de 15 treinos organizados por posição, categoria e dificuldade. Cada um com vídeo demonstrativo!",
    placement: "top",
  },
  {
    target: "[data-tour='nav-ranking']",
    title: "Ranking Semanal 🏆",
    description: "Compare seu desempenho com outros jogadores! Quem treina mais sobe no ranking.",
    placement: "top",
  },
  {
    target: "[data-tour='nav-coach']",
    title: "Coach IA 🧠",
    description: "Converse com nosso treinador virtual. Tire dúvidas sobre treinos, nutrição e recuperação!",
    placement: "top",
  },
];

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
  const [profileLoading, setProfileLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [aiSuggestion, setAiSuggestion] = useState<{ title: string; description: string; exercises: any[] } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [weekDays, setWeekDays] = useState<{ date: Date; hasTraining: boolean; label: string; trainingId?: string; trainingTitle?: string }[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setProfileLoading(true);
      console.log("[Dashboard] fetchData started for user:", user.id);

      try {
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        let currentProfile = existingProfile;

        if (!currentProfile) {
          const { data: createdProfile, error: createProfileError } = await supabase
            .from("profiles")
            .insert({
              user_id: user.id,
              name: user.user_metadata?.name || user.email?.split("@")[0] || "Atleta",
              email: user.email || null,
            })
            .select("*")
            .single();

          if (createProfileError) throw createProfileError;
          currentProfile = createdProfile;
        }

        if (!isMounted || !currentProfile) return;

        setProfile(currentProfile);

        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 6);

        const [{ count }, { data: scheduled }] = await Promise.all([
          supabase
            .from("completed_trainings")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabase
            .from("scheduled_trainings")
            .select("id, scheduled_date, status, training_title")
            .eq("user_id", user.id)
            .gte("scheduled_date", format(weekStart, "yyyy-MM-dd"))
            .lte("scheduled_date", format(weekEnd, "yyyy-MM-dd")),
        ]);

        if (!isMounted) return;

        setCompletedCount(count || 0);

        const days = Array.from({ length: 7 }, (_, i) => {
          const date = addDays(weekStart, i);
          const match = (scheduled || []).find(
            (s: any) => isSameDay(new Date(s.scheduled_date + "T12:00:00"), date)
          );
          return {
            date,
            hasTraining: !!match,
            label: format(date, "EEE", { locale: ptBR }).slice(0, 3),
            trainingId: match?.id,
            trainingTitle: match?.training_title,
          };
        });
        setWeekDays(days);

        const cacheKey = `daily_suggestion_${new Date().toDateString()}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            setAiSuggestion(JSON.parse(cached));
            return;
          } catch {
            localStorage.removeItem(cacheKey);
          }
        }

        setAiLoading(true);
        try {
          const result = await callAI(
            [{ role: "user", content: "Sugira o melhor treino para hoje." }],
            "daily-suggestion",
            {
              position: currentProfile.position,
              level: currentProfile.level,
              trainingsThisWeek: currentProfile.trainings_this_week,
              physicalLevel: currentProfile.physical_level,
              totalTrainings: currentProfile.total_trainings,
            }
          );

          if (!isMounted) return;

          const parsed = JSON.parse(result);
          setAiSuggestion(parsed);
          localStorage.setItem(cacheKey, JSON.stringify(parsed));
        } catch (error) {
          console.error("Error generating daily suggestion:", error);
        } finally {
          if (isMounted) setAiLoading(false);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
        if (isMounted) {
          setProfile(null);
          toast.error("Não foi possível carregar seu painel.");
        }
      } finally {
        if (isMounted) setProfileLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading, navigate]);

  if (authLoading || profileLoading) return <DashboardSkeleton />;
  if (!profile) return <DashboardErrorState />;

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

  const removeScheduledTraining = async (trainingId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("scheduled_trainings")
      .delete()
      .eq("id", trainingId)
      .eq("user_id", user.id);
    if (error) {
      toast.error("Erro ao remover treino");
      return;
    }
    setWeekDays((prev) =>
      prev.map((d) =>
        d.trainingId === trainingId
          ? { ...d, hasTraining: false, trainingId: undefined, trainingTitle: undefined }
          : d
      )
    );
    toast.success("Treino removido com sucesso!");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20 page-enter">
      <div className="gradient-header relative overflow-hidden px-4 pt-6 pb-10">
        <div className="gradient-header-accent absolute inset-0 pointer-events-none" />
        <div className="relative flex items-center gap-3 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl border border-primary/30 shadow-lg shadow-primary/10">
            ⚽
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-xl font-extrabold text-foreground tracking-tight">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.position} • {profile.age} anos</p>
          </div>
          <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", levelColors[profile.level] || levelColors.Iniciante)}>
            {profile.level === "Estrela" && "⭐ "}{profile.level}
          </span>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-4 max-w-md mx-auto">
        {/* AI Training Suggestion */}
        <div className="gradient-card rounded-2xl p-5 border border-border/30 animate-slide-up card-hover shadow-lg shadow-black/20" data-tour="ai-training" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="icon-container">
              {aiLoading ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <Brain className="w-5 h-5 text-primary" />}
            </div>
            <h3 className="font-heading text-base font-extrabold tracking-tight">
              {aiSuggestion ? "Treino sugerido pela IA" : "Treino de hoje"}
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
            className="w-full h-12 font-heading font-extrabold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            <Flame className="w-5 h-5 mr-2" />
            Iniciar aquecimento
          </Button>
        </div>

        {/* Week Summary */}
        {weekDays.length > 0 && (
          <div className="gradient-card rounded-2xl p-4 border border-border/20 animate-slide-up card-hover" data-tour="week-calendar" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="icon-container-accent">
                <CalendarDays className="w-4 h-4 text-accent" />
              </div>
              <h3 className="section-title">Semana</h3>
            </div>
            <div className="flex justify-between">
              {weekDays.map(({ date, hasTraining, label, trainingId, trainingTitle }, i) => {
                const isToday = isSameDay(date, new Date());
                const dayContent = (
                  <div className="flex flex-col items-center gap-1">
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
                  </div>
                );

                if (!hasTraining) {
                  return (
                    <button key={i} onClick={() => navigate("/calendario")} className="flex flex-col items-center gap-1">
                      {dayContent}
                    </button>
                  );
                }

                return (
                  <Popover key={i}>
                    <PopoverTrigger asChild>
                      <button className="flex flex-col items-center gap-1">
                        {dayContent}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-44 p-2" side="top" align="center">
                      {trainingTitle && (
                        <p className="text-xs font-medium text-foreground mb-2 px-1 truncate">{trainingTitle}</p>
                      )}
                      <button
                        onClick={() => navigate("/calendario")}
                        className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        <span>Ver treino</span>
                      </button>
                      <button
                        onClick={() => trainingId && removeScheduledTraining(trainingId)}
                        className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remover treino</span>
                      </button>
                    </PopoverContent>
                  </Popover>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3" data-tour="stats">
          {[
            { icon: Activity, label: "Treinos semana", value: `${profile.trainings_this_week}/5`, color: "text-primary", containerClass: "icon-container" },
            { icon: Shield, label: "Nível físico", value: `${profile.physical_level}%`, color: "text-accent", containerClass: "icon-container-accent" },
            { icon: Timer, label: "Treinos total", value: `${completedCount}`, color: "text-primary", containerClass: "icon-container" },
          ].map(({ icon: Icon, label, value, color, containerClass }, i) => (
            <div
              key={label}
              className="gradient-card rounded-2xl p-3 border border-border/20 text-center animate-slide-up card-hover"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className={cn(containerClass, "w-8 h-8 rounded-lg mx-auto mb-2")}>
                <Icon className={cn("w-4 h-4", color)} />
              </div>
              <p className="text-lg font-heading font-extrabold">{value}</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="gradient-card rounded-2xl p-4 border border-border/20 animate-slide-up card-hover" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="icon-container-gold">
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            <h3 className="section-title">Evolução — 30 dias</h3>
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
      <OnboardingTour steps={tourSteps} storageKey="dashboard-tour-seen" />
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

const DashboardErrorState = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="max-w-sm w-full text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto text-2xl">
        ⚠️
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-heading font-bold text-foreground">Não foi possível carregar seu painel</h2>
        <p className="text-sm text-muted-foreground">Tente recarregar a página. Se o problema continuar, entre novamente na sua conta.</p>
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={() => window.location.reload()} className="w-full">Recarregar</Button>
        <Button variant="outline" onClick={() => window.location.assign("/login")} className="w-full">Ir para login</Button>
      </div>
    </div>
  </div>
);

export default Dashboard;
