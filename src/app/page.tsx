import { LandingNav } from './(landing)/LandingNav';
import { HeroSection } from './(landing)/HeroSection';
import { ScenarioSection } from './(landing)/ScenarioSection';
import { SafetySection } from './(landing)/SafetySection';
import { TestimonialsSection } from './(landing)/TestimonialsSection';
import { PricingSection } from './(landing)/PricingSection';
import { CtaSection } from './(landing)/CtaSection';
import { LandingFooter } from './(landing)/LandingFooter';
import { WaveDivider } from '@/components/decorative/WaveDivider';

export default function Home() {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <HeroSection />

      {/* Hero → Scenarios transition */}
      <WaveDivider
        topColor="var(--color-night-950)"
        bottomColor="var(--color-night-50)"
      />

      <ScenarioSection />

      {/* Scenarios → Safety transition */}
      <WaveDivider
        topColor="var(--color-night-50)"
        bottomColor="var(--color-night-900)"
      />

      <SafetySection />

      {/* Safety → Testimonials transition */}
      <WaveDivider
        topColor="var(--color-night-900)"
        bottomColor="var(--color-glow-50)"
      />

      <TestimonialsSection />

      {/* Testimonials → Pricing transition */}
      <WaveDivider
        topColor="var(--color-glow-50)"
        bottomColor="var(--color-night-800)"
      />

      <PricingSection />

      {/* Pricing → CTA is continuous dark, no divider needed */}

      <CtaSection />
      <LandingFooter />
    </div>
  );
}
