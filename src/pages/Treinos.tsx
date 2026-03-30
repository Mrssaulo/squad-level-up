import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trainings, type Training } from "@/lib/trainings";
import { getAthlete, saveAthlete } from "@/lib/storage";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Check } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("Todos");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [plan, setPlan] = useState<string[]>([]);

  useEffect(() => {
    const athlete = getAthlete();
    if (!athlete) { navigate("/"); return; }
    setPlan(athlete.plan || []);
  }, [navigate]);

  const filtered = trainings.filter((t) => {
    const matchCategory = filter === "Todos" || t.category === filter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const addToPlan = (training: Training) => {
    const athlete = getAthlete();
    if (!athlete) return;
    if (athlete.plan.includes(training.id)) {
      toast.info("Treino já está no plano!");
      return;
    }
    athlete.plan = [...athlete.plan, training.id];
    saveAthlete(athlete);
    setPlan(athlete.plan);
    toast.success(`"${training.title}" adicionado ao plano!`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-6 max-w-md mx-auto">
        <h1 className="font-heading text-xl font-bold mb-4 animate-fade-in">Biblioteca de Treinos</h1>

        {/* Search */}
        <div className="relative mb-4 animate-fade-in">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar treino..."
            className="pl-9 bg-muted/50 border-border/50 h-11"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide animate-fade-in">
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

        {/* Training list */}
        <div className="space-y-3">
          {filtered.map((training, i) => {
            const isExpanded = expanded === training.id;
            const inPlan = plan.includes(training.id);
            return (
              <div
                key={training.id}
                className="gradient-card rounded-xl border border-border/20 overflow-hidden transition-all duration-300 animate-slide-up cursor-pointer"
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
                    <p className="text-sm text-muted-foreground mb-3">{training.description}</p>
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
      </div>
      <BottomNav />
    </div>
  );
};

export default Treinos;
