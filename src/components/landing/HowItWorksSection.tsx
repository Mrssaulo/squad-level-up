import { UserPlus, Target, CalendarDays, BarChart3 } from "lucide-react";
import FadeInSection from "@/components/FadeInSection";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Defina seu perfil de atleta",
    desc: "Posição, nível e objetivo — para que tudo no app esteja alinhado ao seu contexto.",
  },
  {
    icon: Target,
    number: "02",
    title: "Receba uma base alinhada à sua posição",
    desc: "Treinos e exercícios pensados para a exigência real da sua função em campo.",
  },
  {
    icon: CalendarDays,
    number: "03",
    title: "Organize sua semana de treino",
    desc: "Monte uma rotina com mais estrutura e menos improviso.",
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Acompanhe sua evolução com clareza",
    desc: "Visualize seu progresso e transforme treino em processo contínuo.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="section-padding surface-1 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container max-w-4xl mx-auto px-4 relative z-10">
        <FadeInSection>
          <div className="text-center mb-14">
            <p className="section-title text-primary mb-3">Como funciona</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-tight tracking-tight">
              Uma rotina mais organizada para{" "}
              <span className="text-gradient">quem quer evoluir no futebol.</span>
            </h2>
          </div>
        </FadeInSection>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[1.85rem] md:left-[2.1rem] top-8 bottom-8 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent hidden md:block" />

          <div className="space-y-4 md:space-y-5">
            {steps.map(({ icon: Icon, number, title, desc }, i) => (
              <FadeInSection key={number} delay={i * 120}>
                <div className="flex items-start gap-5 md:gap-6 rounded-2xl p-5 md:p-6 bg-background border border-border/40 group hover:border-primary/20 transition-all duration-300">
                  <div className="flex flex-col items-center gap-1 shrink-0 relative z-10">
                    <span className="font-heading text-xs font-bold text-primary/50">{number}</span>
                    <div className="w-11 h-11 rounded-xl bg-primary/8 border border-primary/12 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="pt-1">
                    <h3 className="font-heading text-base md:text-lg font-bold text-foreground tracking-tight mb-1">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
