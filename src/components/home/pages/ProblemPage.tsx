import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Citation } from '@/components/home/extra/Citation';
import { DefinitionTerm } from '@/components/home/extra/DefinitionTerm';
import { Button } from '@/components/ui/button';

/**
 * The problem page with statistics and next button linking to mission statement page.
 * @returns The page component
 */
export default function ProblemPage() {
  const citations = {
    foodInsecure: {
      id: 1,
      label: 'USDA Economic Research Service',
      url: 'https://ers.usda.gov/topics/food-nutrition-assistance/food-security-in-the-us',
    },
    foodWaste: {
      id: 2,
      label: 'Wisconsin Department of Natural Resources',
      url: 'https://dnr.wisconsin.gov/topic/Waste/SMF.html',
    },
    caloricNeeds: {
      id: 3,
      label: 'Cleveland Clinic - Daily Caloric Needs',
      url: 'https://health.clevelandclinic.org/how-many-calories-a-day-should-i-eat',
    },
    volumetrics: {
      id: 4,
      label: 'Rolls (2009) - Dietary Intake Research',
      url: 'https://dynamic-dudes.bangor.ac.uk/pdfs/Fruit%20and%20Vegetable%20consumption%20displacing%20HSFS%20intake/14.Rolls.2009.pdf',
    },
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col justify-between py-16 px-6 sm:px-12">
      <div className="container-custom max-w-4xl mx-auto space-y-14">
        <div className="space-y-3 border-b-2 border-deep-forest/15 pb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-deep-forest tracking-tight">
            The Problem
          </h1>
        </div>
        {/* Main Content & Prominent Claims */}
        <div className="space-y-12 font-sans">
          {/* Claim 1 */}
          <p className="text-2xl sm:text-3xl md:text-4xl font-heading font-medium text-ink leading-tight tracking-tight">
            There are <span className="font-extrabold text-brick decoration-brick/30">804,230</span>{' '}
            <DefinitionTerm
              term="food insecure"
              definition="Without access at all times to enough food for an active, healthy life."
              citation={citations.foodInsecure}
            />{' '}
            individuals in the state of{' '}
            <span className="font-semibold text-deep-forest">Wisconsin</span>.
            <Citation
              id={citations.foodInsecure.id}
              label={citations.foodInsecure.label}
              url={citations.foodInsecure.url}
            />
          </p>

          {/* Claim 2 */}
          <p className="text-2xl sm:text-3xl md:text-4xl font-heading font-medium text-ink leading-tight tracking-tight">
            Meanwhile,{' '}
            <span className="font-extrabold text-clay decoration-clay/30">640,500 tons</span> of
            consumable food is <span className="font-semibold text-brick">wasted</span> each year.
            <Citation
              id={citations.foodWaste.id}
              label={citations.foodWaste.label}
              url={citations.foodWaste.url}
            />
          </p>

          {/* Claim 3 */}
          <p className="text-2xl sm:text-3xl md:text-4xl font-heading font-medium text-ink leading-tight tracking-tight">
            Every{' '}
            <span className="font-extrabold text-click-green decoration-click-green/30">
              1% reduction
            </span>{' '}
            in food waste is enough to provide security for{' '}
            <span className="font-extrabold text-deep-forest">14,000 food insecure</span>{' '}
            individuals.
            <Citation
              id={citations.caloricNeeds.id}
              label={citations.caloricNeeds.label}
              url={citations.caloricNeeds.url}
            />
            <Citation
              id={citations.volumetrics.id}
              label={citations.volumetrics.label}
              url={citations.volumetrics.url}
            />
          </p>

          {/* Core Question */}
          <div className="pt-8 border-t-2 border-deep-forest/15">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-deep-forest leading-snug">
              How can <span className="text-click-green">community</span> and{' '}
              <span className="text-click-green">smart technology</span> bridge the gap between food
              retailers, distributors, and households?
            </h2>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="container-custom max-w-4xl mx-auto w-full pt-12 flex justify-between items-center border-t border-forest-dark/10 mt-12">
        <div />
        <Button asChild variant="forest" className="h-12 px-8 ml-auto">
          <Link href="/mission">
            Next: Our Mission <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
