import { Shield, Calendar, TrendingUp, Lightbulb } from "lucide-react";
import FadeInSection from "@/components/FadeInSection";

const pillars = [
  {
    icon: Shield,
    title: "Treino por posição",
    desc: "Receba orientações mais coerentes com a exigência real da sua função em campo.",
  },
  {
    icon: Calendar,
    title: "Plano semanal",
    desc: "Uma rotina organizada para reduzir improviso e aumentar consistência.",
  },
  {
    icon: TrendingUp,
    title: "Evolução visível",
    desc: "Acompanhe sua construção ao longo do tempo com mais clareza.",
  },
  {
    icon: Lightbulb,
    title: "Apoio inteligente",
    desc: "Receba orientação complementar para ajustar foco, rotina e entendimento.",
  },
];

const ProposalSection = () => {
  return (
    <section className="section-padding bg-background relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,hsl(145_65%_42%/0.05),transparent_50%)]" />
      <div className="container max-w-5xl mx-auto px-4 relative z-10">
        <FadeInSection>
          <div className="text-center mb-14">
            <p className="section-title text-primary mb-3">A proposta</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-tight tracking-tight">
              Um sistema de evolução{" "}
              <span className="text-gradient">pensado para a evolução do atleta.</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
              O Pro Futebol SM transforma treino solto em processo estruturado. Você entende melhor seu momento, organiza sua semana e treina com mais coerência para evoluir no futebol.
            </p>
          </div>
        </FadeInSection>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {pillars.map(({ icon: Icon, title, desc }, i) => (
            <FadeInSection key={title} delay={i * 100}>
              <div className="premium-card rounded-2xl p-6 md:p-7 h-full group">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
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

export default ProposalSection;
