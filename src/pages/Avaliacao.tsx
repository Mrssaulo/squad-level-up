import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAthlete, saveAthlete, type Assessment } from "@/lib/storage";
import { getPositionRecommendation } from "@/lib/trainings";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Activity, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const categoryColors = {
  Elite: "text-primary bg-primary/20 border-primary/30",
  Bom: "text-highlight bg-highlight/20 border-highlight/30",
  Desenvolver: "text-destructive bg-destructive/20 border-destructive/30",
};

function calculateIMC(weight: number, height: number) {
  return weight / (height * height);
}

function determineCategory(imc: number, fat: number, run12: number): Assessment["category"] {
  let score = 0;
  if (imc >= 20 && imc <= 24) score += 2;
  else if (imc >= 18.5 && imc <= 27) score += 1;
  if (fat < 12) score += 2;
  else if (fat < 18) score += 1;
  if (run12 >= 2800) score += 2;
  else if (run12 >= 2400) score += 1;
  if (score >= 5) return "Elite";
  if (score >= 3) return "Bom";
  return "Desenvolver";
}

const Avaliacao = () => {
  const navigate = useNavigate();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [fat, setFat] = useState("");
  const [run12, setRun12] = useState("");
  const [sprint30, setSprint30] = useState("");
  const [result, setResult] = useState<{ imc: number; category: Assessment["category"]; recommendation: string } | null>(null);
  const [position, setPosition] = useState("");

  useEffect(() => {
    const athlete = getAthlete();
    if (!athlete) { navigate("/"); return; }
    setPosition(athlete.position);
  }, [navigate]);

  const handleCalculate = () => {
    if (!weight || !height || !fat || !run12 || !sprint30) {
      toast.error("Preencha todos os campos!");
      return;
    }
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const f = parseFloat(fat);
    const r = parseFloat(run12);
    const imc = calculateIMC(w, h);
    const category = determineCategory(imc, f, r);
    const recommendation = getPositionRecommendation(position, category);
    setResult({ imc, category, recommendation });
  };

  const handleSave = () => {
    if (!result) return;
    const athlete = getAthlete();
    if (!athlete) return;
    const assessment: Assessment = {
      date: new Date().toISOString(),
      imc: result.imc,
      fatPercentage: parseFloat(fat),
      run12min: parseFloat(run12),
      sprint30m: parseFloat(sprint30),
      category: result.category,
    };
    athlete.assessments = [...(athlete.assessments || []), assessment];
    saveAthlete(athlete);
    toast.success("Avaliação salva com sucesso!");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-6 max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-6 animate-fade-in">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="font-heading text-xl font-bold">Check-up do Atleta</h1>
        </div>

        {/* IMC Calculator */}
        <div className="gradient-card rounded-xl p-5 border border-border/20 mb-4 animate-slide-up">
          <h2 className="font-heading text-base font-bold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-highlight" />
            Calculadora IMC
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Peso (kg)" value={weight} onChange={setWeight} placeholder="75" />
            <Field label="Altura (m)" value={height} onChange={setHeight} placeholder="1.78" />
          </div>
        </div>

        {/* Extra fields */}
        <div className="gradient-card rounded-xl p-5 border border-border/20 mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-heading text-base font-bold mb-4">Avaliação Completa</h2>
          <div className="space-y-3">
            <Field label="% Gordura Corporal" value={fat} onChange={setFat} placeholder="12" />
            <Field label="Corrida 12min (metros)" value={run12} onChange={setRun12} placeholder="2800" />
            <Field label="Sprint 30m (segundos)" value={sprint30} onChange={setSprint30} placeholder="4.2" />
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          className="w-full h-12 font-heading font-bold bg-primary hover:bg-primary/90 mb-4 transition-all hover:scale-[1.02] active:scale-[0.98] animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          Calcular avaliação
        </Button>

        {/* Result */}
        {result && (
          <div className="animate-scale-in space-y-4">
            <div className={cn("rounded-xl p-5 border text-center", categoryColors[result.category])}>
              <p className="text-sm font-medium mb-1">Categoria</p>
              <p className="text-3xl font-heading font-extrabold">{result.category}</p>
              <p className="text-sm mt-2">IMC: {result.imc.toFixed(1)}</p>
            </div>

            <div className="gradient-card rounded-xl p-5 border border-border/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Recomendação para {position}</p>
              <p className="text-sm font-medium text-foreground">{result.recommendation}</p>
            </div>

            <Button
              onClick={handleSave}
              className="w-full h-12 font-heading font-bold bg-highlight hover:bg-highlight/90 transition-all hover:scale-[1.02]"
            >
              💾 Salvar evolução
            </Button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
    <Input
      type="number"
      step="any"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-muted/50 border-border/50 h-11"
    />
  </div>
);

export default Avaliacao;
