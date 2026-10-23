'use client';

import { BuyerProfileStats } from './BuyerProfileStats';

import type { BuyerUserProfile } from '@/lib/api/generated/models';

interface BuyerAboutTabProps {
  profile: BuyerUserProfile;
}

/**
 * The buyer about tab with activity stats.
 * @param props - Props for the about tab
 * @param props.profile - The buyer profile
 * @returns The about tab component
 */
export default function BuyerAboutTab({ profile }: BuyerAboutTabProps) {
  return (
    <BuyerProfileStats
      totalOrders={profile.totalOrders}
      activeSubscriptions={profile.activeSubscriptions}
      lastOrderDate={profile.lastOrderDate as string | null}
    />
  );
}
