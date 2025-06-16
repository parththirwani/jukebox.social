import { ComingSoonSection } from "./components/home/ComingSoon";
import { CTASection } from "./components/home/CTASection";
import { FeaturesSection } from "./components/home/FeaturesSection";
import { Footer } from "./components/home/Footer";
import { HeroSection } from "./components/home/HeroSection";
import { Navigation } from "./components/home/Navigation";
import { Redirect } from "./components/home/Redirecet";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Redirect/>
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <ComingSoonSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
