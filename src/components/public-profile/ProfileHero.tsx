'use client';

import { MapPin, Star } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatAppDate } from '@/lib/date-utils';
import { getInitials } from '@/lib/user-utils';

interface ProfileHeroProps {
  name: string | null;
  image: string | null;
  joinedAt: string | null;
  city: string | null;
  state: string | null;
  starRating?: number;
}

/**
 * The hero section of the profile with basic information and a back button.
 * @param props - Props for the seller profile
 * @param props.name - The users name
 * @param props.image - The profile image
 * @param props.joinedAt - When the user joined
 * @param props.city - The users city
 * @param props.state - The users state
 * @param props.starRating - The users rating
 * @returns The hero section component
 */
export function ProfileHero({ name, image, joinedAt, city, state, starRating }: ProfileHeroProps) {
  const initials = getInitials(name);
  const joinedDate = formatAppDate(joinedAt, 'monthYear', 'Unknown');

  return (
    <div className="bg-deep-forest pb-6 pt-8 shadow-sm">
      <div className="container-custom max-w-250">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <Avatar className="h-24 w-24">
            {image && <AvatarImage src={image} alt={initials} className="object-cover" />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <h1 className="font-heading text-2xl font-extrabold text-cream md:text-3xl">
              {name || 'Anonymous'}
            </h1>
            {city && state && (
              <div className="mt-1 flex items-center gap-1.5 font-sans text-sm text-cream/80">
                <MapPin className="h-3.5 w-3.5" />
                {city}, {state}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {joinedAt && (
                <Badge className="border-none bg-cream-dark/10 font-medium text-cream/90">
                  Joined {joinedDate}
                </Badge>
              )}
              {starRating && (
                <Badge className="border-none bg-cream-dark/10 font-bold text-sun-light">
                  {starRating.toFixed(1)} <Star className="ml-1 inline h-3 w-3 fill-current" />
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
