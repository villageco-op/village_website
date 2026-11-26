'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

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
  const bannerInnerRef = useRef<HTMLDivElement>(null);

  const cartGroups = cartResponse?.status === 200 ? cartResponse?.data?.data : [];
  const hasItems = cartGroups.some((g) => g.items.length > 0);

  useEffect(() => {
    const clearReservationStyles = () => {
      document.body.classList.remove('has-reservation');
      document.body.style.removeProperty('--reservation-banner-height');
    };

    if (!hasItems) {
      clearReservationStyles();
      return clearReservationStyles;
    }

    document.body.classList.add('has-reservation');
    const target = bannerInnerRef.current;

    if (!target || typeof ResizeObserver === 'undefined') {
      document.body.style.setProperty('--reservation-banner-height', '3rem');
      return clearReservationStyles;
    }

    const updateHeight = () => {
      const height = Math.round(target.getBoundingClientRect().height);
      if (height > 0) {
        document.body.style.setProperty('--reservation-banner-height', `${height}px`);
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(target);

    return () => {
      observer.disconnect();
      clearReservationStyles();
    };
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
        'grid transition-all duration-300 ease-in-out bg-[#1C3A1A]',
        hasItems
          ? 'grid-rows-[1fr] border-b border-lime/20 opacity-100'
          : 'grid-rows-[0fr] border-b-0 opacity-0 pointer-events-none',
      )}
    >
      <div className="overflow-hidden">
        <div
          ref={bannerInnerRef}
          className="mx-auto flex min-h-12 max-w-max-width items-center justify-between gap-3 px-4 sm:px-8 py-2 sm:py-0"
        >
          <span className="hidden md:block mr-4 shrink-0 font-heading text-[11px] font-bold uppercase tracking-widest text-lime">
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
    </div>
  );
}
