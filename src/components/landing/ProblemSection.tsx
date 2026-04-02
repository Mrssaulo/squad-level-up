import { X, Check } from "lucide-react";
import FadeInSection from "@/components/FadeInSection";

const ProblemSection = () => {
  return (
    <section className="section-padding surface-1 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,hsl(145_65%_42%/0.04),transparent_50%)]" />
      <div className="container max-w-5xl mx-auto px-4 relative z-10">
        <FadeInSection>
          <div className="text-center mb-14">
            <p className="section-title text-primary mb-3">O problema</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-tight tracking-tight">
              Treinar sem direção{" "}
              <span className="text-muted-foreground">atrasa sua evolução.</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
              Muitos atletas treinam com esforço, mas sem estrutura. Pulam entre exercícios, repetem rotinas genéricas e não conseguem enxergar progresso com clareza. O problema não é só treinar. É treinar com lógica.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={200}>
          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {/* Without direction */}
            <div className="rounded-2xl p-6 md:p-7 bg-destructive/5 border border-destructive/15">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-destructive/15 flex items-center justify-center">
                  <X className="w-4 h-4 text-destructive" />
                </div>
                <span className="font-heading text-sm font-bold text-destructive/90 uppercase tracking-wider">Treino genérico</span>
              </div>
              <ul className="space-y-3">
                {[
                  "Exercícios aleatórios sem conexão",
                  "Sem progressão visível",
                  "Mesma rotina para todas as posições",
                  "Motivação que oscila sem parar",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-destructive/50 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* With direction */}
            <div className="rounded-2xl p-6 md:p-7 bg-primary/5 border border-primary/15">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="font-heading text-sm font-bold text-primary/90 uppercase tracking-wider">Treino orientado</span>
              </div>
              <ul className="space-y-3">
                {[
                  "Treino coerente com sua posição",
                  "Evolução acompanhada com clareza",
                  "Plano semanal com estrutura",
                  "Consistência que gera resultado",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

export default ProblemSection;
