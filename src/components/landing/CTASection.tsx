import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import FadeInSection from "@/components/FadeInSection";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface-1 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(145_65%_42%/0.08),transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container max-w-2xl mx-auto px-4 relative z-10 text-center">
        <FadeInSection>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight tracking-tight mb-5">
            Seu treino precisa de{" "}
            <span className="text-gradient">direção</span>, não de excesso.
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-lg mx-auto">
            Se você quer evoluir no futebol com mais clareza, rotina e preparação, o Pro Futebol SM foi feito para isso.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="h-14 px-10 font-heading font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow"
          >
            Criar conta gratuita
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
          <p className="text-muted-foreground text-sm mt-5">
            Entre agora e comece a organizar sua evolução como atleta.
          </p>
        </FadeInSection>
      </div>
    </section>
  );
};

export default CTASection;
