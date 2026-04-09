import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

import { Button } from '@/components/ui/button';
import { GradientBar } from '@/components/ui/gradient-bar';
import { SectionHeader } from '@/components/ui/section-header';

const TRUST_FACTORS = [
  '🌿 Gary, Indiana',
  '🌱 Pilot launching Spring 2026',
  '💚 Community-owned from day one',
];

/**
 * The call to action with contact buttons.
 * @returns The "CTA" section of the homepage
 */
export default function CtaSection() {
  return (
    <section className="bg-primary py-25 text-center relative overflow-hidden" id="cta">
      <GradientBar></GradientBar>

      <div className="container-custom relative z-10">
        <div className="pt-5">
          <SectionHeader
            variant="inverted"
            align="center"
            hasAfterLine
            eyebrow="Join the movement"
            title={
              <h2 className="font-heading text-[clamp(2.4rem,4.2vw,3.6rem)] font-extrabold text-cream tracking-[-0.035em] leading-[1.1] mb-10 max-w-170 mx-auto">
                Your neighborhood is ready. <span className="text-lime">Are you?</span>
              </h2>
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3.5 justify-center flex-wrap mb-12">
          <Button
            asChild
            className="bg-lime text-forest-dark transition-all duration-300 rounded-md px-6 h-14 font-sans text-base font-semibold hover:bg-lime-light hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(164,199,57,0.4)]"
          >
            <Link href="/login">
              Get involved <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="text-cream hover:bg-white/10 hover:text-white border-cream/40 hover:border-white border-2 rounded-md px-6 h-14 font-sans text-base font-semibold transition-colors"
          >
            Talk to our team
          </Button>
        </div>

        {/* Trust Factors */}
        <div className="flex items-center justify-center gap-5 flex-wrap">
          {TRUST_FACTORS.map((factor, index) => (
            <Fragment key={factor}>
              <div className="flex items-center gap-1.75 font-sans text-[0.77rem] text-cream/40">
                {factor}
              </div>
              {index < TRUST_FACTORS.length - 1 && (
                /* trust-sep: 3px */
                <div className="w-0.75 h-0.75 rounded-full bg-cream/20" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
