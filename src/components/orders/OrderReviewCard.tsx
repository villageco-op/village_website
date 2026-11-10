'use client';

import { Star } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { Review } from '@/lib/api/generated/models';
import { formatAppDate } from '@/lib/date-utils';

interface OrderReviewCardProps {
  review: Review;
}

/**
 * A card displaying the review left by the buyer for this order,
 * styled consistently with the application review components.
 * @param props - Component props
 * @param props.review - The review object containing rating, comment, and creation date
 * @returns A card component displaying the buyer's review details
 */
export function OrderReviewCard({ review }: OrderReviewCardProps) {
  const renderStars = (rating: number, className: string = 'h-4 w-4') => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`${className} ${
          i < rating ? 'fill-sun text-sun' : 'fill-cream-dark text-cream-dark'
        }`}
      />
    ));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="font-heading text-[0.86rem] font-bold text-ink">Your Review</div>
            {review.createdAt && (
              <div className="mt-0.5 font-sans text-[0.7rem] text-ink-3">
                {formatAppDate(review.createdAt, 'full')}
              </div>
            )}
          </div>
          <div className="flex gap-0.5">{renderStars(review.rating, 'h-4 w-4')}</div>
        </div>
        <p className="font-sans text-[0.84rem] leading-[1.7] text-ink-2">
          {review.comment || 'No comment left for this review.'}
        </p>
      </CardContent>
    </Card>
  );
}
