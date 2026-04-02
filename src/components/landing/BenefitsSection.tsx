import { Compass, Brain, Eye, Flame } from "lucide-react";
import FadeInSection from "@/components/FadeInSection";

const benefits = [
  {
    icon: Compass,
    title: "Saiba o que fazer agora",
    desc: "O app ajuda o atleta a sair da indecisão e entrar em rotina.",
  },
  {
    icon: Brain,
    title: "Treine com mais lógica",
    desc: "Menos improviso. Mais coerência com seu objetivo e posição.",
  },
  {
    icon: Eye,
    title: "Acompanhe seu progresso",
    desc: "Visualize sua evolução e enxergue sua construção com mais nitidez.",
  },
  {
    icon: Flame,
    title: "Construa disciplina de preparação",
    desc: "Transforme treino em processo, não em tentativa aleatória.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="section-padding bg-background relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,hsl(145_65%_42%/0.06),transparent_60%)]" />
      <div className="container max-w-5xl mx-auto px-4 relative z-10">
        <FadeInSection>
          <div className="text-center mb-14">
            <p className="section-title text-primary mb-3">Benefícios</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-tight tracking-tight">
              Mais clareza. Mais consistência.{" "}
              <span className="text-gradient">Mais evolução.</span>
            </h2>
          </div>
        </FadeInSection>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {benefits.map(({ icon: Icon, title, desc }, i) => (
            <FadeInSection key={title} delay={i * 100}>
              <div className="flex items-start gap-4 rounded-2xl p-6 premium-card h-full">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground tracking-tight mb-1">
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

export default BenefitsSection;
