'use client';

import Link from 'next/link';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import type { SubscriptionDetailResponse } from '@/lib/api/generated/models';
import { getInitials } from '@/lib/user-utils';
import { cn } from '@/lib/utils';

interface SubscriptionCardProps {
  subscription: SubscriptionDetailResponse;
  index: number;
}

/**
 * Card for displaying information about a single subscription.
 * @param props - Props containing the subscription data
 * @param props.subscription - The subscription payload
 * @param props.index - Array index used for styling the fallback avatar
 * @returns A card containing a snapshot of the subscription
 */
export function SubscriptionCard({ subscription, index }: SubscriptionCardProps) {
  const nextDelivery = subscription.nextDeliveryDate
    ? new Date(subscription.nextDeliveryDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Pending';

  const sellerName = subscription.seller?.name || 'Unknown Grower';
  const productTitle = subscription.product?.title || 'Unknown Product';

  const getAvatarFallbackColor = (index: number) => {
    const styles = ['bg-lime/20', 'bg-sun/20', 'bg-clay/10'];
    return styles[index % styles.length];
  };

  return (
    <Card className="flex h-full flex-col rounded-xl border-none bg-white shadow-md transition-shadow hover:shadow-lg">
      <CardContent className="flex h-full flex-col p-6">
        {/* Header: Avatar, Product, Seller & Status */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback
                className={cn(
                  'bg-forest-light text-[0.85rem] font-medium text-forest-dark',
                  getAvatarFallbackColor(index),
                )}
              >
                {getInitials(sellerName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="line-clamp-1 font-heading text-[0.92rem] font-bold text-ink">
                {productTitle}
              </div>
              <div className="font-sans text-[0.74rem] text-ink-3">from {sellerName}</div>
            </div>
          </div>
          <StatusPill status={subscription.status} />
        </div>

        {/* Subscription Details */}
        <div className="mb-4 space-y-1.5 font-sans text-[0.8rem] text-ink-3">
          <div className="flex justify-between">
            <span className="font-medium text-ink/80">Quantity:</span>
            <span>{subscription.quantityOz} oz</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-ink/80">Fulfillment:</span>
            <span className="capitalize">{subscription.fulfillmentType}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-ink/80">Next Date:</span>
            <span>{nextDelivery}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex pt-2">
          <Button
            variant="outline-forest"
            size="sm"
            asChild
            className="w-full text-xs font-semibold"
          >
            <Link href={`/subscriptions/${subscription.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
