'use client';

import { Star } from 'lucide-react';

import type { PublicUserProfile } from '@/lib/api/generated/models/publicUserProfile';
import { getTimeDifferenceFromNow } from '@/lib/date-utils';

interface SellerStatsRowProps {
  profile: PublicUserProfile;
}

/**
 * A card containing horizontally aligned stats including overall rating.
 * @param props - Props for the seller stats
 * @param props.profile - The seller profile information
 * @returns The seller stats row component
 */
export default function SellerStatsRow({ profile }: SellerStatsRowProps) {
  const timeOnVillage = getTimeDifferenceFromNow(profile.joinedAt as string);

  return (
    <div className="flex w-full flex-wrap items-center justify-between rounded-2xl border border-cream-dark bg-white p-6 shadow-sm md:flex-nowrap md:divide-x md:divide-cream-dark">
      <div className="flex flex-1 flex-col items-center px-4 text-center">
        <div className="flex items-center font-heading text-xl font-extrabold text-deep-forest md:text-2xl">
          {profile.starRating.toFixed(1)} <Star className="ml-1 h-5 w-5 fill-current text-sun" />
        </div>
        <div className="mt-1 font-sans text-xs text-ink-3">Buyer rating</div>
      </div>

      <div className="flex flex-1 flex-col items-center px-4 text-center">
        <div className="font-heading text-xl font-extrabold text-deep-forest md:text-2xl">
          {timeOnVillage}
        </div>
        <div className="mt-1 font-sans text-xs text-ink-3">On Village</div>
      </div>

      <div className="flex flex-1 flex-col items-center px-4 text-center">
        <div className="font-heading text-xl font-extrabold text-deep-forest md:text-2xl">
          {profile.activeBuyerCount} {profile.activeBuyerCount === 1 ? 'buyer' : 'buyers'}
        </div>
        <div className="mt-1 font-sans text-xs text-ink-3">Active relationships</div>
      </div>
    </div>
  );
}
