'use client';

import React from 'react';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { OrderSummary } from '@/lib/api/generated/models';
import { getFulfillmentText } from '@/lib/order-utils';
import { getInitials } from '@/lib/user-utils';

interface OrderCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  currentIndex: number;
  totalCount: number;
  order: OrderSummary;
  children: React.ReactNode;
}

/**
 * Dialog for reporting a paid and passed order.
 * @param props - Component props
 * @param props.isOpen - Is the dialogue open
 * @param props.onClose - Callback for closing the dialog
 * @param props.title - The display title
 * @param props.description - The display description
 * @param props.currentIndex - The order queue index
 * @param props.totalCount - The total number of orders in the queue
 * @param props.order - The order information
 * @param props.children - Passthrough cildren components
 * @returns A dialog component
 */
export function OrderCompletionDialog({
  isOpen,
  onClose,
  title,
  description,
  totalCount,
  order,
  children,
}: OrderCompletionDialogProps) {
  const counterpartyName = order.counterparty?.name || 'N/A';
  const counterpartyImage = order.counterparty?.image;
  const itemNames = order.items.map((item) => item.product.title) || [];
  const fulfillmentDetails = getFulfillmentText(order.fulfillmentType, order.scheduledTime);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-ink-3">
              {totalCount} pending confirmation{totalCount > 1 && 's'}
            </span>
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {order && (
          <div className="p-3 rounded-xl bg-lime-pale/50 border border-lime/20 space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-lime-pale border border-lime/30">
                {counterpartyImage ? (
                  <AvatarImage src={counterpartyImage} alt={counterpartyName} />
                ) : null}
                <AvatarFallback className="bg-transparent font-heading text-xs font-extrabold text-deep-forest">
                  {getInitials(counterpartyName)}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden flex-1">
                <div className="font-heading text-sm font-bold text-ink truncate">
                  {counterpartyName}
                </div>
                {itemNames.length > 0 && (
                  <div className="text-xs text-ink-3 truncate mt-0.5">{itemNames.join(', ')}</div>
                )}
              </div>
            </div>

            {fulfillmentDetails && (
              <div className="flex items-center gap-1.5 pt-2 border-t border-lime/10 text-xs font-medium text-forest-dark">
                <span>{fulfillmentDetails}</span>
              </div>
            )}
          </div>
        )}

        <div className="my-4 space-y-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
