'use client';

import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ReorderForm } from '../buyer/new-order/ReorderForm';
import { Dialog, DialogContent } from '../ui/dialog';
import { NotFoundState } from '../ui/state-displays';

import { CancelOrderDialog } from './CancelOrderDialog';
import { OrderDetailSkeleton } from './OrderDetailSkeleton';
import { OrderItemsCard } from './OrderItemsCard';
import { OrderLocationCard } from './OrderLocationCard';
import { OrderSummaryCard } from './OrderSummaryCard';
import { OrderUserCard } from './OrderUserCard';
import { RescheduleOrderDialog } from './RescheduleOrderDialog';

import { Button } from '@/components/ui/button';
import {
  useGetOrderById,
  useCancelOrder,
  useRescheduleOrder,
} from '@/lib/api/generated/orders/orders';
import { formatAppDate } from '@/lib/date-utils';

interface OrderDetailClientProps {
  id: string;
}

/**
 * Client component that fetches and displays a specific order.
 * Manages states for rescheduling and canceling operations.
 *
 * @param props - Component props
 * @param props.id - The ID of the order
 * @returns A page for viewing order details with a cancel button and reschedule button
 */
export default function OrderDetailClient({ id }: OrderDetailClientProps) {
  const router = useRouter();

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  const orderQuery = useGetOrderById(id, { query: { enabled: !!id } });
  const cancelMutation = useCancelOrder();
  const rescheduleMutation = useRescheduleOrder();

  const handleCancelOrder = async (reason: string) => {
    const toastId = toast.loading('Canceling order...');
    try {
      await cancelMutation.mutateAsync({ id, data: { reason } });
      toast.success('Order has been canceled and a refund issued.', { id: toastId });
      setIsCancelOpen(false);
      void orderQuery.refetch();
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
      void orderQuery.refetch();
    } catch (error) {
      toast.error('Failed to reschedule the order. Please try again.', { id: toastId });
    }
  };

  if (orderQuery.isLoading) {
    return (
      <div className="min-h-screen bg-off-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <OrderDetailSkeleton />
        </div>
      </div>
    );
  }

  if (orderQuery.isError || orderQuery.data?.status !== 200) {
    return (
      <NotFoundState
        title="Order not found"
        description="We couldn't load the details for this order."
      />
    );
  }

  const order = orderQuery.data.data;
  const isPending = order.status === 'pending';
  const isReorderable = order.status === 'completed' || order.status === 'canceled';

  return (
    <div className="min-h-screen bg-off-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Button
              variant="ghost"
              className="-ml-3 mb-2 text-ink-3 hover:bg-slate-200/50 hover:text-ink"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-3xl font-bold text-deep-forest">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
            </div>
            <p className="mt-1 font-sans text-sm text-ink-3">
              Placed on {formatAppDate(order.createdAt, 'full', 'Unknown date')}
            </p>
          </div>

          {/* Action Buttons (Only visible if the order is active/pending) */}
          {isPending && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="bg-white border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
                onClick={() => setIsCancelOpen(true)}
              >
                Cancel Order
              </Button>
              <Button
                className="bg-lime text-forest-dark hover:bg-lime/80 font-semibold"
                onClick={() => setIsRescheduleOpen(true)}
              >
                Reschedule
              </Button>
            </div>
          )}

          {isReorderable && (
            <Button
              className="bg-lime text-forest-dark hover:bg-lime/80 font-semibold"
              onClick={() => setIsReorderOpen(true)}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Order Again
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Main Info Column */}
          <div className="flex flex-col gap-6 md:col-span-2">
            <OrderSummaryCard order={order} />
            <OrderItemsCard items={order.items || []} />
            <OrderLocationCard order={order} />
          </div>

          {/* Sidebar / People Info Column */}
          <div className="flex flex-col gap-6">
            <OrderUserCard title="Buyer Details" user={order.buyer} role="buyer" />
            <OrderUserCard title="Seller Details" user={order.seller} role="seller" />
          </div>
        </div>
      </div>

      {/* Dialogs */}
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
