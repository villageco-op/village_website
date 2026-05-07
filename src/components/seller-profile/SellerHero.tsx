'use client';

import { ArrowLeft, MapPin, Star, Sprout } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PublicUserProfile } from '@/lib/api/generated/models';
import { formatAppDate } from '@/lib/date-utils';
import { getInitials } from '@/lib/user-utils';

interface SellerHeroProps {
  profile: PublicUserProfile;
}

/**
 * The hero section of the seller profile with basic information and a back button.
 * @param props - Props for the seller profile
 * @param props.profile - The seller profile information
 * @returns The hero section component
 */
export default function SellerHero({ profile }: SellerHeroProps) {
  const router = useRouter();

  const initials = getInitials(profile.name);
  const joinedDate = formatAppDate(profile.joinedAt as string, 'monthYear', 'Unknown');

  return (
    <div className="bg-deep-forest pb-6 pt-8 shadow-sm">
      <div className="container-custom max-w-250">
        <Button
          variant="ghost"
          className="-ml-4 mb-6 font-sans text-sm text-ink-3 hover:text-cream hover:bg-transparent"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <Avatar className="h-24 w-24 bg-sun shadow-sm">
            <AvatarFallback className="bg-transparent font-heading text-3xl font-extrabold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <h1 className="font-heading text-2xl font-extrabold text-cream md:text-3xl">
              {profile.name || 'Anonymous Grower'}
            </h1>
            <div className="mt-1 flex items-center gap-1.5 font-sans text-sm text-ink-3">
              <MapPin className="h-3.5 w-3.5" />
              {profile.city}, {profile.state} · 0.6 mi from you
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className="border-none bg-lime/20 font-bold text-lime hover:bg-lime/30">
                <Sprout className="mr-1.5 h-3.5 w-3.5" /> Active Grower
              </Badge>
              <Badge className="border-none bg-cream-dark/30 font-medium text-cream/40 hover:bg-cream-dark/40">
                On Village since {joinedDate}
              </Badge>
              <Badge className="border-none bg-sun/20 font-bold text-sun hover:bg-sun/30">
                {profile.starRating.toFixed(1)}{' '}
                <Star className="ml-1 inline h-3 w-3 fill-current" />
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
