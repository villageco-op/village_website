'use client';

import { Copy, Filter } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import type { SubscriptionDetailResponse } from '@/lib/api/generated/models';
import { formatAppDate } from '@/lib/date-utils';
import { getInitials } from '@/lib/user-utils';
import { cn } from '@/lib/utils';

interface SellerSubscriptionCardProps {
  subscription: SubscriptionDetailResponse;
  index: number;
  onFilterBuyer?: (id: string) => void;
  onFilterProduct?: (id: string) => void;
}

/**
 * Card for displaying information about a single subscription from the seller's perspective.
 * @param props - Props containing the subscription data
 * @param props.subscription - The subscription payload
 * @param props.index - Array index used for styling the fallback avatar
 * @param props.onFilterBuyer - When the buyer ID filter is changed
 * @param props.onFilterProduct - When teh product ID filter is changed
 * @returns A card containing a snapshot of the subscription
 */
export function SellerSubscriptionCard({
  subscription,
  index,
  onFilterBuyer,
  onFilterProduct,
}: SellerSubscriptionCardProps) {
  const nextDelivery = formatAppDate(subscription.nextDeliveryDate, 'full', 'Pending');

  const buyerName = subscription.buyer?.name || 'Unknown Buyer';
  const buyerId = subscription.buyer?.id || '';
  const productTitle = subscription.product?.title || 'Unknown Product';
  const productId = subscription.product?.id || '';

  const handleCopy = (e: React.MouseEvent, text: string, label: string) => {
    e.preventDefault();
    if (text) {
      navigator.clipboard.writeText(text).catch(() => {
        toast.error(`Failed to copy ${label} to clipboard`);
      });
      toast.success(`${label} copied to clipboard`);
    }
  };

  const getAvatarFallbackColor = (index: number) => {
    const styles = ['bg-lime/20', 'bg-sun/20', 'bg-clay/10', 'bg-sky-100'];
    return styles[index % styles.length];
  };

  return (
    <Card className="group flex h-full flex-col rounded-xl border border-forest-dark/10 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex h-full flex-col p-6">
        {/* Header: Avatar, Product, Buyer & Status */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback
                className={cn(
                  'text-[0.85rem] font-semibold text-ink',
                  getAvatarFallbackColor(index),
                )}
              >
                {getInitials(buyerName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <div className="line-clamp-1 font-heading text-[0.92rem] font-bold text-ink">
                  {productTitle}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button
                    onClick={(e) => handleCopy(e, productId, 'Product ID')}
                    className="cursor-pointer text-ink-3 hover:text-forest"
                    size="xs"
                    variant="ghost"
                    title="Copy Product ID"
                  >
                    <Copy size={12} />
                  </Button>
                  <Button
                    onClick={() => onFilterProduct?.(productId)}
                    className="cursor-pointer text-ink-3 hover:text-forest"
                    size="xs"
                    variant="ghost"
                    title="Filter by Product"
                  >
                    <Filter size={12} />
                  </Button>
                </div>
              </div>
              {/* Buyer Name Row */}
              <div className="flex items-center gap-2 font-sans text-[0.74rem] text-ink-3">
                <span className="truncate">
                  Subscribed by <span className="font-medium text-ink/80">{buyerName}</span>
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button
                    onClick={(e) => handleCopy(e, buyerId, 'Buyer ID')}
                    className="cursor-pointer text-ink-3 hover:text-forest"
                    size="xs"
                    variant="ghost"
                    title="Copy Buyer ID"
                  >
                    <Copy size={12} />
                  </Button>
                  <Button
                    onClick={() => onFilterBuyer?.(buyerId)}
                    className="cursor-pointer text-ink-3 hover:text-forest"
                    variant="ghost"
                    size="xs"
                    title="Filter by Buyer"
                  >
                    <Filter size={12} />
                  </Button>
                </div>
              </div>
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
            <Link href={`/seller/subscriptions/${subscription.id}`}>Manage Subscription</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
