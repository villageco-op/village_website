'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '../ui/button';

import { ReservationTimerChip } from './ReservationTimerChip';

import { useCartData, useCartUI } from '@/hooks/useCartUI';
import { cn } from '@/lib/utils';

/**
 * A banner for displaying there are items in the cart and the timer.
 * @returns A horizontal banner component
 */
export function ReservationBanner() {
  const { openCart } = useCartUI();
  const { data: cartResponse, isError, isLoading } = useCartData();

  const cartGroups = cartResponse?.status === 200 ? cartResponse?.data?.data : [];
  const hasItems = cartGroups.some((g) => g.items.length > 0);

  useEffect(() => {
    if (hasItems) {
      document.body.classList.add('has-reservation');
    } else {
      document.body.classList.remove('has-reservation');
    }
    return () => document.body.classList.remove('has-reservation');
  }, [hasItems]);

  if (isLoading) {
    return null;
  }

  if (isError || cartResponse?.status !== 200) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed left-0 right-0 top-16 z-800 border-b border-lime/20 bg-[#1C3A1A] transition-all duration-300',
        hasItems
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-full opacity-0',
      )}
    >
      <div className="mx-auto flex min-h-12 max-w-max-width items-center justify-between gap-3 px-4 sm:px-8 py-2 sm:py-0">
        <span className="hidden md:block mr-4 shrink-0 font-heading text-[11px] font-bold uppercase tracking-widest text-lime/60">
          Reserved
        </span>

        <div className="flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {cartGroups.map((group) => {
            if (!group.items.length) return null;
            // Get the closest expiring item for this seller group
            const expirations = group.items.map((i) => new Date(i.expiresAt).getTime());
            const closestExpiration = Math.min(...expirations);

            return (
              <ReservationTimerChip
                key={group.seller.id}
                sellerName={group.seller.name}
                expiresAt={closestExpiration}
              />
            );
          })}
        </div>

        <Button
          variant="lime"
          size="sm"
          onClick={openCart}
          className="ml-auto rounded-full border border-lime/25 bg-lime/10 px-3.5 font-heading text-[11.5px] text-lime shadow-none hover:bg-lime/20"
        >
          <span className="hidden sm:inline mr-1">View cart</span>
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
