import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Play, Pencil, Trash2, X, Plus, Minus, CalendarDays } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Exercise { name: string; sets: number; reps: number; rest: string; instruction?: string; }
interface ScheduledTraining { id: string; scheduled_date: string; training_title: string; training_description: string; exercises_data: Exercise[]; status: string; }

const Calendario = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [trainings, setTrainings] = useState<ScheduledTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTraining, setEditingTraining] = useState<ScheduledTraining | null>(null);
  const [editExercises, setEditExercises] = useState<Exercise[]>([]);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    fetchTrainings();
  }, [user, authLoading, navigate]);

  const fetchTrainings = async () => {
    if (!user) return;
    const { data, error } = await supabase.from("scheduled_trainings").select("*").eq("user_id", user.id).order("scheduled_date", { ascending: true });
    if (!error && data) setTrainings(data.map((d: any) => ({ ...d, exercises_data: d.exercises_data as Exercise[] })));
    setLoading(false);
  };

  const datesWithTrainings = trainings.filter((t) => t.status === "pending").map((t) => new Date(t.scheduled_date + "T12:00:00"));
  const selectedDayTrainings = trainings.filter((t) => selectedDate && isSameDay(new Date(t.scheduled_date + "T12:00:00"), selectedDate));

  const handleStartTraining = (training: ScheduledTraining) => {
    navigate("/active-training", { state: { training: { title: training.training_title, description: training.training_description, exercises: training.exercises_data }, position: "", scheduledId: training.id } });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("scheduled_trainings").delete().eq("id", id);
    if (error) toast.error("Erro ao remover treino");
    else { toast.success("Treino removido."); setTrainings((prev) => prev.filter((t) => t.id !== id)); }
  };

  const openEdit = (training: ScheduledTraining) => {
    setEditingTraining(training); setEditTitle(training.training_title); setEditExercises(JSON.parse(JSON.stringify(training.exercises_data)));
  };

  const saveEdit = async () => {
    if (!editingTraining) return;
    const { error } = await supabase.from("scheduled_trainings").update({ training_title: editTitle, exercises_data: editExercises as any }).eq("id", editingTraining.id);
    if (error) toast.error("Erro ao salvar alterações");
    else { toast.success("Treino atualizado."); setEditingTraining(null); fetchTrainings(); }
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    setEditExercises((prev) => prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex)));
  };
  const removeExercise = (index: number) => { setEditExercises((prev) => prev.filter((_, i) => i !== index)); };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center pb-20"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20 page-enter">
      <div className="relative overflow-hidden px-4 pt-6 pb-5">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-2 to-background" />
        <div className="relative max-w-md mx-auto animate-fade-in">
          <h1 className="page-title text-foreground mb-1">Calendário de treinos</h1>
          <p className="text-xs text-muted-foreground">Visualize sua rotina, mantenha constância e organize sua preparação.</p>
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto">
        <div className="premium-card rounded-2xl p-3 mb-4 animate-slide-up">
          <Calendar
            mode="single" selected={selectedDate} onSelect={setSelectedDate} locale={ptBR}
            className={cn("p-3 pointer-events-auto w-full")}
            modifiers={{ hasTraining: datesWithTrainings }}
            modifiersClassNames={{ hasTraining: "bg-primary/15 text-primary font-bold rounded-full" }}
          />
        </div>

        {selectedDate && (
          <div className="animate-fade-in">
            <h2 className="font-heading text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wider">
              {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </h2>

            {selectedDayTrainings.length === 0 ? (
              <div className="text-center py-10 animate-fade-in">
                <CalendarDays className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground mb-1">Nenhum treino neste dia</p>
                <p className="text-xs text-muted-foreground/60">Sua semana ainda não foi organizada. Monte sua rotina no plano semanal.</p>
                <Button size="sm" variant="outline" className="mt-4 font-semibold" onClick={() => navigate("/personal")}>
                  Montar plano semanal
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayTrainings.map((training) => (
                  <div key={training.id} className="premium-card rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-sm font-bold truncate">{training.training_title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{training.exercises_data.length} exercícios</p>
                      </div>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                        training.status === "completed" ? "bg-primary/15 text-primary" : "bg-highlight/15 text-highlight"
                      )}>
                        {training.status === "completed" ? "Concluído" : "Pendente"}
                      </span>
                    </div>

                    <div className="space-y-1 mb-3">
                      {training.exercises_data.slice(0, 3).map((ex, i) => (
                        <div key={i} className="flex justify-between text-xs bg-surface-2 rounded-lg px-3 py-1.5">
                          <span className="text-foreground font-medium">{ex.name}</span>
                          <span className="text-muted-foreground">{ex.sets}x{ex.reps}</span>
                        </div>
                      ))}
                      {training.exercises_data.length > 3 && <p className="text-[10px] text-muted-foreground text-center">+{training.exercises_data.length - 3} exercícios</p>}
                    </div>

                    {training.status !== "completed" && (
                      <div className="flex gap-2">
                        <Button onClick={() => handleStartTraining(training)} size="sm" className="flex-1 h-9 text-xs font-bold">
                          <Play className="w-3.5 h-3.5 mr-1" /> Iniciar
                        </Button>
                        <Button onClick={() => openEdit(training)} size="sm" variant="outline" className="h-9 w-9 p-0"><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button onClick={() => handleDelete(training.id)} size="sm" variant="outline" className="h-9 w-9 p-0 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTraining} onOpenChange={(open) => !open && setEditingTraining(null)}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading text-base">Editar treino</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Nome do treino</label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="h-10 text-sm" />
            </div>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Exercícios</p>
              {editExercises.map((ex, i) => (
                <div key={i} className="p-3 bg-surface-2 rounded-lg space-y-2 relative">
                  <button onClick={() => removeExercise(i)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><X className="w-3.5 h-3.5" /></button>
                  <Input value={ex.name} onChange={(e) => updateExercise(i, "name", e.target.value)} placeholder="Nome" className="h-8 text-xs" />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] text-muted-foreground">Séries</label>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateExercise(i, "sets", Math.max(1, ex.sets - 1))} className="w-6 h-6 rounded bg-surface-3 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm font-bold w-6 text-center">{ex.sets}</span>
                        <button onClick={() => updateExercise(i, "sets", ex.sets + 1)} className="w-6 h-6 rounded bg-surface-3 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] text-muted-foreground">Reps</label>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateExercise(i, "reps", Math.max(1, ex.reps - 1))} className="w-6 h-6 rounded bg-surface-3 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm font-bold w-6 text-center">{ex.reps}</span>
                        <button onClick={() => updateExercise(i, "reps", ex.reps + 1)} className="w-6 h-6 rounded bg-surface-3 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] text-muted-foreground">Descanso</label>
                      <Input value={ex.rest} onChange={(e) => updateExercise(i, "rest", e.target.value)} className="h-6 text-[10px] px-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={saveEdit} className="w-full h-10 font-heading font-bold">Salvar alterações</Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Calendario;
