'use client';

import { ShoppingCart } from 'lucide-react';

import { Button } from '../ui/button';

import { useCartData, useCartUI } from '@/hooks/useCartUI';
import { cn } from '@/lib/utils';

/**
 * A button in the bottom right that opens the cart drawer.
 * @returns A floating button component
 */
export function CartFab() {
  const { openCart } = useCartUI();
  const { data: cartResponse, isError } = useCartData();

  if (isError || cartResponse?.status !== 200) {
    return null;
  }

  const cartGroups = cartResponse?.data?.data || [];
  const totalItems = cartGroups.reduce((acc, group) => acc + group.items.length, 0);

  const isVisible = totalItems > 0;

  return (
    <Button
      variant="forest"
      onClick={openCart}
      className={cn(
        'fixed bottom-7 right-7 z-900 h-auto gap-2.5 rounded-full px-5 py-3.5 font-heading text-[14px] shadow-[0_8px_32px_rgba(42,75,40,0.35)]',
        isVisible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-10 opacity-0',
      )}
    >
      <ShoppingCart className="h-4 w-4" />
      View Cart
      <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-extrabold leading-tight text-black">
        {totalItems}
      </span>
    </Button>
  );
}
