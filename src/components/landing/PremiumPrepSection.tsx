import { Layers } from "lucide-react";
import FadeInSection from "@/components/FadeInSection";

const PremiumPrepSection = () => {
  return (
    <section className="section-padding surface-1 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container max-w-3xl mx-auto px-4 relative z-10 text-center">
        <FadeInSection>
          <div className="icon-container mx-auto mb-6 w-12 h-12">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground leading-tight tracking-tight mb-5">
            Entre com uma base sólida.{" "}
            <span className="text-gradient">Evolua com mais profundidade.</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Você pode começar gratuitamente e conhecer a lógica do produto. Conforme avança, desbloqueia uma experiência mais completa, com mais personalização, rotina e acompanhamento.
          </p>
        </FadeInSection>
      </div>
    </section>
  );
};

export default PremiumPrepSection;
