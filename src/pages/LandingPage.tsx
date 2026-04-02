import HeroSection from "@/components/landing/HeroSection";
import DifferentiationSection from "@/components/landing/DifferentiationSection";
import PillarsSection from "@/components/landing/PillarsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PracticalValueSection from "@/components/landing/PracticalValueSection";
import PremiumPrepSection from "@/components/landing/PremiumPrepSection";
import CTASection from "@/components/landing/CTASection";
import FooterSection from "@/components/landing/FooterSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <DifferentiationSection />
      <PillarsSection />
      <HowItWorksSection />
      <PracticalValueSection />
      <PremiumPrepSection />
      <CTASection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
