import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trainings, positionFilters, spaceLabels, materialLabels, locationLabels, type Training } from "@/lib/trainings";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Check, User, Play, Dumbbell, MapPin, Package, Clock, Maximize, ChevronDown, ChevronUp, Lightbulb, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const categories = ["Todos", "Físico", "Técnico", "Tático", "Recuperação"] as const;

const difficultyColors: Record<string, string> = {
  Fácil: "bg-primary/15 text-primary",
  Médio: "bg-highlight/15 text-highlight",
  Difícil: "bg-destructive/15 text-destructive",
};

const Treinos = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("Todos");
  const [posFilter, setPosFilter] = useState<string>("Todos");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [userPosition, setUserPosition] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    const fetchData = async () => {
      const [{ data: completed }, { data: profile }] = await Promise.all([
        supabase.from("completed_trainings").select("training_id").eq("user_id", user.id),
        supabase.from("profiles").select("position").eq("user_id", user.id).single(),
      ]);
      if (completed) setCompletedIds(completed.map((d) => d.training_id));
      if (profile) { setUserPosition(profile.position); setPosFilter(profile.position); }
    };
    fetchData();
  }, [user, authLoading, navigate]);

  const filtered = trainings.filter((t) => {
    const matchCategory = filter === "Todos" || t.category === filter;
    const matchPosition = posFilter === "Todos" || t.positions.includes(posFilter);
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchPosition && matchSearch;
  });

  const addToPlan = async (training: Training) => {
    if (!user) return;
    if (completedIds.includes(training.id)) { toast.info("Treino já está na sua rotina."); return; }
    const { error } = await supabase.from("completed_trainings").insert({ user_id: user.id, training_id: training.id });
    if (error) { toast.error("Erro ao salvar treino"); return; }
    setCompletedIds([...completedIds, training.id]);
    toast.success(`"${training.title}" adicionado à rotina.`);
  };

  const startTraining = (training: Training) => {
    const trainingData = {
      title: training.title,
      description: training.description,
      exercises: training.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        reps: typeof ex.reps === 'string' && ex.reps.match(/^\d+$/) ? parseInt(ex.reps) : 10,
        rest: ex.rest,
        instruction: ex.instruction,
      })),
    };
    navigate("/active-training", { state: { training: trainingData, position: userPosition } });
  };

  return (
    <div className="min-h-screen bg-background pb-20 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden px-4 pt-6 pb-5">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-2 to-background" />
        <div className="relative max-w-md mx-auto">
          <div className="mb-4 animate-fade-in">
            <h1 className="page-title text-foreground mb-1">Biblioteca de treinos</h1>
            <p className="text-xs text-muted-foreground">Treinos que você executa sozinho, com clareza e autonomia.</p>
          </div>

          <div className="relative mb-4 animate-fade-in">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar treino..." className="pl-9 bg-surface-2 border-border/50 h-11" />
          </div>

          {/* Position filter */}
          <div className="mb-3 animate-fade-in">
            <div className="flex items-center gap-1.5 mb-2">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="section-title">Posição</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
              {positionFilters.map((pos) => (
                <button key={pos} onClick={() => setPosFilter(pos)} className={cn(
                  "px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all",
                  posFilter === pos ? "bg-accent text-accent-foreground" : "bg-surface-2 text-muted-foreground hover:bg-surface-3"
                )}>{pos}</button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide animate-fade-in">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)} className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                filter === cat ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground hover:bg-surface-3"
              )}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto space-y-3 -mt-1">
        {filtered.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <Dumbbell className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
            <p className="text-muted-foreground text-sm mb-1">Nenhum treino encontrado</p>
            <p className="text-muted-foreground/60 text-xs">Ajuste os filtros para encontrar treinos compatíveis com seu perfil.</p>
          </div>
        )}
        {filtered.map((training, i) => {
          const isExpanded = expanded === training.id;
          const inPlan = completedIds.includes(training.id);
          return (
            <div
              key={training.id}
              className="premium-card rounded-2xl overflow-hidden transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Card header - always visible */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : training.id)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{training.thumbnail}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-sm font-bold truncate">{training.title}</h3>
                    <p className="text-[11px] text-muted-foreground">{training.focus}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", difficultyColors[training.difficulty])}>
                      {training.difficulty}
                    </span>
                    {isExpanded
                      ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                      : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    }
                  </div>
                </div>

                {/* Quick info badges */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                    <User className="w-2.5 h-2.5" /> Solo
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-surface-2 text-muted-foreground">
                    <Clock className="w-2.5 h-2.5" /> {training.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-surface-2 text-muted-foreground">
                    <Maximize className="w-2.5 h-2.5" /> {spaceLabels[training.spaceRequired]}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-surface-2 text-muted-foreground">
                    <Package className="w-2.5 h-2.5" /> {training.material.map(m => materialLabels[m]).join(", ")}
                  </span>
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 animate-fade-in border-t border-border/10 pt-3">
                  {/* Objective */}
                  <div className="mb-3">
                    <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-1">Objetivo do treino</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{training.description}</p>
                  </div>

                  {/* Location & Position */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-surface-2 rounded-lg p-2.5">
                      <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> Local ideal</p>
                      <p className="text-xs font-medium text-foreground">{training.locations.map(l => locationLabels[l]).join(" · ")}</p>
                    </div>
                    <div className="bg-surface-2 rounded-lg p-2.5">
                      <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><User className="w-2.5 h-2.5" /> Posições</p>
                      <p className="text-xs font-medium text-foreground">{training.positions.length === 7 ? "Todas" : training.positions.join(", ")}</p>
                    </div>
                  </div>

                  {/* Material */}
                  <div className="bg-surface-2 rounded-lg p-2.5 mb-3">
                    <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><Package className="w-2.5 h-2.5" /> Você vai precisar de</p>
                    <p className="text-xs font-medium text-foreground">
                      {training.material.includes("nenhum") ? "Nada — apenas seu corpo." : training.material.map(m => materialLabels[m]).join(", ")}
                    </p>
                  </div>

                  {/* Exercises list */}
                  <div className="mb-3">
                    <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">Como executar</p>
                    <div className="space-y-2">
                      {training.exercises.map((ex, idx) => (
                        <div key={idx} className="bg-surface-2 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                              <span className="text-xs font-semibold text-foreground">{ex.name}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{ex.sets}x{ex.reps} · {ex.rest === "—" ? "sem descanso" : ex.rest}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed ml-7">{ex.instruction}</p>
                          {ex.adaptation && (
                            <p className="text-[11px] text-accent ml-7 mt-1 flex items-start gap-1">
                              <Wrench className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              {ex.adaptation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Adaptation note */}
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mb-3">
                    <p className="text-[11px] font-semibold text-accent mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> Se estiver com pouco espaço ou material
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{training.adaptationNote}</p>
                  </div>

                  {/* Practical tip */}
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 mb-4">
                    <p className="text-[11px] font-semibold text-primary mb-1">Dica prática</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{training.practicalTip}</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => { e.stopPropagation(); startTraining(training); }}
                      className="flex-1 font-semibold transition-all hover:scale-[1.02]"
                    >
                      <Play className="w-4 h-4 mr-1" /> Iniciar agora
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); addToPlan(training); }}
                      className={cn("flex-1 font-semibold transition-all hover:scale-[1.02]", inPlan ? "bg-muted text-muted-foreground" : "")}
                      disabled={inPlan}
                    >
                      {inPlan ? <><Check className="w-4 h-4 mr-1" /> Na rotina</> : <><Plus className="w-4 h-4 mr-1" /> Adicionar</>}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
};

export default Treinos;
