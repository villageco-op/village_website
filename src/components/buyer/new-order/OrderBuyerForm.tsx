'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Loader2, CalendarDays, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { OrderQuantityInput } from './OrderQuantityInput';
import { OrderSubscriptionToggle } from './OrderSubscriptionToggle';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { FormErrorState } from '@/components/ui/state-displays';
import { getGetCartQueryKey, useAddToCart } from '@/lib/api/generated/cart/cart';
import type { ProduceDetails } from '@/lib/api/generated/models';
import { useGetProduce } from '@/lib/api/generated/produce/produce';

interface BuyerOrderFormProps {
  produceId: string;
  onClose?: () => void;
  initialQuantityOz?: number;
  initialIsSubscription?: boolean;
}

/**
 * The new order form modal.
 * @param props - Props for the order form
 * @param props.produceId - The produce listing Id
 * @param props.onClose - Called when closed
 * @param props.initialQuantityOz - Start with a quantity entered
 * @param props.initialIsSubscription - Start with isSubscription set
 * @returns A small form component with order inputs
 */
export function BuyerOrderForm({
  produceId,
  onClose,
  initialQuantityOz,
  initialIsSubscription,
}: BuyerOrderFormProps) {
  const { data: produceQuery, isLoading, error, refetch } = useGetProduce(produceId);
  const addToCartMutation = useAddToCart();
  const queryClient = useQueryClient();

  const [quantityOz, setQuantityOz] = useState<number>(initialQuantityOz || 1);
  const [isSubscription, setIsSubscription] = useState<boolean>(initialIsSubscription || false);

  const hasError = !!error || (!isLoading && (!produceQuery?.data || produceQuery.status !== 200));

  useEffect(() => {
    if (hasError) {
      toast.error('Failed to load produce details. Please try again later.');
    }
  }, [hasError]);

  if (isLoading) {
    return (
      <Card>
        <LoadingSkeleton />
      </Card>
    );
  }

  if (hasError && !isLoading) {
    return (
      <div className="w-full max-w-lg sm:max-w-md mx-auto">
        <FormErrorState
          title="Failed to load order details"
          description="We couldn't retrieve the information for this order. The service might be temporarily unavailable."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  // Safe defaults if data is missing
  const produce = !hasError
    ? (produceQuery?.data as ProduceDetails)
    : {
        title: 'Produce',
        totalOzInventory: 0,
        maxOrderQuantityOz: Infinity,
        pricePerOz: 0,
        harvestFrequencyDays: 7,
        isSubscribable: false,
      };
  const maxOzInventory = Number(produce.totalOzInventory);
  const maxOrderOz = Number(produce.maxOrderQuantityOz);
  const pricePerOz = Number(produce.pricePerOz);
  const totalPrice = pricePerOz * quantityOz;
  const isOutOfStock = maxOzInventory <= 0;

  const frequencyLabel =
    produce.harvestFrequencyDays === 7 ? 'weekly' : `every ${produce.harvestFrequencyDays} days`;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (isOutOfStock || hasError) return;

    try {
      await addToCartMutation.mutateAsync({
        data: {
          productId: produceId,
          quantityOz,
          isSubscription,
        },
      });
      toast.success('Added to cart!');
      void queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      if (onClose) onClose();
    } catch (err) {
      toast.error('Failed to add item to cart.');
    }
  };

  return (
    <Card className="z-50 overflow-auto max-h-screen relative max-w-[calc(100vw-2rem)] mx-auto w-full sm:max-w-md">
      <CardHeader className="pb-4 pr-12">
        <CardTitle>Order {produce.title}</CardTitle>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
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
            <span className="font-semibold">Price per oz:</span>
            <span className="text-lg">${pricePerOz.toFixed(2)}</span>
          </div>

          <OrderQuantityInput
            quantityOz={quantityOz}
            onChange={setQuantityOz}
            maxOz={Math.min(maxOzInventory, maxOrderOz)}
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
            variant="lime"
            disabled={addToCartMutation.isPending || isOutOfStock || hasError}
            className="w-full"
          >
            {addToCartMutation.isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            {hasError ? 'Service Unavailable' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
