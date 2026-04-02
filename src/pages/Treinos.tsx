import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trainings, positionFilters, type Training } from "@/lib/trainings";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Check, User, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const categories = ["Todos", "Físico", "Técnico", "Tático", "Recuperação"] as const;

const difficultyColors: Record<string, string> = {
  Fácil: "bg-primary/20 text-primary",
  Médio: "bg-highlight/20 text-highlight",
  Difícil: "bg-destructive/20 text-destructive",
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
      if (profile) {
        setUserPosition(profile.position);
        setPosFilter(profile.position);
      }
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
    if (completedIds.includes(training.id)) {
      toast.info("Treino já está no plano!");
      return;
    }
    const { error } = await supabase.from("completed_trainings").insert({
      user_id: user.id,
      training_id: training.id,
    });
    if (error) {
      toast.error("Erro ao adicionar treino");
      return;
    }
    setCompletedIds([...completedIds, training.id]);
    toast.success(`"${training.title}" adicionado ao plano!`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 page-enter">
      <div className="gradient-header relative overflow-hidden px-4 pt-6 pb-6">
        <div className="gradient-header-accent absolute inset-0 pointer-events-none" />
        <div className="relative max-w-md mx-auto">
          <h1 className="page-title text-foreground mb-4 animate-fade-in">Biblioteca de Treinos</h1>

          <div className="relative mb-4 animate-fade-in">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar treino..."
              className="pl-9 bg-muted/50 border-border/50 h-11"
            />
          </div>

          {/* Position filter */}
          <div className="mb-3 animate-fade-in">
            <div className="flex items-center gap-1.5 mb-2">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="section-title">Posição</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
              {positionFilters.map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPosFilter(pos)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all",
                    posFilter === pos
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide animate-fade-in">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                  filter === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto space-y-3 -mt-2">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">Nenhum treino encontrado para esses filtros.</p>
        )}
        {filtered.map((training, i) => {
          const isExpanded = expanded === training.id;
          const inPlan = completedIds.includes(training.id);
          return (
            <div
              key={training.id}
              className="gradient-card rounded-2xl border border-border/20 overflow-hidden transition-all duration-300 animate-slide-up cursor-pointer card-hover"
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => setExpanded(isExpanded ? null : training.id)}
            >
              <div className="p-4 flex items-center gap-3">
                <span className="text-2xl">{training.thumbnail}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm font-bold truncate">{training.title}</h3>
                  <p className="text-xs text-muted-foreground">{training.duration}</p>
                </div>
                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", difficultyColors[training.difficulty])}>
                  {training.difficulty}
                </span>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 animate-fade-in">
                  {/* Demo media */}
                  {training.demoUrl && (
                    <div className="mb-3 rounded-xl overflow-hidden bg-muted/30 border border-border/10">
                      {training.demoType === "video" ? (
                        <video
                          src={training.demoUrl}
                          controls
                          loop
                          muted
                          playsInline
                          className="w-full aspect-video object-cover"
                        />
                      ) : (
                        <div className="relative">
                          <img
                            src={training.demoUrl}
                            alt={`Demo: ${training.title}`}
                            className="w-full aspect-video object-cover"
                            loading="lazy"
                          />
                          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-0.5">
                            <Play className="w-3 h-3 text-primary fill-primary" />
                            <span className="text-[10px] font-semibold text-foreground">Demonstração</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mb-2">{training.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {training.positions.map((pos) => (
                      <span key={pos} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">{pos}</span>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); addToPlan(training); }}
                    className={cn(
                      "w-full font-semibold transition-all hover:scale-[1.02]",
                      inPlan ? "bg-muted text-muted-foreground" : "bg-primary hover:bg-primary/90"
                    )}
                    disabled={inPlan}
                  >
                    {inPlan ? <><Check className="w-4 h-4 mr-1" /> No plano</> : <><Plus className="w-4 h-4 mr-1" /> Adicionar ao plano</>}
                  </Button>
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
