'use client';

import { User as UserIcon, Star } from 'lucide-react';
import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { InlineErrorState } from '@/components/ui/state-displays';
import type { SellerReviewItem } from '@/lib/api/generated/models';
import { useGetSellerReviews } from '@/lib/api/generated/users/users';
import { formatAppDate } from '@/lib/date-utils';

/**
 * List of reviews associated with this specific listing.
 * @param props - The props for the produce reviews card
 * @param props.sellerId - The seller Id
 * @param props.produceId - The produce Id
 * @returns A card containing a list of reviews
 */
export default function ProduceReviews({
  sellerId,
  produceId,
}: {
  sellerId: string;
  produceId: string;
}) {
  const {
    data: reviewsRes,
    isLoading,
    isError,
    refetch,
  } = useGetSellerReviews(sellerId, { productId: produceId, limit: 5 });

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  if (isError || reviewsRes?.status !== 200) {
    return <InlineErrorState title="Failed to load reviews." onRetry={() => void refetch()} />;
  }

  const reviews = reviewsRes?.data?.reviews || [];

  return (
    <Card className="rounded-xl border border-forest-dark/10 bg-white shadow-sm">
      <CardHeader className="p-6 border-b border-border/50">
        <CardTitle className="font-heading text-xl font-bold text-deep-forest">
          Product Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-8 h-8 text-slate-200 mx-auto mb-3" />
            <p className="text-ink-3 text-sm">
              No reviews yet for this product. Be the first to order and review!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review: SellerReviewItem) => (
              <div
                key={review.id}
                className="border-b border-border/50 last:border-0 pb-6 last:pb-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
                      {review.buyer?.image ? (
                        <Image
                          src={review.buyer.image as string}
                          alt="Buyer"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <UserIcon className="w-4 h-4 text-ink-3" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-ink">
                        {review.buyer?.name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-ink-3">
                        {formatAppDate(review.createdAt, 'short', '')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-ink mt-3 bg-slate-50 p-3 rounded-lg">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
