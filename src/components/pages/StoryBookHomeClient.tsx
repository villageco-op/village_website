'use client';

import CtaSection from '@/components/home/sections/CtaSection';
import HeroSection from '@/components/home/sections/HeroSection';
import HowItWorksSection from '@/components/home/sections/HowItWorksSection';
import ImageCarouselSection from '@/components/home/sections/ImageCarouselSection';
import ImpactSection from '@/components/home/sections/ImpactSection';
import PlatformDiagramSection from '@/components/home/sections/PlatformDiagramSection';
import WhatIsSection from '@/components/home/sections/WhatIsSection';
import WhyItMattersSection from '@/components/home/sections/WhyItMattersSection';

/**
 * Client version of the home page. Intended for storybook visualization.
 * @returns The page html
 */
export function StoryBookHomeClient() {
  return (
    <main className="flex flex-col w-full min-h-screen relative">
      <HeroSection />
      <WhatIsSection />
      <HowItWorksSection />
      <WhyItMattersSection />
      <PlatformDiagramSection />
      <ImpactSection />
      <ImageCarouselSection />
      <CtaSection />
    </main>
  );
}
