import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Dumbbell, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

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

const ActiveTraining = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [training, setTraining] = useState<TrainingData | null>(null);
  const [position, setPosition] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const trainingData = location.state?.training as TrainingData | undefined;
    const userPosition = location.state?.position as string | undefined;

    if (!trainingData || !userPosition) {
      navigate("/dashboard");
      return;
    }

    setTraining(trainingData);
    setPosition(userPosition);
  }, [user, location.state, navigate]);

  if (!training) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentExercise = training.exercises[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === training.exercises.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigate("/training-complete", {
        state: {
          training,
          position,
        },
      });
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="gradient-field px-4 pt-6 pb-8">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <h1 className="font-heading text-lg font-bold text-foreground">
                {training.title}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">{training.description}</p>
          </div>
        </div>

        <div className="flex-1 px-4 -mt-4 max-w-md mx-auto w-full">
          <div className="gradient-card rounded-xl p-6 border border-border/20 min-h-[400px] flex flex-col animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Exercício {currentIndex + 1} de {training.exercises.length}
              </span>
              <div className="flex gap-1">
                {training.exercises.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      i === currentIndex ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="text-center mb-6">
                <Dumbbell className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                  {currentExercise.name}
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Séries</span>
                  <span className="text-lg font-heading font-bold text-foreground">
                    {currentExercise.sets}x
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Repetições</span>
                  <span className="text-lg font-heading font-bold text-foreground">
                    {currentExercise.reps}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Descanso</span>
                  <span className="text-lg font-heading font-bold text-foreground">
                    {currentExercise.rest}
                  </span>
                </div>
              </div>

              {currentExercise.instruction && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-foreground leading-relaxed">
                    {currentExercise.instruction}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 mb-6 gap-4">
            <Button
              onClick={handlePrevious}
              disabled={isFirst}
              variant="outline"
              size="lg"
              className={cn(
                "w-16 h-16 rounded-full p-0 transition-all",
                isFirst ? "opacity-30 cursor-not-allowed" : "hover:scale-110"
              )}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {isLast ? "Finalizar treino" : "Próximo exercício"}
              </p>
            </div>

            <Button
              onClick={handleNext}
              size="lg"
              className="w-16 h-16 rounded-full p-0 bg-primary hover:bg-primary/90 transition-all hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveTraining;
