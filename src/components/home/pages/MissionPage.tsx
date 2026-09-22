import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

/**
 * The page containing our mission statement and back to problem page button.
 * @returns Page component with mission statement
 */
export default function MissionPage() {
  return (
    <div className="min-h-screen bg-forest-dark text-cream flex flex-col justify-between py-16 px-6 sm:px-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-lime/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom max-w-5xl mx-auto my-auto space-y-12 relative z-10">
        {/* Core Vision Statement */}
        <div className="space-y-6">
          <p className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-cream leading-tight tracking-tight">
            <span className="text-lime">Village</span> provides research and software solutions to
            build an{' '}
            <span className="underline decoration-lime decoration-4 underline-offset-8 text-white">
              affordable &amp; accessible network of sustainability
            </span>
            .
          </p>
        </div>

        {/* Network Breakdown for High Contrast & Flow */}
        <div className="pt-8 border-t border-cream/20 space-y-6">
          <p className="text-xl sm:text-2xl font-sans text-cream/90 leading-relaxed">
            Bridging the gap between{' '}
            <span className="inline-block bg-lime/20 text-lime-light px-3 py-1 rounded-md font-semibold text-lg sm:text-xl my-1 mx-1 border border-lime/30">
              local growers
            </span>
            ,{' '}
            <span className="inline-block bg-lime/20 text-lime-light px-3 py-1 rounded-md font-semibold text-lg sm:text-xl my-1 mx-1 border border-lime/30">
              markets
            </span>
            ,{' '}
            <span className="inline-block bg-lime/20 text-lime-light px-3 py-1 rounded-md font-semibold text-lg sm:text-xl my-1 mx-1 border border-lime/30">
              food pantries
            </span>
            ,{' '}
            <span className="inline-block bg-lime/20 text-lime-light px-3 py-1 rounded-md font-semibold text-lg sm:text-xl my-1 mx-1 border border-lime/30">
              restaurants
            </span>
            , and{' '}
            <span className="inline-block bg-sun/20 text-sun-light px-3 py-1 rounded-md font-semibold text-lg sm:text-xl my-1 mx-1 border border-sun/30">
              food-insecure families
            </span>{' '}
            across{' '}
            <span className="font-bold text-white underline decoration-lime/50">Wisconsin</span>.
          </p>
        </div>
      </div>

      {/* Bottom Navigation Controls */}
      <div className="container-custom max-w-5xl mx-auto w-full pt-12 flex justify-between items-center border-t border-cream/15 mt-12 relative z-10">
        <Button asChild variant="ghost" className="h-12 px-8">
          <Link href="/problem">
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous: The Problem
          </Link>
        </Button>
      </div>
    </div>
  );
}
