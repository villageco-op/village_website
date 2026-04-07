import { NetworkGrid } from '@/components/home/NetworkGrid';
import { SectionHeader } from '@/components/ui/section-header';

/**
 * An introductory section explaining the core "operating system" concept.
 * Features a two-column layout with a SectionHeader and the NetworkGrid.
 * @returns The "About" section of the homepage.
 */
export default function WhatIsSection() {
  return (
    <section className="relative bg-cream py-25 overflow-hidden" id="about">
      {/* Decorative Top-Right Circle */}
      <div className="absolute -top-25 -right-25 w-100 h-100 rounded-full bg-lime-pale/60 pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Column: Text Content */}
          <div>
            <SectionHeader
              eyebrow="What Village is"
              title="The operating system for a community-powered food economy."
              description="Village is a technology platform that organizes neighbors, landowners, and local businesses around a single idea: that every community already has what it needs to feed itself. We provide the tools and the marketplace to make it happen — turning vacant lots and idle land into productive community gardens, and connecting local produce directly to the restaurants and households that want it."
            />
            <p className="font-sans text-base leading-[1.85] text-foreground max-w-xl mt-4">
              Every transaction stays in the neighborhood. Every dollar spent on Village produce is
              a dollar that stays local — strengthening the people who grow it and the businesses
              that buy it.
            </p>
          </div>

          {/* Right Column: Network Connect Grid */}
          <div>
            <NetworkGrid />
          </div>
        </div>
      </div>
    </section>
  );
}
