'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

import { useAuth } from '@/hooks/useAuth';
import type { OrderSummary } from '@/lib/api/generated/models';
import { useGetOrders } from '@/lib/api/generated/orders/orders';

interface OrderCompletionContextValue {
  currentOrder: OrderSummary | null;
  role: 'buyer' | 'seller';
  queueLength: number;
  currentIndex: number;
  dismissCurrentOrder: () => void;
  refetchOrders: () => void;
}

const OrderCompletionContext = createContext<OrderCompletionContextValue | undefined>(undefined);

/**
 * Providor for completed orders allowing consumers to present completion popups.
 * @param props - Component props
 * @param props.children - Passthrough children components
 * @returns The providor wrapping the children
 */
export function OrderCompletionProvider({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const isAuthenticated = status === 'authenticated' && !!user?.id;
  const isSeller = user?.stripeOnboardingComplete;

  const { data: ordersRes, refetch: refetchOrders } = useGetOrders(
    { role: isSeller ? 'seller' : 'buyer', status: 'paid', limit: 20 },
    { query: { enabled: isAuthenticated } },
  );

  const [dismissedOrderIds, setDismissedOrderIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const orders = useMemo(() => {
    return ordersRes?.status === 200 ? ordersRes.data?.data || [] : [];
  }, [ordersRes]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const orderQueue = useMemo(() => {
    if (!isAuthenticated) return [];

    const now = new Date();
    const queue: OrderSummary[] = [];

    for (const order of orders) {
      if (!order.scheduledTime) continue;
      if (dismissedOrderIds.includes(order.id)) continue;

      const storageKey = `order_ordered_${order.id}_${todayStr}`;
      if (typeof window !== 'undefined' && localStorage.getItem(storageKey)) {
        continue;
      }

      const scheduled = new Date(order.scheduledTime);

      if (isSeller) {
        const hoursSinceScheduled = (now.getTime() - scheduled.getTime()) / (1000 * 60 * 60);

        if (hoursSinceScheduled >= 24 && !order.sellerReport) {
          queue.push(order);
        }
      } else {
        if (scheduled <= now && !order.buyerReport) {
          queue.push(order);
        }
      }
    }

    return queue;
  }, [orders, isAuthenticated, isSeller, todayStr, dismissedOrderIds]);

  const dismissCurrentOrder = useCallback(() => {
    const current = orderQueue[currentIndex];
    if (current) {
      const storageKey = `order_ordered_${current.id}_${todayStr}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, 'true');
      }
      setDismissedOrderIds((prev) => [...prev, current.id]);
      setCurrentIndex(0);
    }
  }, [orderQueue, currentIndex, todayStr]);

  const currentOrder = orderQueue[currentIndex] || null;

  return (
    <OrderCompletionContext.Provider
      value={{
        currentOrder,
        role: isSeller ? 'seller' : 'buyer',
        queueLength: orderQueue.length,
        currentIndex,
        dismissCurrentOrder,
        refetchOrders: () => void refetchOrders(),
      }}
    >
      {children}
    </OrderCompletionContext.Provider>
  );
}

/**
 * Hook for accessing the order completion context.
 * @returns The order completion context
 */
export function useOrderCompletion() {
  const context = useContext(OrderCompletionContext);
  if (!context) {
    throw new Error('useOrderCompletion must be used within an OrderCompletionProvider');
  }
  return context;
}
