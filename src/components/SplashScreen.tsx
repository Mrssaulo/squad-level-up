import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1600);
    const doneTimer = setTimeout(onFinish, 2000);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-400 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      {/* Glow ring */}
      <div className="relative mb-6 animate-bounce-in">
        <div className="absolute inset-0 w-24 h-24 rounded-full bg-primary/20 animate-pulse-glow" />
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center shadow-2xl shadow-primary/20 animate-float">
          <Trophy className="w-12 h-12 text-primary" />
        </div>
      </div>

      {/* Logo text */}
      <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          Pro Futebol <span className="text-gradient">SM</span>
        </h1>
      </div>

      <p
        className="text-sm text-muted-foreground mt-2 animate-fade-in"
        style={{ animationDelay: "0.6s" }}
      >
        Evolua seu jogo
      </p>

      {/* Loading dots */}
      <div className="flex gap-1.5 mt-8 animate-fade-in" style={{ animationDelay: "0.8s" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;
