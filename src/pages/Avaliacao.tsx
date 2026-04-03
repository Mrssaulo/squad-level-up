import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/backend";
import { getDetailedAssessment } from "@/lib/trainings";
import { callAI } from "@/lib/ai";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Activity, Shield, TrendingUp, TrendingDown, Zap, CheckCircle, Brain, Loader2, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const categoryColors: Record<string, string> = {
  Elite: "text-primary bg-primary/10 border-primary/20",
  Bom: "text-highlight bg-highlight/10 border-highlight/20",
  Desenvolver: "text-destructive bg-destructive/10 border-destructive/20",
};

const conditioningColors: Record<string, string> = {
  Excelente: "text-primary",
  Bom: "text-highlight",
  Regular: "text-accent",
  Baixo: "text-destructive",
};

function calculateIMC(weight: number, height: number) { return weight / (height * height); }

type Category = "Elite" | "Bom" | "Desenvolver";

function determineCategory(imc: number, fat: number, run12: number): Category {
  let score = 0;
  if (imc >= 20 && imc <= 24) score += 2; else if (imc >= 18.5 && imc <= 27) score += 1;
  if (fat < 12) score += 2; else if (fat < 18) score += 1;
  if (run12 >= 2800) score += 2; else if (run12 >= 2400) score += 1;
  if (score >= 5) return "Elite"; if (score >= 3) return "Bom"; return "Desenvolver";
}

const Avaliacao = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [weight, setWeight] = useState(""); const [height, setHeight] = useState("");
  const [fat, setFat] = useState(""); const [run12, setRun12] = useState(""); const [sprint30, setSprint30] = useState("");
  const [result, setResult] = useState<{ imc: number; category: Category; conditioningLevel: string; strengths: string[]; improvements: string[]; recommendation: string; } | null>(null);
  const [position, setPosition] = useState(""); const [aiAnalysis, setAiAnalysis] = useState(""); const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return; if (!user) { navigate("/login"); return; }
    supabase.from("profiles").select("position").eq("user_id", user.id).single().then(({ data }) => { if (data) setPosition(data.position); });
  }, [user, authLoading, navigate]);

  const handleCalculate = () => {
    if (!weight || !height || !fat || !run12 || !sprint30) { toast.error("Preencha todos os campos."); return; }
    const w = parseFloat(weight); const h = parseFloat(height); const f = parseFloat(fat); const r = parseFloat(run12);
    const imc = calculateIMC(w, h); const category = determineCategory(imc, f, r);
    const detailed = getDetailedAssessment(position, category, imc, f, r);
    setResult({ imc, category, ...detailed }); setAiAnalysis("");
  };

  const handleAIAnalysis = async () => {
    if (!result) return; setAiLoading(true);
    try {
      const analysis = await callAI([{ role: "user", content: "Analise minha avaliação física e me dê um diagnóstico completo." }], "assessment-analysis", { position, imc: result.imc, category: result.category, conditioningLevel: result.conditioningLevel, fatPercentage: parseFloat(fat), run12min: parseFloat(run12), sprint30m: parseFloat(sprint30) });
      setAiAnalysis(analysis);
    } catch (e: any) { toast.error(e.message || "Erro na análise"); } finally { setAiLoading(false); }
  };

  const handleSave = async () => {
    if (!result || !user) return;
    const { error } = await supabase.from("assessments").insert({ user_id: user.id, imc: result.imc, fat_percentage: parseFloat(fat), run_12min: parseFloat(run12), sprint_30m: parseFloat(sprint30), category: result.category });
    if (error) { toast.error("Erro ao salvar avaliação"); return; }
    toast.success("Avaliação salva.");
  };

  const conditioningPercent = result ? result.conditioningLevel === "Excelente" ? 95 : result.conditioningLevel === "Bom" ? 70 : result.conditioningLevel === "Regular" ? 45 : 25 : 0;

  const [isDark, setIsDark] = useState(() => !document.documentElement.classList.contains("light"));
  const toggleTheme = () => {
    const next = !isDark; setIsDark(next);
    if (next) { document.documentElement.classList.remove("light"); localStorage.setItem("theme", "dark"); }
    else { document.documentElement.classList.add("light"); localStorage.setItem("theme", "light"); }
  };

  return (
    <div className="min-h-screen bg-background pb-20 page-enter">
      <div className="relative overflow-hidden px-4 pt-6 pb-5">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-2 to-background" />
        <div className="relative max-w-md mx-auto">
          <div className="flex items-center justify-between mb-1 animate-fade-in">
            <div>
              <h1 className="page-title text-foreground mb-1">Leitura do seu momento</h1>
              <p className="text-xs text-muted-foreground">Avalie seus indicadores e acompanhe sua evolução com dados reais.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Sun className="w-3.5 h-3.5 text-muted-foreground" />
              <Switch checked={isDark} onCheckedChange={toggleTheme} />
              <Moon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto">
        <div className="premium-card rounded-2xl p-5 mb-4 animate-slide-up">
          <h2 className="font-heading text-sm font-bold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Composição corporal
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Peso (kg)" value={weight} onChange={setWeight} placeholder="75" />
            <Field label="Altura (m)" value={height} onChange={setHeight} placeholder="1.78" />
          </div>
        </div>

        <div className="premium-card rounded-2xl p-5 mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-heading text-sm font-bold mb-4">Indicadores de desempenho</h2>
          <div className="space-y-3">
            <Field label="% Gordura corporal" value={fat} onChange={setFat} placeholder="12" />
            <Field label="Corrida 12min (metros)" value={run12} onChange={setRun12} placeholder="2800" />
            <Field label="Sprint 30m (segundos)" value={sprint30} onChange={setSprint30} placeholder="4.2" />
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full h-12 font-heading font-bold mb-4 transition-all hover:scale-[1.02] active:scale-[0.98] animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Calcular avaliação
        </Button>

        {result && (
          <div className="animate-scale-in space-y-4">
            <div className={cn("rounded-2xl p-5 border text-center", categoryColors[result.category])}>
              <p className="text-sm font-medium mb-1">Categoria</p>
              <p className="text-3xl font-heading font-extrabold">{result.category}</p>
              <p className="text-sm mt-2">IMC: {result.imc.toFixed(1)}</p>
            </div>

            <div className="premium-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-accent" /><p className="text-xs text-muted-foreground uppercase tracking-wider">Condicionamento</p></div>
                <span className={cn("font-heading font-bold text-lg", conditioningColors[result.conditioningLevel])}>{result.conditioningLevel}</span>
              </div>
              <Progress value={conditioningPercent} className="h-2.5" />
            </div>

            <div className="premium-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4 text-primary" /><p className="text-xs text-muted-foreground uppercase tracking-wider">Pontos fortes</p></div>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (<li key={i} className="flex items-start gap-2 text-sm text-foreground"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />{s}</li>))}
              </ul>
            </div>

            {result.improvements.length > 0 && (
              <div className="premium-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3"><TrendingDown className="w-4 h-4 text-destructive" /><p className="text-xs text-muted-foreground uppercase tracking-wider">Pontos a desenvolver</p></div>
                <ul className="space-y-2">
                  {result.improvements.map((s, i) => (<li key={i} className="flex items-start gap-2 text-sm text-foreground"><span className="w-4 h-4 rounded-full bg-destructive/15 flex items-center justify-center text-destructive text-[10px] mt-0.5 shrink-0">!</span>{s}</li>))}
                </ul>
              </div>
            )}

            <div className="premium-card rounded-2xl p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Recomendação para {position}</p>
              <p className="text-sm font-medium text-foreground">{result.recommendation}</p>
            </div>

            {!aiAnalysis && (
              <Button onClick={handleAIAnalysis} disabled={aiLoading} className="w-full h-12 font-heading font-bold bg-accent hover:bg-accent/90 transition-all hover:scale-[1.02]">
                {aiLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analisando...</> : <><Brain className="w-5 h-5 mr-2" /> Diagnóstico detalhado</>}
              </Button>
            )}

            {aiAnalysis && (
              <div className="premium-card rounded-2xl p-5 animate-scale-in">
                <div className="flex items-center gap-2 mb-3"><Brain className="w-4 h-4 text-accent" /><p className="text-xs text-muted-foreground uppercase tracking-wider">Diagnóstico detalhado</p></div>
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{aiAnalysis}</div>
              </div>
            )}

            <Button onClick={handleSave} className="w-full h-12 font-heading font-bold bg-accent hover:bg-accent/90 transition-all hover:scale-[1.02]">
              Salvar avaliação
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
    <Input type="number" step="any" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="bg-surface-2 border-border/50 h-11" />
  </div>
);

export default Avaliacao;
