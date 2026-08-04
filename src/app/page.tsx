import { AnnouncementBanner } from '@/components/home/extra/AnnouncementBanner';
import CtaSection from '@/components/home/sections/CtaSection';
import { CustomFeaturesSection } from '@/components/home/sections/CustomFeaturesSection';
import HeroSection from '@/components/home/sections/HeroSection';
import { PredictionThesisSection } from '@/components/home/sections/PredictionThesisSection';
import { ReferralFeatureSection } from '@/components/home/sections/ReferralFeatureSection';
import { Footer } from '@/components/layout/Footer';

/**
 * Home page at the root of the app.
 * @returns html page
 */
export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen relative">
      <AnnouncementBanner />
      <HeroSection />
      <ReferralFeatureSection />
      <CustomFeaturesSection />
      <PredictionThesisSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
