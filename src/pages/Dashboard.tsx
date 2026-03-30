import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAthlete, saveAthlete, calculateLevel, type Athlete } from "@/lib/storage";
import BottomNav from "@/components/BottomNav";
import { Activity, Timer, Shield, Trophy, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

const levelColors = {
  Iniciante: "bg-muted text-muted-foreground",
  Titular: "bg-primary/20 text-primary",
  Estrela: "bg-highlight/20 text-highlight",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState<Athlete | null>(null);

  useEffect(() => {
    const data = getAthlete();
    if (!data) { navigate("/"); return; }
    setAthlete(data);
  }, [navigate]);

  if (!athlete) return <DashboardSkeleton />;

  const chartData = athlete.evolutionData.map((val, i) => ({ day: i + 1, score: val }));

  const handleStartTraining = () => {
    const updated = {
      ...athlete,
      trainingsThisWeek: Math.min(athlete.trainingsThisWeek + 1, 5),
      totalTrainings: athlete.totalTrainings + 1,
      physicalLevel: Math.min(athlete.physicalLevel + 1, 100),
    };
    updated.level = calculateLevel(updated.totalTrainings);
    updated.evolutionData = [...updated.evolutionData.slice(1), updated.physicalLevel];
    saveAthlete(updated);
    setAthlete(updated);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-field px-4 pt-6 pb-8">
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl border-2 border-primary/50">
            ⚽
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-lg font-bold text-foreground">{athlete.name}</h2>
            <p className="text-sm text-muted-foreground">{athlete.position} • {athlete.age} anos</p>
          </div>
          <span className={cn("px-3 py-1 rounded-full text-xs font-bold", levelColors[athlete.level])}>
            {athlete.level === "Estrela" && "⭐ "}{athlete.level}
          </span>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4 max-w-md mx-auto">
        {/* Treino do dia */}
        <div className="gradient-card rounded-xl p-5 border border-border/30 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-highlight" />
            <h3 className="font-heading text-base font-bold">Treino de hoje</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Força e resistência — {athlete.position === "Goleiro" ? "reflexos e explosão" : "condicionamento e potência"}
          </p>
          <Button
            onClick={handleStartTraining}
            className="w-full h-12 font-heading font-bold bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            🔥 Iniciar aquecimento
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Activity, label: "Treinos semana", value: `${athlete.trainingsThisWeek}/5`, color: "text-primary" },
            { icon: Shield, label: "Nível físico", value: `${athlete.physicalLevel}%`, color: "text-highlight" },
            { icon: Timer, label: "Dias até jogo", value: `${athlete.daysUntilGame}`, color: "text-primary" },
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

        {/* Gráfico evolução */}
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
