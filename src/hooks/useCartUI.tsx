'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useGetCart } from '@/lib/api/generated/cart/cart';

interface CartContextValue {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setIsOpen: (open: boolean) => void;
  showErrorToast: (message?: string) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

/**
 * Provides Cart UI state (open/close) and error notification logic.
 * @param props - Cart provider props
 * @param props.children - The child components
 * @returns The cart context
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const TOAST_ERROR_ID = 'cart_error_toast';

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const showErrorToast = (message?: string) => {
    const errorMessage = 'An error occured while loading the cart.';
    toast.error(message || errorMessage, { id: TOAST_ERROR_ID });
  };

  return (
    <CartContext.Provider value={{ isOpen, openCart, closeCart, setIsOpen, showErrorToast }}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * Hook to consume the Cart UI context.
 * @throws Error if used outside of CartProvider.
 * @returns UI state and control functions.
 */
export function useCartUI() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartUI must be used within a CartProvider');
  }
  return context;
}

/**
 * Hook to fetch cart data with built-in error side effects.
 * @returns The result of the useGetCart query.
 */
export function useCartData() {
  const query = useGetCart();
  const { showErrorToast } = useCartUI();

  useEffect(() => {
    if (query.isError || (query.data && query.data.status !== 200)) {
      showErrorToast();
    }
  }, [query.isError, query.data, query.data?.status, showErrorToast]);

  return query;
}
