import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Volume2,
  VolumeX,
} from "lucide-react";
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

function parseRestToSeconds(rest: string): number {
  const match = rest.match(/(\d+)/);
  if (!match) return 60;
  const num = parseInt(match[1]);
  if (rest.toLowerCase().includes("min")) return num * 60;
  return num;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function playBeep(frequency = 880, duration = 200) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    gain.gain.value = 0.3;
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
    setTimeout(() => ctx.close(), duration + 100);
  } catch {
    // Audio not supported
  }
}

function playTransitionSound() {
  playBeep(660, 150);
  setTimeout(() => playBeep(880, 150), 180);
  setTimeout(() => playBeep(1100, 250), 380);
}

const ActiveTraining = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [training, setTraining] = useState<TrainingData | null>(null);
  const [position, setPosition] = useState("");
  const [scheduledId, setScheduledId] = useState<string | null>(null);

  // Timer state
  const [timerMode, setTimerMode] = useState<"exercise" | "rest">("exercise");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [exerciseDuration] = useState(45); // default seconds per exercise set
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const trainingData = location.state?.training as TrainingData | undefined;
    const userPosition = location.state?.position as string | undefined;
    const sId = location.state?.scheduledId as string | undefined;
    if (!trainingData) { navigate("/dashboard"); return; }
    setTraining(trainingData);
    setPosition(userPosition || "");
    setScheduledId(sId || null);
  }, [user, location.state, navigate]);

  // Reset timer when exercise changes
  useEffect(() => {
    setTimerMode("exercise");
    setTimeLeft(exerciseDuration);
    setIsRunning(false);
  }, [currentIndex, exerciseDuration]);

  // Timer countdown
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (soundEnabled) playTransitionSound();

          if (timerMode === "exercise" && training) {
            // Switch to rest
            const restSecs = parseRestToSeconds(training.exercises[currentIndex].rest);
            setTimerMode("rest");
            return restSecs;
          } else {
            // Rest done → auto-advance
            setIsRunning(false);
            return 0;
          }
        }
        // Warning beep at 3 seconds
        if (prev === 4 && soundEnabled) playBeep(440, 100);
        if (prev === 3 && soundEnabled) playBeep(440, 100);
        if (prev === 2 && soundEnabled) playBeep(440, 100);
        return prev - 1;
      });
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timerMode, currentIndex, training, soundEnabled]);

  const toggleTimer = useCallback(() => {
    if (timeLeft === 0) {
      setTimerMode("exercise");
      setTimeLeft(exerciseDuration);
    }
    setIsRunning((r) => !r);
  }, [timeLeft, exerciseDuration]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimerMode("exercise");
    setTimeLeft(exerciseDuration);
  }, [exerciseDuration]);

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
  const overallProgress = ((currentIndex + (timerMode === "rest" ? 0.5 : 0)) / training.exercises.length) * 100;

  const handleNext = async () => {
    setIsRunning(false);
    if (isLast) {
      if (scheduledId) {
        await supabase.from("scheduled_trainings").update({ status: "completed" }).eq("id", scheduledId);
      }
      navigate("/training-complete", { state: { training, position } });
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirst) {
      setIsRunning(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Timer circle
  const totalTime = timerMode === "exercise" ? exerciseDuration : parseRestToSeconds(currentExercise.rest);
  const circleProgress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (circleProgress / 100) * circumference;

  return (
    <div className="min-h-screen bg-background flex flex-col page-enter">
      {/* Overall progress bar */}
      <div className="px-0">
        <Progress value={overallProgress} className="h-1.5 rounded-none" />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="gradient-field px-4 pt-4 pb-6">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <h1 className="font-heading text-lg font-bold text-foreground">{training.title}</h1>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-full hover:bg-muted/50 transition-colors"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground flex-1">{training.description}</p>
              <span className="text-xs font-semibold text-primary whitespace-nowrap">
                {Math.round(overallProgress)}% concluído
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 -mt-4 max-w-md mx-auto w-full">
          <div key={currentIndex} className="gradient-card rounded-xl p-6 border border-border/20 min-h-[420px] flex flex-col animate-fade-in">
            {/* Exercise counter */}
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
                      i === currentIndex ? "bg-primary" : i < currentIndex ? "bg-primary/40" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Exercise name */}
            <div className="text-center mb-2">
              <h2 className="font-heading text-xl font-bold text-foreground">{currentExercise.name}</h2>
            </div>

            {/* Timer circle */}
            <div className="flex justify-center my-4">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" strokeWidth="6" className="stroke-muted/30" />
                  <circle
                    cx="60" cy="60" r="54" fill="none" strokeWidth="6"
                    strokeLinecap="round"
                    className={cn(
                      "transition-all duration-1000",
                      timerMode === "exercise" ? "stroke-primary" : "stroke-accent"
                    )}
                    style={{ strokeDasharray: circumference, strokeDashoffset }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider mb-1",
                    timerMode === "exercise" ? "text-primary" : "text-accent-foreground"
                  )}>
                    {timerMode === "exercise" ? "Exercício" : "Descanso"}
                  </span>
                  <span className="text-3xl font-heading font-bold text-foreground">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            {/* Timer controls */}
            <div className="flex justify-center gap-3 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={resetTimer}
                className="rounded-full w-10 h-10 p-0"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                onClick={toggleTimer}
                size="sm"
                className={cn(
                  "rounded-full w-14 h-14 p-0 transition-all hover:scale-110",
                  isRunning ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
                )}
              >
                {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </Button>
              <div className="w-10" /> {/* spacer */}
            </div>

            {/* Exercise details */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center p-2 bg-muted/30 rounded-lg">
                <span className="text-[10px] text-muted-foreground block">Séries</span>
                <span className="text-base font-heading font-bold text-foreground">{currentExercise.sets}x</span>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded-lg">
                <span className="text-[10px] text-muted-foreground block">Reps</span>
                <span className="text-base font-heading font-bold text-foreground">{currentExercise.reps}</span>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded-lg">
                <span className="text-[10px] text-muted-foreground block">Descanso</span>
                <span className="text-base font-heading font-bold text-foreground">{currentExercise.rest}</span>
              </div>
            </div>

            {currentExercise.instruction && (
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs text-foreground leading-relaxed">{currentExercise.instruction}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-5 mb-6 gap-4">
            <Button
              onClick={handlePrevious}
              disabled={isFirst}
              variant="outline"
              size="lg"
              className={cn(
                "w-14 h-14 rounded-full p-0 transition-all",
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
              className="w-14 h-14 rounded-full p-0 bg-primary hover:bg-primary/90 transition-all hover:scale-110"
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