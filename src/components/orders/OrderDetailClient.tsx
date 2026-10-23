'use client';

import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { CancellationReasonBanner } from './CancellationReasonBanner';
import { CancelOrderDialog } from './CancelOrderDialog';
import { OrderItemsCard } from './OrderItemsCard';
import { OrderLocationCard } from './OrderLocationCard';
import { OrderSummaryCard } from './OrderSummaryCard';
import { RescheduleOrderDialog } from './RescheduleOrderDialog';

import { ReorderForm } from '@/components/buyer/new-order/ReorderForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PageHeader } from '@/components/ui/page-header';
import type { OrderDetailResponse } from '@/lib/api/generated/models';
import { useCancelOrder, useRescheduleOrder } from '@/lib/api/generated/orders/orders';
import { formatAppDate } from '@/lib/date-utils';

interface OrderDetailClientProps {
  order: OrderDetailResponse;
  isSeller: boolean;
}

/**
 * Client component that fetches and displays a specific order.
 * Manages states for rescheduling and canceling operations.
 * @param props - Component props
 * @param props.order - The order
 * @param props.isSeller - Is the current user the seller
 * @returns A page for viewing order details with a cancel button and reschedule button
 */
export default function OrderDetailClient({ order, isSeller }: OrderDetailClientProps) {
  const id = order.id;
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  const cancelMutation = useCancelOrder();
  const rescheduleMutation = useRescheduleOrder();

  const handleCancelOrder = async (reason: string) => {
    const toastId = toast.loading('Canceling order...');
    try {
      await cancelMutation.mutateAsync({ id, data: { reason } });
      toast.success('Order has been canceled and a refund issued.', { id: toastId });
      setIsCancelOpen(false);
    } catch (error) {
      toast.error('Failed to cancel the order. Please try again.', { id: toastId });
    }
  };

  const handleRescheduleOrder = async (newTimeIso: string) => {
    const toastId = toast.loading('Proposing new time...');
    try {
      await rescheduleMutation.mutateAsync({ id, data: { newTime: newTimeIso } });
      toast.success('Reschedule request sent successfully.', { id: toastId });
      setIsRescheduleOpen(false);
    } catch (error) {
      toast.error('Failed to reschedule the order. Please try again.', { id: toastId });
    }
  };

  const isPending = order.status === 'pending';
  const isReorderable = order.status === 'completed' || order.status === 'canceled';

  return (
    <div>
      <div className="flex flex-col w-full mx-auto gap-6">
        <PageHeader
          title={`Order #${order.id.slice(0, 8).toUpperCase()}`}
          subtitle={`Placed on ${formatAppDate(order.createdAt, 'full', 'Unknown date')}`}
          actions={
            <>
              {isPending && (
                <div className="flex gap-3">
                  <Button variant="destructive" onClick={() => setIsCancelOpen(true)}>
                    Cancel Order
                  </Button>
                  <Button variant="lime" onClick={() => setIsRescheduleOpen(true)}>
                    Reschedule
                  </Button>
                </div>
              )}
              {isReorderable && (
                <Button variant="lime" onClick={() => setIsReorderOpen(true)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Order Again
                </Button>
              )}
            </>
          }
        />

        {order.status === 'canceled' && order.cancelReason && (
          <CancellationReasonBanner reason={order.cancelReason} />
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-6 md:col-span-2">
            <OrderSummaryCard order={order} fromUser={isSeller ? order.buyer : order.seller} />
            <OrderItemsCard items={order.items || []} />
            <OrderLocationCard
              fulfillmentType={order.fulfillmentType}
              buyer={order.buyer}
              seller={order.seller}
            />
          </div>
        </div>
      </div>

      <CancelOrderDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancelOrder}
        isPending={cancelMutation.isPending}
      />
      <RescheduleOrderDialog
        key={order.scheduledTime}
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        onConfirm={handleRescheduleOrder}
        currentScheduledTime={order.scheduledTime}
        isPending={rescheduleMutation.isPending}
      />
      <Dialog open={isReorderOpen} onOpenChange={setIsReorderOpen}>
        <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
          <ReorderForm orderId={id} onClose={() => setIsReorderOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
