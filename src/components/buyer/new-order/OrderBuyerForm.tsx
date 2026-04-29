'use client';

import { Loader2, ShoppingCart, CalendarDays, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { OrderQuantityInput } from './OrderQuantityInput';
import { OrderSubscriptionToggle } from './OrderSubscriptionToggle';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddToCart } from '@/lib/api/generated/cart/cart';
import type { ProduceDetail } from '@/lib/api/generated/models';
import { useGetProduce } from '@/lib/api/generated/produce/produce';

interface BuyerOrderFormProps {
  produceId: string;
  onClose?: () => void;
}

/**
 * The new order form modal.
 * @param props - Props for the order form
 * @param props.produceId - The produce listing Id
 * @param props.onClose - Called when closed
 * @returns A small form component with order inputs
 */
export function BuyerOrderForm({ produceId, onClose }: BuyerOrderFormProps) {
  const { data: produceQuery, isLoading, error } = useGetProduce(produceId);
  const addToCartMutation = useAddToCart();

  const [quantityLbs, setQuantityLbs] = useState<number>(1);
  const [isSubscription, setIsSubscription] = useState<boolean>(false);

  const hasError = !!error || (!isLoading && (!produceQuery?.data || produceQuery.status !== 200));

  useEffect(() => {
    if (hasError) {
      toast.error('Failed to load produce details. Please try again later.');
    }
  }, [hasError]);

  if (isLoading) {
    return (
      <Card className="rounded-xl border border-forest-dark/10 shadow-sm bg-white overflow-hidden">
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-lime" />
        </div>
      </Card>
    );
  }

  // Safe defaults if data is missing
  const produce = !hasError
    ? (produceQuery?.data as ProduceDetail)
    : {
        title: 'Produce',
        totalOzInventory: 0,
        maxOrderQuantityOz: Infinity,
        pricePerOz: 0,
        harvestFrequencyDays: 7,
        isSubscribable: false,
      };
  const maxLbsInventory = Number(produce.totalOzInventory) / 16;
  const maxOrderLbs = Number(produce.maxOrderQuantityOz) / 16;
  const pricePerLb = Number(produce.pricePerOz) * 16;
  const totalPrice = pricePerLb * quantityLbs;
  const isOutOfStock = maxLbsInventory <= 0;

  const frequencyLabel =
    produce.harvestFrequencyDays === 7 ? 'weekly' : `every ${produce.harvestFrequencyDays} days`;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (isOutOfStock || hasError) return;

    try {
      const quantityOz = Math.round(quantityLbs * 16);
      await addToCartMutation.mutateAsync({
        data: {
          productId: produceId,
          quantityOz,
          isSubscription,
        },
      });
      toast.success('Added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error('Failed to add item to cart.');
    }
  };

  return (
    <Card className="rounded-xl border border-forest-dark/10 shadow-sm bg-white overflow-hidden relative">
      <CardHeader className="bg-off-white border-b border-lime/20 pb-4 pr-12">
        <CardTitle className="font-heading text-xl text-deep-forest">
          Order {produce.title}
        </CardTitle>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-forest-dark/50 hover:text-forest-dark"
            onClick={onClose}
            type="button"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </CardHeader>

      <form onSubmit={(e) => void handleSubmit(e)}>
        <CardContent
          className={`space-y-6 pt-6 ${hasError ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="flex justify-between items-center text-ink-2">
            <span className="font-semibold">Price per lb:</span>
            <span className="text-lg">${pricePerLb.toFixed(2)}</span>
          </div>

          <OrderQuantityInput
            quantityLbs={quantityLbs}
            onChange={setQuantityLbs}
            maxLbs={Math.min(maxLbsInventory, maxOrderLbs)}
          />

          {produce.isSubscribable && (
            <OrderSubscriptionToggle
              isSubscription={isSubscription}
              onChange={setIsSubscription}
              frequencyDays={produce.harvestFrequencyDays}
            />
          )}

          <div className="pt-4 border-t border-lime/20">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-lg font-heading font-bold text-deep-forest block">
                  Subtotal:
                </span>
                {isSubscription && !hasError && (
                  <span className="text-xs text-forest-dark/60 flex items-center mt-1">
                    <CalendarDays className="w-3 h-3 mr-1" />
                    Billed now and {frequencyLabel}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-deep-forest">
                  ${totalPrice.toFixed(2)}
                </span>
                {isSubscription && !hasError && (
                  <span className="text-sm font-medium text-forest-dark/70 block">
                    / {frequencyLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pb-6">
          <Button
            type="submit"
            disabled={addToCartMutation.isPending || isOutOfStock || hasError}
            className="w-full bg-lime text-forest-dark hover:bg-lime-light font-bold h-12 text-lg transition-colors"
          >
            {addToCartMutation.isPending ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <ShoppingCart className="w-5 h-5 mr-2" />
            )}
            {hasError ? 'Service Unavailable' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
