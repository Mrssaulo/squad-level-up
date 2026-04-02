import { useNavigate } from "react-router-dom";
import { Trophy, ChevronDown, Target, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import appMockup from "@/assets/app-mockup.png";

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToSystem = () => {
    document.getElementById("sistema")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(145_65%_42%/0.10),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_50%,hsl(145_65%_42%/0.05),transparent)]" />

      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-20 px-4 md:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
          <span className="font-heading font-extrabold text-base tracking-tight">
            <span className="text-gradient">Pro Futebol</span>{" "}
            <span className="text-foreground/80">SM</span>
          </span>
        </div>
        <Button
          size="sm"
          onClick={() => navigate("/login")}
          className="font-semibold text-sm px-5"
        >
          Entrar
        </Button>
      </nav>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container max-w-6xl mx-auto px-4 pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Copy */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/12 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                  Sistema de evolução para atletas
                </span>
              </div>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight text-foreground mb-5">
                Treine com mais direção.{" "}
                <span className="text-gradient">Evolua com mais consistência.</span>
              </h1>

              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-[500px]">
                Treino por posição, plano semanal e acompanhamento de progresso para atletas que querem transformar esforço em evolução real.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <Button
                  onClick={() => navigate("/login")}
                  className="h-13 px-8 font-heading font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Começar grátis
                </Button>
                <Button
                  variant="outline"
                  onClick={scrollToSystem}
                  className="h-13 px-7 font-heading font-bold text-base border-border/60 text-foreground/80 hover:bg-surface-2 transition-all hover:scale-[1.02]"
                >
                  Entender o sistema
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <p className="text-muted-foreground/70 text-sm">
                Feito para atleta de futebol. Não para rotina genérica.
              </p>

              {/* Compact indicators */}
              <div className="flex items-center gap-5 mt-8 pt-8 border-t border-border/30">
                {[
                  { icon: Target, label: "Treino por posição" },
                  { icon: Calendar, label: "Plano semanal" },
                  { icon: TrendingUp, label: "Evolução visível" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-primary/70" />
                    <span className="text-foreground/50 text-xs font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Mockup */}
            <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.25s" }}>
              <div className="relative">
                <div className="absolute -inset-12 bg-[radial-gradient(circle,hsl(145_65%_42%/0.10),transparent_70%)] blur-3xl" />
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent opacity-60" />
                <img
                  src={appMockup}
                  alt="Pro Futebol SM — Sistema de evolução para atletas"
                  className="relative w-56 md:w-64 lg:w-72 drop-shadow-2xl"
                  width={512}
                  height={1024}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
    </section>
  );
};

export default HeroSection;
