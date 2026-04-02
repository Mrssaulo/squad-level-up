import { Crosshair, RefreshCw, Eye, Flame } from "lucide-react";
import FadeInSection from "@/components/FadeInSection";

const values = [
  {
    icon: Crosshair,
    title: "Mais clareza no treino",
    desc: "Você sabe melhor o que fazer, por que fazer e onde focar.",
  },
  {
    icon: RefreshCw,
    title: "Mais constância na rotina",
    desc: "O app ajuda a transformar intenção em processo.",
  },
  {
    icon: Eye,
    title: "Mais leitura do seu progresso",
    desc: "Sua evolução deixa de ser subjetiva e começa a ganhar forma.",
  },
  {
    icon: Flame,
    title: "Mais preparo para performar",
    desc: "Treinar deixa de ser apenas esforço e passa a ser construção.",
  },
];

const PracticalValueSection = () => {
  return (
    <section className="section-padding bg-background relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,hsl(145_65%_42%/0.04),transparent_60%)]" />
      <div className="container max-w-5xl mx-auto px-4 relative z-10">
        <FadeInSection>
          <div className="text-center mb-14">
            <p className="section-title text-primary mb-3">Na prática</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-tight tracking-tight">
              O que muda{" "}
              <span className="text-gradient">na prática.</span>
            </h2>
          </div>
        </FadeInSection>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {values.map(({ icon: Icon, title, desc }, i) => (
            <FadeInSection key={title} delay={i * 100}>
              <div className="flex items-start gap-4 rounded-2xl p-6 premium-card h-full">
                <div className="icon-container shrink-0 mt-0.5">
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

export default PracticalValueSection;
