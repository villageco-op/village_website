import { ArrowRight, ShoppingBag, Sprout } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface IndividualsSectionProps {
  id?: string;
}

/**
 * Section for individuals: Buyers (left) and Growers (right).
 * @param props - Component props
 * @param props.id - The section Id
 * @returns A section with buyer and grower cards
 */
export function IndividualsSection({ id = 'individuals' }: IndividualsSectionProps) {
  return (
    <section id={id} className="bg-cream py-16 md:py-24 px-8 sm:px-12 lg:px-20 text-deep-forest">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-sm font-semibold tracking-wider text-forest-dark uppercase">
            For Individuals
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mt-2">
            Choose Your Role
          </h2>
        </div>

        {/* Grid for Buyers and Growers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left Card: Buyer Role */}
          <div className="flex flex-col justify-between rounded-2xl bg-white border border-deep-forest/10 p-8 sm:p-10 shadow-lg hover:shadow-xl transition-shadow">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-lime/20 text-deep-forest">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-deep-forest">Buyer</h3>
              </div>

              <p className="text-base sm:text-lg text-deep-forest/80 leading-relaxed">
                As a buyer, you play a crucial role in stimulating the local economy. By choosing
                local produce, you incentivize passionate growers and ensure your money stays
                directly within your neighborhood.
              </p>
            </div>

            <div className="pt-8 mt-8 border-t border-deep-forest/10">
              <Button
                variant="forest"
                size="lg"
                className="w-full sm:w-auto h-12 px-8 font-bold"
                asChild
              >
                <Link href="/buyer/browse">
                  Browse Produce
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Card: Grower Role */}
          <div className="flex flex-col justify-between rounded-2xl bg-deep-forest text-cream p-8 sm:p-10 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
            {/* Background Decorative Accent */}
            <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(164,199,57,0.15)_0%,transparent_70%)] pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-lime text-deep-forest">
                  <Sprout className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-cream">Grower</h3>
              </div>

              <p className="text-base sm:text-lg text-cream/80 leading-relaxed">
                Turn your garden or urban farm into a thriving local business. Effortlessly sell
                online, manage orders, and build lasting relationships with neighbors.
              </p>
            </div>

            <div className="pt-8 mt-8 border-t border-cream/10 relative z-10">
              <Button
                variant="lime"
                size="lg"
                className="w-full sm:w-auto h-12 px-8 font-bold"
                asChild
              >
                <Link href="/login">
                  Start Growing
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
