import { X, Check } from "lucide-react";
import FadeInSection from "@/components/FadeInSection";

const generic = [
  "Escolha aleatória de exercícios",
  "Rotina inconsistente e sem foco",
  "Pouco contexto sobre sua posição",
  "Progresso difícil de enxergar",
];

const directed = [
  "Treino alinhado à sua posição",
  "Rotina semanal organizada",
  "Progresso visível e mensurável",
  "Direção mais clara para evoluir",
];

const DifferentiationSection = () => {
  return (
    <section id="sistema" className="section-padding surface-1 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container max-w-4xl mx-auto px-4 relative z-10">
        <FadeInSection>
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-tight tracking-tight">
              Não é só sobre treinar mais.{" "}
              <span className="text-gradient">É sobre treinar com lógica.</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
              O Pro Futebol SM não foi pensado para quem quer apenas abrir um app e escolher qualquer exercício. Ele foi pensado para atletas que querem mais direção, mais consistência e uma leitura mais clara da própria evolução.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={200}>
          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {/* Generic */}
            <div className="rounded-2xl p-6 md:p-7 bg-destructive/5 border border-destructive/10">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-destructive" />
                </div>
                <span className="font-heading text-sm font-bold text-destructive/80 uppercase tracking-wider">Treino genérico</span>
              </div>
              <ul className="space-y-3">
                {generic.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-destructive/40 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Directed */}
            <div className="rounded-2xl p-6 md:p-7 bg-primary/5 border border-primary/12">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary/12 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="font-heading text-sm font-bold text-primary/80 uppercase tracking-wider">Pro Futebol SM</span>
              </div>
              <ul className="space-y-3">
                {directed.map((item) => (
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

export default DifferentiationSection;
