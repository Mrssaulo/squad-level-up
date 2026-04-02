import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { callAI } from "@/lib/ai";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, Dumbbell, CalendarPlus, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const positions = ["Goleiro", "Zagueiro", "Lateral", "Volante", "Meia", "Atacante"];
const objectives = ["Ganhar força", "Melhorar resistência", "Aumentar velocidade", "Perder gordura", "Prevenir lesões"];
const levels = ["Iniciante", "Intermediário", "Avançado"];

interface Exercise { name: string; sets: number; reps: number; rest: string; instruction?: string; }
interface DayPlan { day: string; exercises: Exercise[]; }

const PersonalTrainer = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [position, setPosition] = useState("");
  const [objective, setObjective] = useState("");
  const [level, setLevel] = useState("");
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [rawPlan, setRawPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [scheduledDays, setScheduledDays] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    supabase.from("profiles").select("position, level, objective").eq("user_id", user.id).single()
      .then(({ data }) => { if (data) { setPosition(data.position || "Meia"); setLevel(data.level || "Iniciante"); if (data.objective) setObjective(data.objective); } });
  }, [user, authLoading, navigate]);

  const generatePlan = async () => {
    if (!position || !objective || !level) { toast.error("Preencha todos os campos!"); return; }
    setLoading(true); setPlan([]); setRawPlan(""); setScheduledDays(new Set());
    try {
      const result = await callAI(
        [{ role: "user", content: `Monte um plano de treino semanal completo para mim. Responda em formato JSON com a estrutura: { "days": [{ "day": "Segunda", "exercises": [{ "name": "...", "sets": 3, "reps": 12, "rest": "60s", "instruction": "..." }] }] }. Apenas JSON, sem texto adicional.` }],
        "training-plan", { position, objective, level }
      );
      try {
        const cleanResult = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleanResult);
        if (parsed.days && Array.isArray(parsed.days)) setPlan(parsed.days);
        else setRawPlan(result);
      } catch { setRawPlan(result); }
    } catch (e: any) { toast.error(e.message || "Erro ao gerar plano"); }
    finally { setLoading(false); }
  };

  const handleSchedule = async (dayPlan: DayPlan, date: Date) => {
    if (!user) return;
    const dateStr = format(date, "yyyy-MM-dd");
    const { error } = await supabase.from("scheduled_trainings").insert([{
      user_id: user.id, scheduled_date: dateStr,
      training_title: `${dayPlan.day} — ${position}`, training_description: `${objective} · ${level}`,
      exercises_data: dayPlan.exercises as any,
    }]);
    if (error) toast.error("Erro ao agendar treino");
    else { toast.success(`Treino agendado para ${format(date, "dd/MM")}`); setScheduledDays((prev) => new Set([...prev, dayPlan.day])); }
  };

  return (
    <div className="min-h-screen bg-background pb-20 page-enter">
      <div className="relative overflow-hidden px-4 pt-6 pb-5">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-2 to-background" />
        <div className="relative max-w-md mx-auto animate-fade-in">
          <h1 className="page-title text-foreground mb-1">Plano semanal orientado</h1>
          <p className="text-xs text-muted-foreground">Monte uma rotina mais coerente com sua posição, objetivo e nível atual.</p>
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto">
        {plan.length === 0 && !rawPlan && (
          <div className="space-y-3 animate-slide-up">
            <ChipSelector label="Posição" options={positions} selected={position} onSelect={setPosition} />
            <ChipSelector label="Objetivo" options={objectives} selected={objective} onSelect={setObjective} />
            <ChipSelector label="Nível" options={levels} selected={level} onSelect={setLevel} />
            <Button onClick={generatePlan} disabled={loading} className="w-full h-12 font-heading font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
              {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Gerando plano...</> : "Gerar plano semanal"}
            </Button>
          </div>
        )}

        {rawPlan && (
          <div className="animate-scale-in space-y-4">
            <div className="premium-card rounded-2xl p-5">
              <p className="section-title text-primary mb-2">Foco da semana</p>
              <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{rawPlan}</div>
            </div>
            <Button onClick={() => { setRawPlan(""); setPlan([]); }} variant="outline" className="w-full h-11 font-heading font-bold">
              <Dumbbell className="w-4 h-4 mr-2" /> Gerar novo plano
            </Button>
          </div>
        )}

        {plan.length > 0 && (
          <div className="animate-scale-in space-y-4">
            <div className="flex flex-wrap gap-2 mb-1">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">{position}</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-highlight/15 text-highlight font-semibold">{objective}</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface-3 text-muted-foreground font-semibold">{level}</span>
            </div>

            {plan.map((dayPlan, di) => (
              <div key={di} className="premium-card rounded-2xl p-4 animate-slide-up" style={{ animationDelay: `${di * 0.05}s` }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading text-sm font-bold">{dayPlan.day}</h3>
                  {scheduledDays.has(dayPlan.day) ? (
                    <span className="flex items-center gap-1 text-primary text-[10px] font-bold"><Check className="w-3.5 h-3.5" /> Agendado</span>
                  ) : (
                    <SchedulePopover dayPlan={dayPlan} onSchedule={handleSchedule} />
                  )}
                </div>
                <div className="space-y-1.5">
                  {dayPlan.exercises.map((ex, ei) => (
                    <div key={ei} className="flex items-center justify-between text-xs bg-surface-2 rounded-lg px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <span className="text-foreground font-medium block truncate">{ex.name}</span>
                        {ex.instruction && <span className="text-[10px] text-muted-foreground block truncate">{ex.instruction}</span>}
                      </div>
                      <span className="text-muted-foreground ml-2 shrink-0">{ex.sets}x{ex.reps} · {ex.rest}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Button onClick={() => { setPlan([]); setRawPlan(""); setScheduledDays(new Set()); }} variant="outline" className="w-full h-11 font-heading font-bold">
              <Dumbbell className="w-4 h-4 mr-2" /> Gerar novo plano
            </Button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

const SchedulePopover = ({ dayPlan, onSchedule }: { dayPlan: DayPlan; onSchedule: (d: DayPlan, date: Date) => void }) => {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 text-primary text-[10px] font-bold hover:text-primary/80 transition-colors">
          <CalendarPlus className="w-3.5 h-3.5" /> Agendar
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar mode="single" selected={date} onSelect={(d) => { if (d) { setDate(d); onSchedule(dayPlan, d); } }} locale={ptBR} disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} className={cn("p-3 pointer-events-auto")} />
      </PopoverContent>
    </Popover>
  );
};

const ChipSelector = ({ label, options, selected, onSelect }: { label: string; options: string[]; selected: string; onSelect: (v: string) => void }) => (
  <div className="premium-card rounded-2xl p-4">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">{label}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button key={opt} onClick={() => onSelect(opt)} className={cn(
          "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
          selected === opt ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground hover:bg-surface-3"
        )}>{opt}</button>
      ))}
    </div>
  </div>
);

export default PersonalTrainer;
