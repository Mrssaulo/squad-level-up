import { UserPlus, Target, CalendarDays, BarChart3 } from "lucide-react";
import FadeInSection from "@/components/FadeInSection";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Monte seu perfil no app",
    desc: "Informe sua posição, nível e objetivo para receber orientação personalizada.",
  },
  {
    icon: Target,
    number: "02",
    title: "Receba direcionamento conforme sua posição",
    desc: "Treinos, exercícios e foco alinhados com a exigência real do seu papel em campo.",
  },
  {
    icon: CalendarDays,
    number: "03",
    title: "Organize seus treinos da semana",
    desc: "Monte sua rotina semanal com mais estrutura e menos improviso.",
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Acompanhe sua evolução e mantenha consistência",
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
              Uma rotina mais clara para{" "}
              <span className="text-gradient">quem quer evoluir.</span>
            </h2>
          </div>
        </FadeInSection>

        <div className="space-y-4 md:space-y-5">
          {steps.map(({ icon: Icon, number, title, desc }, i) => (
            <FadeInSection key={number} delay={i * 100}>
              <div className="flex items-start gap-5 md:gap-6 rounded-2xl p-5 md:p-6 bg-background border border-border/50 group hover:border-primary/20 transition-all duration-300">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="font-heading text-xs font-bold text-primary/60">{number}</span>
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
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
    </section>
  );
};

export default HowItWorksSection;
