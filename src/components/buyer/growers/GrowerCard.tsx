'use client';

import Link from 'next/link';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Grower } from '@/lib/api/generated/models';
import { getInitials } from '@/lib/user-utils';
import { cn } from '@/lib/utils';

interface GrowerCardProps {
  grower: Grower;
  index: number;
}

/**
 * Card for displaying information about a grower.
 * @param props - Props for the grower object
 * @param props.grower - The grower
 * @param props.index - The array index of the grower (used for styling the avatar fallback)
 * @returns A card containing grower information
 */
export function GrowerCard({ grower, index }: GrowerCardProps) {
  // Format the starting date
  const startDate = new Date(grower.firstOrderDate).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const getPillColor = (index: number) => {
    const styles = [
      'bg-lime/20 text-deep-forest hover:bg-lime/30',
      'bg-sun/20 text-yellow-900 hover:bg-sun/30',
      'bg-clay/10 text-clay hover:bg-clay/20',
    ];
    return styles[index % styles.length];
  };

  const getAvatarFallbackColor = (index: number) => {
    const styles = ['bg-lime/20', 'bg-sun/20', 'bg-clay/10'];
    return styles[index % styles.length];
  };

  return (
    <Card className="flex h-full flex-col rounded-xl bg-white shadow-md border-none">
      <CardContent className="flex h-full flex-col p-6">
        {/* Header: Avatar, Name, Address */}
        <div className="mb-3 flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback
              className={cn(
                'bg-forest-light text-[0.85rem] font-medium text-forest-dark',
                getAvatarFallbackColor(index),
              )}
            >
              {getInitials(grower.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-heading text-[0.92rem] font-bold text-ink">
              {grower.name || 'Unknown Grower'}
            </div>
            <div className="font-sans text-[0.74rem] text-ink-3">
              {grower.location?.address || 'No address provided'}
              {grower.location.city ? ` · ${grower.location.city}` : ''}
            </div>
          </div>
        </div>

        {/* Produce types bought from them */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {grower.produceTypesOrdered.length > 0 ? (
            grower.produceTypesOrdered.map((type, i) => (
              <Badge
                key={i}
                variant="secondary"
                className={cn('border-none px-2 py-0.5 text-xs font-normal', getPillColor(i))}
              >
                {type}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-ink-3">No recent produce data</span>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mb-4 font-sans text-[0.75rem] text-ink-3">
          Supplying since {startDate} · {grower.amountOrderedThisMonthLbs} lbs this month
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-1">
          <Button
            variant="outline-forest"
            size="sm"
            asChild
            className="h-8 px-4 text-xs font-semibold"
          >
            <Link href={`/seller/${grower.sellerId}`}>View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
