import { Shield, Calendar, TrendingUp, Lightbulb } from "lucide-react";
import FadeInSection from "@/components/FadeInSection";

const pillars = [
  {
    icon: Shield,
    title: "Treino por posição",
    desc: "Seu treino precisa respeitar a função que você desempenha em campo.",
  },
  {
    icon: Calendar,
    title: "Plano semanal",
    desc: "A evolução cresce quando a semana deixa de ser improvisada.",
  },
  {
    icon: TrendingUp,
    title: "Evolução visível",
    desc: "Você precisa enxergar o processo para sustentar a consistência.",
  },
  {
    icon: Lightbulb,
    title: "Apoio inteligente",
    desc: "A tecnologia entra para orientar, não para confundir.",
  },
];

const PillarsSection = () => {
  return (
    <section className="section-padding bg-background relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,hsl(145_65%_42%/0.04),transparent_50%)]" />
      <div className="container max-w-5xl mx-auto px-4 relative z-10">
        <FadeInSection>
          <div className="text-center mb-14">
            <p className="section-title text-primary mb-3">Pilares do sistema</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-tight tracking-tight">
              A base da sua evolução{" "}
              <span className="text-gradient">dentro do app.</span>
            </h2>
          </div>
        </FadeInSection>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {pillars.map(({ icon: Icon, title, desc }, i) => (
            <FadeInSection key={title} delay={i * 100}>
              <div className="premium-card rounded-2xl p-6 md:p-7 h-full group">
                <div className="icon-container mb-5 group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2 tracking-tight">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;
