import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { callAI } from "@/lib/ai";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Brain, Loader2, Dumbbell, Calendar } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const positions = ["Goleiro", "Zagueiro", "Lateral", "Volante", "Meia", "Atacante"];
const objectives = ["Ganhar força", "Melhorar resistência", "Aumentar velocidade", "Perder gordura", "Prevenir lesões"];
const levels = ["Iniciante", "Intermediário", "Avançado"];

const PersonalTrainer = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [position, setPosition] = useState("");
  const [objective, setObjective] = useState("");
  const [level, setLevel] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    supabase.from("profiles").select("position, level, objective").eq("user_id", user.id).single()
      .then(({ data }) => {
        if (data) {
          setPosition(data.position || "Meia");
          setLevel(data.level || "Iniciante");
          if (data.objective) setObjective(data.objective);
        }
      });
  }, [user, authLoading, navigate]);

  const generatePlan = async () => {
    if (!position || !objective || !level) {
      toast.error("Preencha todos os campos!");
      return;
    }
    setLoading(true);
    setPlan("");
    try {
      const result = await callAI(
        [{ role: "user", content: `Monte um plano de treino semanal completo para mim.` }],
        "training-plan",
        { position, objective, level }
      );
      setPlan(result);
    } catch (e: any) {
      toast.error(e.message || "Erro ao gerar plano");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-6 max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-6 animate-fade-in">
          <Brain className="w-6 h-6 text-primary" />
          <h1 className="font-heading text-xl font-bold">Personal Trainer IA</h1>
        </div>

        {!plan && (
          <div className="space-y-4 animate-slide-up">
            <ChipSelector label="Posição" options={positions} selected={position} onSelect={setPosition} />
            <ChipSelector label="Objetivo" options={objectives} selected={objective} onSelect={setObjective} />
            <ChipSelector label="Nível" options={levels} selected={level} onSelect={setLevel} />

            <Button
              onClick={generatePlan}
              disabled={loading}
              className="w-full h-12 font-heading font-bold bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Gerando plano...</> : <>🧠 Gerar plano semanal</>}
            </Button>
          </div>
        )}

        {plan && (
          <div className="animate-scale-in space-y-4">
            <div className="gradient-card rounded-xl p-5 border border-border/20">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-highlight" />
                <h2 className="font-heading text-base font-bold">Seu Plano Semanal</h2>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary">{position}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-highlight/20 text-highlight">{objective}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{level}</span>
              </div>
              <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{plan}</div>
            </div>

            <Button
              onClick={() => setPlan("")}
              variant="outline"
              className="w-full h-11 font-heading font-bold"
            >
              <Dumbbell className="w-4 h-4 mr-2" /> Gerar novo plano
            </Button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

const ChipSelector = ({ label, options, selected, onSelect }: { label: string; options: string[]; selected: string; onSelect: (v: string) => void }) => (
  <div className="gradient-card rounded-xl p-4 border border-border/20">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">{label}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
            selected === opt ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export default PersonalTrainer;
