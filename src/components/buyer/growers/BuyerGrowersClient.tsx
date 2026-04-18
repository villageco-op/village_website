'use client';

import { GrowerCard } from './GrowerCard';
import { GrowersHeader } from './GrowersHeader';
import { GrowersSkeleton } from './GrowersSkeleton';

import { useGetBuyerGrowers } from '@/lib/api/generated/buyers/buyers';

/**
 * The buyer growers page client for displaying the growers the buyer has ordered from.
 * @returns Page displaying a list of cards.
 */
export default function BuyerGrowersClient() {
  const { data: response, isLoading, isError } = useGetBuyerGrowers();

  if (isLoading) {
    return <GrowersSkeleton />;
  }

  if (isError || response?.status !== 200 || !response?.data) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <p className="font-heading font-bold">Failed to load your growers.</p>
      </div>
    );
  }

  const growers = response.data.data;
  const activeCount = response.data.meta?.total || growers.length;

  // Determine if all growers are in the same city for the subtitle
  const uniqueCities = Array.from(new Set(growers.map((g) => g.city).filter(Boolean)));
  const cityText = uniqueCities.length === 1 ? `All ${uniqueCities[0]}` : 'Multiple locations';

  return (
    <div className="flex w-full flex-col p-8 pt-6">
      <GrowersHeader activeCount={activeCount} cityText={cityText} />

      {growers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {growers.map((grower, i) => (
            <GrowerCard key={grower.sellerId} grower={grower} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-forest-dark/20 bg-slate-50 text-ink-3">
          <p>You haven&apos;t ordered from any local growers yet.</p>
        </div>
      )}
    </div>
  );
}
