import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { History, Calendar, MapPin, Dumbbell, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest: string;
}

interface TrainingSession {
  id: string;
  session_name: string;
  position: string;
  exercises_count: number;
  exercises_data: Exercise[];
  completed_at: string;
}

const Historico = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("training_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (error) {
        console.error("Error fetching training sessions:", error);
      } else {
        setSessions(data || []);
      }
      setLoading(false);
    };

    fetchSessions();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-6 max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-6 animate-fade-in">
          <History className="w-6 h-6 text-primary" />
          <h1 className="font-heading text-xl font-bold">Histórico de Treinos</h1>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <Dumbbell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-sm mb-1">Nenhum treino registrado ainda</p>
            <p className="text-muted-foreground text-xs">Complete seu primeiro treino para ver o histórico!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session, index) => {
              const isExpanded = expandedId === session.id;
              const date = new Date(session.completed_at);

              return (
                <div
                  key={session.id}
                  className="gradient-card rounded-xl border border-border/20 overflow-hidden transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : session.id)}
                    className="w-full p-4 text-left hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-sm font-bold text-foreground mb-1">
                          {session.session_name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(date, "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {session.position}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                          {session.exercises_count} exercícios
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(date, "HH:mm", { locale: ptBR })}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-border/20 pt-3 animate-fade-in">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                        Exercícios realizados
                      </p>
                      <div className="space-y-2">
                        {session.exercises_data.map((exercise, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{exercise.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {exercise.sets}x{exercise.reps} • {exercise.rest} descanso
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Historico;
