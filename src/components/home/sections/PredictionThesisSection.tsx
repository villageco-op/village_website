import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface PredictionThesisSectionProps {
  id?: string;
}

/**
 * Section describing the waste prediction thesis with a contact button.
 * @param props - Component props
 * @param props.id - The section Id
 * @returns A section component
 */
export function PredictionThesisSection({
  id = 'demand-prediction-research',
}: PredictionThesisSectionProps) {
  return (
    <section
      id={id}
      className="relative bg-deep-forest text-cream py-20 md:py-28 px-8 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background Decorative Accent Elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(164,199,57,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-120 h-120 rounded-full bg-[radial-gradient(circle,rgba(164,199,57,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Thesis Context & Product Concept */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold leading-tight">
            Predicting Spoilage <span className="text-lime">Before</span> It Happens
          </h2>

          <p className="text-base sm:text-lg text-cream/80 leading-relaxed">
            By analyzing city-wide grocery purchasing data alongside menu sales, our upcoming
            machine learning platform maps local demand correlations to stop waste at the source.
          </p>
        </div>

        {/* Right Column: Call to Action / Data Partner Recruitment Card */}
        <div className="lg:col-span-6">
          <div className="relative rounded-2xl bg-cream text-deep-forest p-8 sm:p-10 border border-lime/30 shadow-2xl">
            <h3 className="text-2xl font-heading font-bold text-deep-forest mb-3">
              Partner with us for the 2027 Research Pilot
            </h3>

            <p className="text-sm text-deep-forest/80 leading-relaxed mb-6">
              To train and validate the prediction models for this Master&apos;s thesis, we are
              actively looking for <strong>grocery stores and local restaurants</strong> to share
              historical purchasing and waste data leading up to August 2027.
            </p>

            {/* Partner Contact Action */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-deep-forest/10">
              <Button variant="forest" size="lg" className="w-full sm:w-auto font-bold" asChild>
                <Link href="/become-data-partner">Learn More</Link>
              </Button>
              <span className="text-xs text-deep-forest/60">
                No commitment required. Early trial is free for participating businesses.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
