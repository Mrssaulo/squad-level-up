import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { callAI } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Trophy, RefreshCw, Chrome as Home, Loader as Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest: string;
  instruction?: string;
}

interface TrainingData {
  title: string;
  description: string;
  exercises: Exercise[];
}

const CONFETTI_COLORS = [
  "hsl(142, 72%, 37%)", // primary green
  "hsl(24, 94%, 53%)",  // accent orange
  "hsl(45, 93%, 58%)",  // gold
  "hsl(200, 80%, 55%)", // blue
  "hsl(340, 80%, 55%)", // pink
];

const ConfettiPiece = ({ index }: { index: number }) => {
  const left = Math.random() * 100;
  const delay = Math.random() * 2;
  const size = Math.random() * 8 + 4;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const shape = index % 3 === 0 ? "rounded-full" : index % 3 === 1 ? "rounded-sm" : "";

  return (
    <div
      className={`absolute animate-confetti-fall ${shape}`}
      style={{
        left: `${left}%`,
        top: "-20px",
        width: `${size}px`,
        height: `${size * (index % 2 === 0 ? 1 : 0.6)}px`,
        backgroundColor: color,
        animationDelay: `${delay}s`,
        animationDuration: `${2.5 + Math.random() * 1.5}s`,
        opacity: 0.9,
      }}
    />
  );
};

const TrainingComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const training = location.state?.training as TrainingData | undefined;
    const position = location.state?.position as string | undefined;

    if (!training || !position) {
      navigate("/dashboard");
      return;
    }

    const saveAndGenerateMessage = async () => {
      setSaving(true);
      try {
        const { error } = await supabase.from("training_sessions").insert([{
          user_id: user.id,
          session_name: training.title,
          position,
          exercises_count: training.exercises.length,
          exercises_data: training.exercises as any,
        }]);

        if (error) {
          console.error("Error saving training session:", error);
          toast.error("Erro ao salvar treino no histórico");
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("total_trainings, trainings_this_week, physical_level, level")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          const newTotal = profile.total_trainings + 1;
          const newWeek = Math.min(profile.trainings_this_week + 1, 5);
          const newPhysical = Math.min(profile.physical_level + 2, 100);
          const newLevel = newTotal >= 50 ? "Estrela" : newTotal >= 20 ? "Titular" : "Iniciante";

          await supabase.from("profiles").update({
            total_trainings: newTotal,
            trainings_this_week: newWeek,
            physical_level: newPhysical,
            level: newLevel,
          }).eq("user_id", user.id);
        }
      } catch (e) {
        console.error("Error in saveAndGenerateMessage:", e);
      } finally {
        setSaving(false);
      }

      try {
        const message = await callAI(
          [{ role: "user", content: "Me dê uma frase motivacional curta de 1 linha para celebrar a conclusão do treino." }],
          "motivation",
          { position, exercisesCompleted: training.exercises.length }
        );
        setMotivationalMessage(message.trim().replace(/["']/g, ""));
      } catch (e) {
        setMotivationalMessage("Parabéns! Você está cada vez mais perto de se tornar um campeão!");
      } finally {
        setLoading(false);
      }
    };

    saveAndGenerateMessage();
  }, [user, location.state, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>
      )}

      <div className="max-w-md w-full text-center">
        {/* Trophy with bounce-in */}
        <div className="relative mb-8 animate-bounce-in">
          <div className="absolute inset-0 animate-pulse-glow rounded-full w-28 h-28 mx-auto" />
          <Trophy className="w-24 h-24 mx-auto text-primary relative animate-float" />
        </div>

        <h1 className="font-heading text-4xl font-extrabold text-foreground mb-3 animate-fade-in">
          Treino Concluído! 🏆
        </h1>

        <div className="min-h-[60px] flex items-center justify-center mb-8">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Gerando mensagem...</span>
            </div>
          ) : (
            <p className="text-lg text-muted-foreground leading-relaxed animate-fade-in">
              {motivationalMessage}
            </p>
          )}
        </div>

        {saving && (
          <div className="mb-6 text-sm text-muted-foreground flex items-center justify-center gap-2 animate-fade-in">
            <Loader2 className="w-4 h-4 animate-spin" />
            Salvando no histórico...
          </div>
        )}

        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full h-14 font-heading font-bold text-base bg-primary hover:bg-primary/90 transition-all"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Treinar Novamente
          </Button>

          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="w-full h-14 font-heading font-bold text-base border-border/50 hover:bg-muted/50 transition-all"
          >
            <Home className="w-5 h-5 mr-2" />
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrainingComplete;
