'use client';

import { Calendar, Loader2, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { OrderQuantityInput } from './OrderQuantityInput';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormErrorState } from '@/components/ui/state-displays';
import { useAddToCart } from '@/lib/api/generated/cart/cart';
import type { OrderDetailResponseItemsItem } from '@/lib/api/generated/models';
import { useGetOrderById } from '@/lib/api/generated/orders/orders';

interface ReorderFormProps {
  orderId: string;
  onClose: () => void;
}

/**
 * The order form modal for reordering a set of products.
 * @param props - Props for the order form
 * @param props.orderId - The order Id
 * @param props.onClose - Called when closed
 * @returns A small form component with order inputs
 */
export function ReorderForm({ orderId, onClose }: ReorderFormProps) {
  const { data: orderRes, isLoading, error, refetch } = useGetOrderById(orderId);

  if (isLoading) {
    return (
      <Card className="rounded-xl border border-forest-dark/10 shadow-sm bg-white overflow-hidden">
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-lime" />
        </div>
      </Card>
    );
  }

  const hasError = !!error || !orderRes?.data || orderRes.status !== 200;

  if (hasError) {
    return (
      <div className="w-full max-w-lg sm:max-w-md mx-auto">
        <FormErrorState
          title="Failed to load order details"
          description="We couldn't retrieve the items from this order."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return <ReorderFormContent items={orderRes.data.items} onClose={onClose} />;
}

function ReorderFormContent({
  items,
  onClose,
}: {
  items: OrderDetailResponseItemsItem[];
  onClose: () => void;
}) {
  const addToCartMutation = useAddToCart();

  const getItemAvailability = (item: OrderDetailResponseItemsItem) => {
    const now = new Date();
    const start = new Date(item.produceSeasonStart);
    const end = new Date(item.produceSeasonEnd);
    const availableBy = new Date(item.produceAvailableBy);

    const isInSeason = now >= start && now <= end;
    const isActive = item.produceStatus === 'active';
    const isFutureAvailability = availableBy > now;

    return {
      isInSeason,
      isActive,
      isFutureAvailability,
      isOrderable: isInSeason && isActive,
      availableDateStr: availableBy.toLocaleDateString(),
    };
  };

  const [itemsState, setItemsState] = useState<
    Record<string, { quantityLbs: number; selected: boolean }>
  >(() => {
    const initialStore: Record<string, { quantityLbs: number; selected: boolean }> = {};
    items.forEach((item) => {
      const { isOrderable } = getItemAvailability(item);
      initialStore[item.productId] = {
        quantityLbs: Math.max(0, parseFloat(item.quantityOz) / 16),
        selected: isOrderable,
      };
    });
    return initialStore;
  });

  const selectedItems = items.filter((item) => itemsState[item.productId]?.selected);

  const totalPrice = selectedItems.reduce((acc, item) => {
    const pricePerLb = Number(item.pricePerOz) * 16;
    const qty = itemsState[item.productId]?.quantityLbs || 0;
    return acc + pricePerLb * qty;
  }, 0);

  const handleToggleItem = (productId: string, isOrderable: boolean) => {
    if (!isOrderable) return;

    setItemsState((prev) => {
      const currentItem = prev[productId];
      const newSelected = currentItem ? !currentItem?.selected : true;

      return {
        ...prev,
        [productId]: { ...currentItem, selected: newSelected },
      };
    });
  };

  const handleQuantityChange = (productId: string, val: number) => {
    setItemsState((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], quantityLbs: val },
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item.');
      return;
    }

    try {
      // Add each selected item to cart
      await Promise.all(
        selectedItems.map((item) =>
          addToCartMutation.mutateAsync({
            data: {
              productId: item.productId,
              quantityOz: Math.round(itemsState[item.productId].quantityLbs * 16),
              isSubscription: false,
            },
          }),
        ),
      );
      toast.success('Items added to cart!');
      onClose();
    } catch (err) {
      toast.error('Failed to add items to cart.');
    }
  };

  return (
    <Card className="z-50 rounded-xl border border-forest-dark/10 shadow-lg bg-white overflow-hidden relative max-h-[90vh] flex flex-col w-full max-w-lg sm:max-w-md mx-auto">
      <CardHeader className="bg-off-white border-b border-lime/20 pb-4 pr-12">
        <CardTitle className="font-heading text-xl text-deep-forest">Reorder Items</CardTitle>
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>

      <form onSubmit={(e) => void handleSubmit(e)} className="overflow-y-auto flex-1">
        <CardContent className="space-y-4 pt-6">
          {items.map((item) => {
            const { isInSeason, isOrderable, availableDateStr, isFutureAvailability } =
              getItemAvailability(item);
            const pricePerLb = Number(item.pricePerOz) * 16;
            const inventoryOz = parseFloat(item.produceTotalOzInventory);
            const limitOz = item.maxOrderQuantityOz
              ? parseFloat(item.maxOrderQuantityOz)
              : inventoryOz;
            const maxLbs = Math.min(inventoryOz, limitOz) / 16;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg border transition-colors ${!isOrderable ? 'bg-slate-100 opacity-75' : 'bg-slate-50/50 border-border'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      id={`check-${item.id}`}
                      disabled={!isOrderable}
                      checked={!!itemsState[item.productId]?.selected && isOrderable}
                      onCheckedChange={() => handleToggleItem(item.productId, isOrderable)}
                    />
                    <div className="min-w-0">
                      <Label
                        htmlFor={`check-${item.id}`}
                        className={`font-bold block truncate ${isOrderable ? 'text-deep-forest cursor-pointer' : 'text-slate-500'}`}
                      >
                        {item.productName}
                      </Label>
                      <div className="text-xs text-slate-500 font-medium">
                        ${pricePerLb.toFixed(2)} / lb
                      </div>
                      {!isInSeason && (
                        <Badge variant="destructive" className="mt-1 text-[10px] uppercase">
                          Not In Season
                        </Badge>
                      )}
                      {isFutureAvailability && isOrderable && (
                        <div className="flex items-center text-amber-600 text-[10px] mt-1">
                          <Calendar className="w-3 h-3 mr-1" /> Available {availableDateStr}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`w-full sm:w-32 ${itemsState[item.productId]?.selected ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}
                  >
                    <OrderQuantityInput
                      quantityLbs={itemsState[item.productId]?.quantityLbs || 0}
                      onChange={(val) => handleQuantityChange(item.productId, val)}
                      maxLbs={maxLbs}
                    />
                    <p className="text-[10px] text-slate-500 mt-1 text-right sm:text-left">
                      Max: {maxLbs.toFixed(1)} lbs
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>

        <CardFooter className="flex-col gap-4 pt-4 pb-6 border-t border-border sticky bottom-0 bg-white">
          <div className="w-full flex justify-between items-center px-1">
            <span className="font-heading font-bold text-deep-forest">Estimated Total:</span>
            <span className="text-xl font-bold text-deep-forest">${totalPrice.toFixed(2)}</span>
          </div>

          <Button
            type="submit"
            disabled={addToCartMutation.isPending || selectedItems.length === 0}
            className="w-full bg-lime text-forest-dark hover:bg-lime-light font-bold h-12"
          >
            {addToCartMutation.isPending ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <ShoppingCart className="w-5 h-5 mr-2" />
            )}
            Add {selectedItems.length} items to Cart
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
