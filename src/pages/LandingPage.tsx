import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Shield, Activity, Calendar, Check, ChevronRight, Instagram, Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import FadeInSection from "@/components/FadeInSection";
import AnimatedCounter from "@/components/AnimatedCounter";
import IMCCalculator from "@/components/IMCCalculator";
import fieldBg from "@/assets/field-bg.jpg";
import appMockup from "@/assets/app-mockup.png";
import sauloAbout from "@/assets/saulo-about.jpeg";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center">
        <img
          src={fieldBg}
          alt="Campo de futebol"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-field-dark/70" />

        <div className="relative z-10 w-full">
          {/* Nav */}
          <nav className="absolute top-0 left-0 right-0 px-4 md:px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-7 h-7 text-primary" />
              <span className="font-heading font-extrabold text-lg">
                <span className="text-gradient">Pro Futebol</span> <span className="text-foreground">SM</span>
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => navigate("/login")}
              className="bg-primary hover:bg-primary/90 font-semibold text-sm transition-all hover:scale-[1.02]"
            >
              Entrar
            </Button>
          </nav>

          <div className="container max-w-6xl mx-auto px-4 pt-24 pb-16 md:pt-32">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="animate-fade-in">
                <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">⚽ App #1 de treinos</p>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-foreground mb-5">
                  O app revolucionário para atletas de{" "}
                  <span className="text-gradient">futebol</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-lg">
                  Treinos por posição. Evolução real. Resultados em campo.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button className="h-13 px-7 font-heading font-bold text-base bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
                     Baixar grátis iOS
                  </Button>
                  <Button
                    variant="outline"
                    className="h-13 px-7 font-heading font-bold text-base border-foreground/30 text-foreground hover:bg-foreground/10 transition-all hover:scale-[1.02]"
                  >
                     Android
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs">✓</span>
                  <AnimatedCounter end={500} prefix="+" /> atletas já treinando
                </p>
              </div>

              <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <img
                  src={appMockup}
                  alt="Pro Futebol SM App"
                  className="w-56 md:w-72 drop-shadow-[0_20px_60px_rgba(22,163,74,0.3)]"
                  width={512}
                  height={1024}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOBRE SAULO ===== */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeInSection>
              <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">Quem criou</p>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-5">
                Criado por quem vive o{" "}
                <span className="text-gradient">futebol</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
                Sou Saulo Moreira, apaixonado por esporte. Desenvolvi o Pro Futebol SM porque atletas precisam de preparação específica, não treinos genéricos.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Shield, text: "Treinos específicos por posição" },
                  { icon: Activity, text: "Evolução mensurável com dados reais" },
                  { icon: Calendar, text: "Preparação otimizada para jogos" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </FadeInSection>

            <FadeInSection delay={200}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl" />
                <img
                  src={sauloAbout}
                  alt="Saulo Moreira - Criador do Pro Futebol SM"
                  className="relative rounded-2xl w-full max-w-md mx-auto object-cover shadow-2xl"
                  loading="lazy"
                  width={600}
                  height={750}
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ===== CALCULADORA IMC ===== */}
      <section className="py-20 md:py-28 bg-field-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(142_72%_37%/0.15),transparent_70%)]" />
        <div className="container max-w-2xl mx-auto px-4 relative z-10 text-center">
          <FadeInSection>
            <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">Teste agora</p>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              Descubra seu condicionamento em <span className="text-gradient">30s</span>
            </h2>
            <p className="text-muted-foreground text-base mb-10">
              Avaliação completa do atleta de futebol
            </p>
          </FadeInSection>

          <FadeInSection delay={200}>
            <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border/20 mb-8">
              <IMCCalculator />
            </div>
          </FadeInSection>

          <FadeInSection delay={400}>
            <Button className="h-14 px-10 font-heading font-bold text-base bg-highlight hover:bg-highlight/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Quero meu plano Pro Futebol SM
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </FadeInSection>
        </div>
      </section>

      {/* ===== FUNCIONALIDADES ===== */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container max-w-6xl mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-14">
              <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">Funcionalidades</p>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground">
                Tudo que você precisa para{" "}
                <span className="text-gradient">evoluir</span>
              </h2>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Treinos por Posição", desc: "Programas exclusivos para cada posição. Goleiro, zagueiro, meia — cada um com foco específico." },
              { icon: Activity, title: "Avaliação Física", desc: "IMC, teste de Cooper, sprint 30m. Métricas reais para acompanhar sua evolução." },
              { icon: Calendar, title: "Preparação para Jogos", desc: "Periodização inteligente. Saiba exatamente o que treinar antes de cada partida." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <FadeInSection key={title} delay={i * 150}>
                <div className="gradient-card rounded-2xl p-7 border border-border/20 h-full transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/25 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 md:py-28 gradient-field relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,hsl(142_72%_37%/0.2),transparent_60%)]" />
        <div className="container max-w-2xl mx-auto px-4 relative z-10 text-center">
          <FadeInSection>
            <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-foreground mb-5">
              Pronto para ser <span className="text-gradient">titular</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Comece sua evolução hoje. Sem cartão de crédito.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="h-14 px-10 font-heading font-bold text-lg bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow"
            >
              ⚽ Criar conta gratuita
            </Button>
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {["Grátis para começar", "Cancelamento fácil", "Suporte humano"].map((text) => (
                <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  {text}
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-10 bg-background border-t border-border/20">
        <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-sm">
              <span className="text-gradient">Pro Futebol</span> SM
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Youtube className="w-5 h-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
          </div>
          <p className="text-muted-foreground text-xs">© {new Date().getFullYear()} Saulo Moreira. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
