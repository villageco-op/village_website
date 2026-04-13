'use client';

import { Card, CardContent } from '@/components/ui/card';

/**
 * A card with a button to add a new listing.
 * @returns A add new listing card component
 */
export function AddNewListingCard() {
  return (
    <Card className="mb-5 cursor-pointer rounded-xl border-2 border-dashed border-forest-dark/20 bg-white transition-colors duration-200 hover:bg-lime-pale/20">
      <CardContent className="flex h-full flex-col items-center justify-center p-12 text-center">
        <div className="mb-2.5 text-3xl">➕</div>
        <div className="font-heading text-[0.9rem] font-bold text-ink-2">Add a new listing</div>
        <div className="mt-1 font-sans text-[0.78rem] text-ink-3">
          List produce, set price, quantity, and delivery options
        </div>
      </CardContent>
    </Card>
  );
}
