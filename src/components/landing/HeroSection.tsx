import { useNavigate } from "react-router-dom";
import { Trophy, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import appMockup from "@/assets/app-mockup.png";

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(145_65%_42%/0.12),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-20 px-4 md:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
            <Trophy className="w-4.5 h-4.5 text-primary" />
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
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/15 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                  Sistema de evolução para atletas
                </span>
              </div>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight text-foreground mb-5">
                Treine como atleta.{" "}
                <span className="text-gradient">Evolua com direção.</span>
              </h1>

              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-[480px]">
                O Pro Futebol SM organiza sua evolução no futebol com treino por posição, plano semanal e acompanhamento de progresso.
              </p>

              <div className="flex flex-wrap gap-3 mb-5">
                <Button
                  onClick={() => navigate("/login")}
                  className="h-13 px-8 font-heading font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Começar agora
                </Button>
                <Button
                  variant="outline"
                  onClick={scrollToHowItWorks}
                  className="h-13 px-7 font-heading font-bold text-base border-border text-foreground/80 hover:bg-surface-2 transition-all hover:scale-[1.02]"
                >
                  Ver como funciona
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <p className="text-muted-foreground text-sm">
                Sem complicação. Sem treino aleatório. Mais direção para evoluir.
              </p>
            </div>

            {/* Right — Mockup */}
            <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.25s" }}>
              <div className="relative">
                <div className="absolute -inset-8 bg-[radial-gradient(circle,hsl(145_65%_42%/0.12),transparent_70%)] blur-2xl" />
                <img
                  src={appMockup}
                  alt="Pro Futebol SM — Sistema de evolução para atletas"
                  className="relative w-52 md:w-64 lg:w-72 drop-shadow-2xl"
                  width={512}
                  height={1024}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
