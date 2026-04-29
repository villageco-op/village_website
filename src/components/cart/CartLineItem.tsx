'use client';

import { Loader2, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

import type { CartItem } from '@/lib/api/generated/models/cartItem';
import type { UpdateCartPayload } from '@/lib/api/generated/models/updateCartPayload';
import { cn } from '@/lib/utils';

interface CartLineItemProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: UpdateCartPayload) => void;
  isPending: boolean;
  isUpdating: boolean;
}

/**
 * An item within a cart group. Contains controls for updating the item.
 * @param props - Props for the cart line item
 * @param props.item - The cart item
 * @param props.onRemove - When remove is triggered
 * @param props.onUpdate - When a field is updated
 * @param props.isPending - Is the cart item submitting
 * @param props.isUpdating - Is the cart item updating
 * @returns A cart line item with controls and an image
 */
export function CartLineItem({
  item,
  onRemove,
  onUpdate,
  isPending,
  isUpdating,
}: CartLineItemProps) {
  const [localQtyOz, setLocalQtyOz] = useState(Number(item.quantityOz));

  const [prevQtyOz, setPrevQtyOz] = useState(Number(item.quantityOz));
  if (Number(item.quantityOz) !== prevQtyOz) {
    setPrevQtyOz(Number(item.quantityOz));
    setLocalQtyOz(Number(item.quantityOz));
  }

  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (localQtyOz === Number(item.quantityOz)) return;

    const timer = setTimeout(() => {
      onUpdateRef.current(item.reservationId, { quantityOz: localQtyOz });
    }, 500);

    return () => clearTimeout(timer);
  }, [localQtyOz, item.quantityOz, item.reservationId]);

  const handleIncrement = () => setLocalQtyOz((prev) => prev + 16);
  const handleDecrement = () => setLocalQtyOz((prev) => Math.max(16, prev - 16));

  const qtyLbs = localQtyOz / 16;
  const priceNum = Number(item.pricePerOz) * 16;
  const lineTotal = Number(item.pricePerOz) * localQtyOz;
  const imageUrl = item.images?.[0];
  const isSubscribable =
    item.isSubscribable &&
    item.subscriptionFrequencyDays !== null &&
    item.subscriptionFrequencyDays > 0;

  return (
    <div className="flex flex-col border-b border-cream-dark last:border-none">
      <div className="flex items-center gap-3 p-3.5 sm:px-4.5">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded bg-cream text-xl">
          {imageUrl ? (
            <Image
              width={32}
              height={32}
              src={imageUrl}
              alt={item.title}
              className={cn(
                'h-full w-full object-cover transition-opacity',
                isUpdating && 'opacity-40',
              )}
            />
          ) : (
            <span className={cn(isUpdating && 'opacity-40')}>🌿</span>
          )}

          {/* Centralized Spinner */}
          {isUpdating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-click-green" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 truncate font-heading text-[0.85rem] font-bold text-ink">
            {item.title}
          </div>
          <div className="mt-0.5 flex gap-2 font-sans text-[0.72rem] text-ink-3">
            <span>${priceNum.toFixed(2)}/lb</span>
            {item.isSubscription && item.subscriptionCostReductionPercent && (
              <span className="font-bold text-lime">
                ({item.subscriptionCostReductionPercent}% off)
              </span>
            )}
          </div>
        </div>

        {/* Cart Qty Controls */}
        <div className="flex shrink-0 items-center gap-1.5 px-2">
          <Button
            variant="outline"
            size="icon-xs"
            className="rounded-full border-cream-dark bg-white text-ink-2 hover:border-deep-forest hover:bg-cream disabled:opacity-50"
            onClick={handleDecrement}
            title="Decrease quantity"
            disabled={localQtyOz <= 16} // Disable if at 1lb minimum
          >
            <Minus className="size-3" />
          </Button>
          <span className="min-w-7 text-center font-heading text-[0.82rem] font-bold">
            {qtyLbs}
          </span>
          <Button
            variant="outline"
            size="icon-xs"
            className="rounded-full border-cream-dark bg-white text-ink-2 hover:border-deep-forest hover:bg-cream"
            onClick={handleIncrement}
            title="Increase quantity"
          >
            <Plus className="size-3" />
          </Button>
        </div>

        {/* Pricing & Remove */}
        <div className="flex shrink-0 flex-col items-end gap-1 text-right">
          <div
            className={cn(
              'whitespace-nowrap font-heading text-[0.88rem] font-extrabold text-deep-forest transition-opacity duration-200',
              isUpdating ? 'opacity-30' : 'opacity-100',
            )}
          >
            ${lineTotal.toFixed(2)}
          </div>
          <Button
            variant="link"
            size="xs"
            onClick={() => onRemove(item.reservationId)}
            disabled={isPending || isUpdating}
            className="h-auto p-0 font-heading text-[0.65rem] text-ink-3 hover:text-brick hover:no-underline"
          >
            Remove
          </Button>
        </div>
      </div>

      {/* Subscription Toggle Row */}
      {isSubscribable && (
        <div className="flex items-center bg-off-white/30 px-3.5 pb-3 sm:px-4.5">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`sub-${item.reservationId}`}
              checked={!!item.isSubscription}
              onCheckedChange={(checked) =>
                onUpdate(item.reservationId, { isSubscription: !!checked })
              }
              disabled={isUpdating}
              className="border-cream-dark data-[state=checked]:bg-lime data-[state=checked]:text-white"
            />
            <Label
              htmlFor={`sub-${item.reservationId}`}
              className={cn(
                'cursor-pointer font-sans text-[0.75rem] text-ink-2 transition-opacity hover:text-ink',
                isUpdating && 'pointer-events-none opacity-50',
              )}
            >
              Subscribe & Save (Every {item.subscriptionFrequencyDays || 7} days)
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}
