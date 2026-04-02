import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import ProposalSection from "@/components/landing/ProposalSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import CTASection from "@/components/landing/CTASection";
import FooterSection from "@/components/landing/FooterSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <ProblemSection />
      <ProposalSection />
      <HowItWorksSection />
      <BenefitsSection />
      <CTASection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
