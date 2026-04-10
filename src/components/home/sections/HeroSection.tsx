import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { HeroSectionHeader } from '../HeroSectionHeader';

import { Button } from '@/components/ui/button';
import { getAssetPath } from '@/lib/utils';

/**
 * The main hero section with contact buttons and a large display image.
 * @returns The "Hero" section of the homepage
 */
export default function HeroSection() {
  return (
    <section
      className="relative min-h-dvh bg-deep-forest grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
      id="home"
    >
      {/* Decorative Radial Background */}
      <div className="absolute top-[15%] right-[30%] w-150 h-150 rounded-full bg-[radial-gradient(circle,rgba(164,199,57,0.08)_0%,transparent_65%)] pointer-events-none" />

      {/* Left Column */}
      <div className="relative z-10 flex flex-col justify-center px-8 py-24 sm:px-12 lg:pl-10 lg:pr-14 lg:py-20">
        <HeroSectionHeader
          eyebrow="Pilot launching in Gary, Indiana"
          title={
            <>
              A simple way to <span className="text-lime">grow</span> food,{' '}
              <span className="text-lime">earn</span> income, and{' '}
              <span className="text-lime">opportunity</span> right where you live.
            </>
          }
          description="Village connects neighbors, growers, and local kitchens so unused land becomes productive, communities get reliable food, and the people behind it earn fair income."
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-8 lg:mt-10">
          <Button
            asChild
            className="bg-lime text-forest-dark transition-all duration-300 rounded-md px-6 h-14 font-sans text-base font-semibold hover:bg-lime-light hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(164,199,57,0.4)]"
          >
            <Link href="/login">
              Join the movement <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="text-cream hover:bg-white/10 hover:text-white border-cream/40 hover:border-white border-2 rounded-md px-6 h-14 font-sans text-base font-semibold transition-colors"
          >
            See how it works
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-8 sm:left-12 lg:left-10 flex items-center gap-2.5 font-heading text-[0.65rem] font-bold tracking-widest uppercase text-cream/30 z-20">
          <div className="w-9 h-px bg-cream/20"></div>
          Scroll to explore
        </div>
      </div>

      {/* Right Column */}
      <div className="relative w-full min-h-100 lg:min-h-full overflow-hidden p-0">
        <Image
          src={getAssetPath('/images/main-hero.jpg')}
          alt="Community farming in Gary, Indiana"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
