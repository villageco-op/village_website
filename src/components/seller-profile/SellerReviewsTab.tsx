'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

import { Eyebrow } from '../ui/eyebrow';

import { SellerReviewCardSkeleton } from './SellerProfileSkeletons';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePagination } from '@/hooks/usePagination';
import type {
  PublicUserProfile,
  GetSellerReviewsSortBy,
  GetSellerReviewsSortOrder,
} from '@/lib/api/generated/models';
import { useGetSellerReviews } from '@/lib/api/generated/users/users';
import { formatAppDate } from '@/lib/date-utils';

interface SellerReviewsTabProps {
  sellerId: string;
  profile: PublicUserProfile;
}

/**
 * The tab for viewing overall rating stats and a list of reviews.
 * @param props - Props for the seller reviews tab
 * @param props.sellerId - The seller Id
 * @param props.profile - The seller profile information
 * @returns The seller reviews tab component
 */
export default function SellerReviewsTab({ sellerId, profile }: SellerReviewsTabProps) {
  const { page, limit, setPage } = usePagination(10);

  const [sortOption, setSortOption] = useState('recent');

  let sortBy: GetSellerReviewsSortBy = 'createdAt';
  let sortOrder: GetSellerReviewsSortOrder = 'desc';

  if (sortOption === 'oldest') {
    sortBy = 'createdAt';
    sortOrder = 'asc';
  } else if (sortOption === 'rating_high') {
    sortBy = 'rating';
    sortOrder = 'desc';
  } else if (sortOption === 'rating_low') {
    sortBy = 'rating';
    sortOrder = 'asc';
  }

  const { data: response, isLoading } = useGetSellerReviews(sellerId, {
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const reviews = response?.data?.reviews || [];
  const meta = response?.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

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

  const getPercentage = (count: number) => {
    return profile.totalReviews > 0 ? (count / profile.totalReviews) * 100 : 0;
  };

  return (
    <div>
      <div className="mb-9 grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr] md:items-center">
        {/* Rating Overview */}
        <div className="rounded-2xl bg-deep-forest p-7 text-center shadow-sm">
          <div className="font-heading text-6xl font-extrabold leading-none tracking-tight text-lime">
            {profile.starRating.toFixed(1)}
          </div>
          <div className="my-3 flex justify-center gap-1">
            {renderStars(Math.round(profile.starRating), 'h-5 w-5')}
          </div>
          <div className="font-sans text-[0.74rem] text-cream/60">
            Based on {profile.totalReviews} reviews
          </div>
        </div>

        {/* Rating Breakdown */}
        <div>
          <h4 className="mb-3.5 font-heading text-[0.8rem] font-bold text-ink">Rating Breakdown</h4>
          <div className="flex flex-col gap-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2.5">
                <span className="w-8 shrink-0 text-right font-heading text-[0.72rem] font-bold text-ink-3">
                  {star} <Star className="inline mb-0.5 h-2.5 w-2.5 fill-current" />
                </span>
                <Progress
                  value={getPercentage(
                    profile.reviewBreakdown[
                      star.toString() as keyof typeof profile.reviewBreakdown
                    ],
                  )}
                  className={`h-2 flex-1 bg-cream-dark [&>div]:${
                    star >= 4 ? 'bg-lime' : star === 3 ? 'bg-sun' : 'bg-ink-3'
                  }`}
                />
                <span className="w-5 shrink-0 font-sans text-[0.7rem] text-ink-3">
                  {profile.reviewBreakdown[star.toString() as keyof typeof profile.reviewBreakdown]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List & Filters */}
      <div className="mb-4 flex items-center justify-between border-t border-cream-dark pt-8">
        <Eyebrow>Reviews</Eyebrow>
        <Select
          value={sortOption}
          onValueChange={(val) => {
            setSortOption(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-45 bg-white h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="rating_high">Highest Rating</SelectItem>
            <SelectItem value="rating_low">Lowest Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <>
            <SellerReviewCardSkeleton />
            <SellerReviewCardSkeleton />
            <SellerReviewCardSkeleton />
          </>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <Card
              key={String(review.id)}
              className="rounded-2xl border-1.5 border-cream-dark p-6 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 bg-lime-pale">
                    <AvatarFallback className="bg-transparent font-heading text-xs font-extrabold text-click-green">
                      {review.buyer?.name ? review.buyer.name.substring(0, 2).toUpperCase() : 'B'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-heading text-[0.86rem] font-bold text-ink">
                      {review.buyer?.name || 'Anonymous Buyer'}
                    </div>
                    <div className="mt-0.5 font-sans text-[0.7rem] text-ink-3">
                      {formatAppDate(review.createdAt, 'full')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5">{renderStars(review.rating, 'h-3.5 w-3.5')}</div>
              </div>
              <p className="font-sans text-[0.84rem] leading-[1.7] text-ink-2">
                {review.comment || 'No comment left for this review.'}
              </p>
            </Card>
          ))
        ) : (
          <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-cream-dark bg-white text-ink-3">
            No reviews match the selected filters.
          </div>
        )}
      </div>

      {!isLoading && reviews.length > 0 && (
        <div className="mt-6">
          <PaginationControls meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
