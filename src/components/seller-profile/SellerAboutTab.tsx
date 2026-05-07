'use client';

import { Eyebrow } from '../ui/eyebrow';
import { ProduceIcon } from '../ui/produce-icon';

import { QuickOrderSection } from './QuickOrderSection';

import { Badge } from '@/components/ui/badge';
import type { ProduceListItem, PublicUserProfile } from '@/lib/api/generated/models';

interface SellerAboutTabProps {
  profile: PublicUserProfile;
  quickOrderItems?: ProduceListItem[];
  isQuickOrderLoading?: boolean;
}

/**
 * The seller about tab with seller information, specialties, and quick orders.
 * @param props - Props for the about tab
 * @param props.profile - The seller profile
 * @param props.quickOrderItems - The produce listings for the quick order section
 * @param props.isQuickOrderLoading - Are the quick order items loading
 * @returns The about tab component
 */
export default function SellerAboutTab({
  profile,
  quickOrderItems,
  isQuickOrderLoading,
}: SellerAboutTabProps) {
  const firstName = profile.name ? profile.name.split(' ')[0] : 'the Grower';

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
      <div>
        <Eyebrow>About {firstName}</Eyebrow>

        <div className="space-y-4 font-sans text-[0.95rem] leading-relaxed text-ink-2">
          {profile.aboutMe ? (
            <p>{profile.aboutMe}</p>
          ) : (
            <p>This grower hasn&apos;t added a bio yet.</p>
          )}
        </div>

        {profile.specialties && profile.specialties.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {profile.specialties.map((specialty, index) => (
              <Badge
                key={index}
                className="bg-lime-pale px-3 py-1 text-[0.76rem] text-click-green hover:bg-lime-pale"
              >
                <ProduceIcon type={specialty} className="mr-1.5 inline h-3.5 w-3.5" />
                {specialty}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <QuickOrderSection items={quickOrderItems} isLoading={isQuickOrderLoading} />
    </div>
  );
}
