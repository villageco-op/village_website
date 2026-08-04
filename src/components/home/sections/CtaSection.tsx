import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';

/**
 * The call to action with contact buttons.
 * @returns The "CTA" section of the homepage
 */
export default function CtaSection() {
  return (
    <section className="bg-forest-dark py-25 text-center relative overflow-hidden" id="cta">
      <div className="container-custom relative z-10">
        <div className="pt-5">
          <SectionHeader
            variant="inverted"
            align="center"
            hasAfterLine
            eyebrow="Join your village"
            title={
              <h2 className="font-heading text-[clamp(2.4rem,4.2vw,3.6rem)] font-extrabold text-cream tracking-[-0.035em] leading-[1.1] mb-10 max-w-170 mx-auto">
                Your neighborhood is ready. <span className="text-lime">Are you?</span>
              </h2>
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3.5 justify-center flex-wrap mb-12">
          <Button asChild variant="lime" className="px-6 h-14 font-sans text-base font-semibold">
            <Link href="/login">
              Get involved <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="text-cream hover:bg-white/10 hover:text-white border-cream/40 hover:border-white border-2 rounded-md px-6 h-14 font-sans text-base font-semibold transition-colors"
          >
            <Link href="/contact">Talk to our team</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
