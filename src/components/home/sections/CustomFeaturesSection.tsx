import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface CustomFeaturesSectionProps {
  id?: string;
  contactHref?: string;
}

/**
 * Narrow section asking if the user needs custom features.
 * @param props - Component props
 * @param props.id - The section Id
 * @param props.contactHref - The contact button destination
 * @returns A section component
 */
export function CustomFeaturesSection({
  id = 'custom-features-banner',
  contactHref = '/custom-features',
}: CustomFeaturesSectionProps) {
  return (
    <section
      id={id}
      className="bg-forest-dark text-cream py-12 md:py-16 px-8 sm:px-12 lg:px-20 border-t border-b border-cream/10"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Content */}
        <div className="max-w-3xl flex flex-col gap-3">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-cream">
            Need custom functionality or different features?
          </h3>
          <p className="text-base text-cream/80 leading-relaxed">
            Our referral system was built for a food pantry&apos;s exact needs, but every
            organization operates differently. Whether you manage a pantry, grocery store, or
            restaurant, we can build custom software tailored to your workflow.
          </p>
        </div>

        {/* CTA Button */}
        <div className="shrink-0">
          <Button variant="lime" size="lg" className="h-12 px-8 font-bold" asChild>
            <Link href={contactHref}>
              Request Custom Features
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
