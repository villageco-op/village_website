'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Star, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { OrderFulfillmentType } from '@/lib/api/generated/models';
import { getGetOrderByIdQueryKey } from '@/lib/api/generated/orders/orders';
import { useCreateReview } from '@/lib/api/generated/reviews/reviews';
import { formatAppDate } from '@/lib/date-utils';

interface CreateReviewFormProps {
  sellerId: string;
  orderId: string;
  sellerName?: string | null;
  sellerImage?: string | null;
  itemNames?: string[];
  fulfillmentType?: OrderFulfillmentType;
  scheduledTime?: string;
  onClose?: () => void;
}

/**
 * A modal form component allowing buyers to rate and review a seller and order.
 * @param props - Component props
 * @param props.sellerId - The seller the order was from
 * @param props.orderId - The order being reviewed
 * @param props.sellerName - The sellers name
 * @param props.sellerImage - The sellers profile image
 * @param props.itemNames - The order item names
 * @param props.fulfillmentType - The order fulfillment type
 * @param props.scheduledTime - The order scheduled time
 * @param props.onClose - Callback for closing the form
 * @returns The form component
 */
export function CreateReviewForm({
  sellerId,
  orderId,
  sellerName = 'Seller',
  sellerImage,
  itemNames = [],
  fulfillmentType,
  scheduledTime,
  onClose,
}: CreateReviewFormProps) {
  const queryClient = useQueryClient();
  const createReviewMutation = useCreateReview();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const activeRating = hoverRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error('Please select a star rating between 1 and 5.');
      return;
    }

    const toastId = toast.loading('Submitting your review...');
    try {
      await createReviewMutation.mutateAsync({
        data: {
          sellerId,
          orderId,
          rating,
          comment: comment.trim() ? comment.trim() : undefined,
        },
      });

      await queryClient.invalidateQueries({
        queryKey: [getGetOrderByIdQueryKey(orderId)],
      });

      toast.success('Review submitted successfully! Thank you.', { id: toastId });
      if (onClose) onClose();
    } catch (err) {
      toast.error('Failed to submit review. Please try again.', { id: toastId });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const renderStars = (
    currentRating: number,
    interactive: boolean = false,
    className: string = 'h-8 w-8',
  ) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= currentRating;
      const starNode = (
        <Star
          key={starValue}
          className={`${className} transition-colors ${
            isFilled ? 'fill-sun text-sun' : 'fill-cream-dark text-cream-dark'
          }`}
        />
      );

      if (!interactive) {
        return starNode;
      }

      return (
        <button
          key={starValue}
          type="button"
          className="p-1 focus:outline-none transition-transform hover:scale-110"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          aria-label={`Rate ${starValue} stars`}
        >
          {starNode}
        </button>
      );
    });
  };

  const getFulfillmentText = () => {
    if (!scheduledTime) return null;
    const formattedDate = formatAppDate(scheduledTime, 'weekdayDayMonth');
    const actionWord = fulfillmentType === 'delivery' ? 'Delivered on' : 'Picked up on';
    return `${actionWord} ${formattedDate}`;
  };

  const fulfillmentDetails = getFulfillmentText();

  return (
    <Card className="z-50 overflow-auto max-h-screen relative max-w-[calc(100vw-2rem)] mx-auto w-full sm:max-w-md shadow-lg border-lime/20 bg-white">
      <CardHeader className="pb-4 pr-12 relative">
        <CardTitle className="font-heading text-xl font-bold text-deep-forest">
          Leave a Review
        </CardTitle>
        <p className="text-xs text-ink-3 mt-1">Share your experience with {sellerName}</p>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3"
            onClick={onClose}
            title="Close"
            type="button"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </CardHeader>

      <form onSubmit={(e) => void handleSubmit(e)}>
        <CardContent className="space-y-6 pt-2">
          <div className="p-3 rounded-xl bg-lime-pale/50 border border-lime/20 space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-lime-pale border border-lime/30">
                {sellerImage ? (
                  <AvatarImage src={sellerImage} alt={sellerName ?? undefined} />
                ) : null}
                <AvatarFallback className="bg-transparent font-heading text-xs font-extrabold text-deep-forest">
                  {getInitials(sellerName || 'Seller')}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden flex-1">
                <div className="font-heading text-sm font-bold text-ink truncate">{sellerName}</div>
                {itemNames.length > 0 && (
                  <div className="text-xs text-ink-3 truncate mt-0.5">{itemNames.join(', ')}</div>
                )}
              </div>
            </div>

            {fulfillmentDetails && (
              <div className="flex items-center gap-1.5 pt-2 border-t border-lime/10 text-xs font-medium text-forest-dark">
                <span>{fulfillmentDetails}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center space-y-2 py-2">
            <Label className="font-heading text-xs font-bold text-ink-2 uppercase tracking-wider">
              Your Rating
            </Label>
            <div className="flex items-center gap-1">
              {renderStars(activeRating, true, 'h-8 w-8')}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="font-heading text-xs font-bold text-ink-2">
              Review Comment <span className="text-ink-3 font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="comment"
              placeholder="Tell others about the quality, freshness, and overall experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none text-sm border-cream-dark focus-visible:ring-lime"
            />
          </div>
        </CardContent>

        <CardFooter className="pb-6 pt-2 flex gap-3">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={createReviewMutation.isPending}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="lime"
            className="flex-1"
            disabled={createReviewMutation.isPending}
          >
            {createReviewMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
