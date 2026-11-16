'use client';

import { useQueryClient } from '@tanstack/react-query';
import { VisuallyHidden } from 'radix-ui';
import { useState } from 'react';
import { toast } from 'sonner';

import { CancellationReasonBanner } from './CancellationReasonBanner';
import { CancelOrderDialog } from './CancelOrderDialog';
import { CreateReviewForm } from './CreateReviewForm';
import { OrderItemsCard } from './OrderItemsCard';
import { OrderLocationCard } from './OrderLocationCard';
import { OrderReviewCard } from './OrderReviewCard';
import { OrderStatusReportCard } from './OrderStatusReportCard';
import { OrderSummaryCard } from './OrderSummaryCard';
import { RescheduleOrderDialog } from './RescheduleOrderDialog';

import { ReorderForm } from '@/components/buyer/new-order/ReorderForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { PageHeader } from '@/components/ui/page-header';
import { NotFoundState } from '@/components/ui/state-displays';
import type {
  OrderDetailResponse,
  ReportOrderStatusPayloadReport,
} from '@/lib/api/generated/models';
import {
  getGetOrderByIdQueryKey,
  getGetOrdersQueryKey,
  useCancelOrder,
  useDisputeOrder,
  useGetOrderById,
  useReportOrderStatus,
  useRescheduleOrder,
} from '@/lib/api/generated/orders/orders';
import { formatAppDate } from '@/lib/date-utils';

interface OrderDetailClientProps {
  order: OrderDetailResponse;
  isSeller: boolean;
  nowMs: number;
}

/**
 * Client component that fetches and displays a specific order.
 * Manages states for rescheduling and canceling operations.
 * @param props - Component props
 * @param props.order - The order
 * @param props.isSeller - Is the current user the seller
 * @param props.nowMs - The current time in milliseconds
 * @returns A page for viewing order details with a cancel button and reschedule button
 */
export default function OrderDetailClient({
  order: initialOrder,
  isSeller,
  nowMs,
}: OrderDetailClientProps) {
  const id = initialOrder.id;
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isReorderOpen, setIsReorderOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const queryClient = useQueryClient();

  const cancelMutation = useCancelOrder();
  const rescheduleMutation = useRescheduleOrder();
  const reportMutation = useReportOrderStatus();
  const disputeMutation = useDisputeOrder();

  const { data, isLoading, isError, refetch } = useGetOrderById(id, {
    query: {
      enabled: !!id,
      initialData: {
        data: initialOrder,
        status: 200,
        headers: new Headers(),
      },
      staleTime: 1000 * 60 * 5,
    },
  });

  const handleCancelOrder = async (reason: string) => {
    const toastId = toast.loading('Canceling order...');
    try {
      await cancelMutation.mutateAsync({ id, data: { reason } });

      await queryClient.invalidateQueries({
        queryKey: [getGetOrderByIdQueryKey(id)],
      });

      await queryClient.invalidateQueries({
        queryKey: [getGetOrdersQueryKey()],
      });

      await refetch();

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

      await queryClient.invalidateQueries({
        queryKey: [getGetOrderByIdQueryKey(id)],
      });

      await queryClient.invalidateQueries({
        queryKey: [getGetOrdersQueryKey()],
      });

      await refetch();

      toast.success('Reschedule request sent successfully.', { id: toastId });
      setIsRescheduleOpen(false);
    } catch (error) {
      toast.error('Failed to reschedule the order. Please try again.', { id: toastId });
    }
  };

  const handleReportStatus = async (reportStatus: ReportOrderStatusPayloadReport) => {
    const toastId = toast.loading('Submitting report...');
    try {
      await reportMutation.mutateAsync({ id, data: { report: reportStatus } });
      await queryClient.invalidateQueries({ queryKey: [getGetOrderByIdQueryKey(id)] });
      await refetch();
      toast.success('Status report submitted successfully.', { id: toastId });
    } catch (error) {
      toast.error('Failed to submit status report. Please try again.', { id: toastId });
    }
  };

  const handleDisputeOrder = async () => {
    const toastId = toast.loading('Opening dispute...');
    try {
      await disputeMutation.mutateAsync({ id });
      await queryClient.invalidateQueries({ queryKey: [getGetOrderByIdQueryKey(id)] });
      await refetch();
      toast.success('Dispute opened successfully.', { id: toastId });
    } catch (error) {
      toast.error('Failed to open dispute. Please try again.', { id: toastId });
    }
  };

  if (isLoading) {
    return <LoadingSkeleton heights={['h-8', 'h-125', 'h-64']} />;
  }

  if (isError || data?.status !== 200 || !data.data) {
    return (
      <NotFoundState
        title="Order not found"
        description="We couldn't load the details for this order."
      />
    );
  }

  const order = data.data;

  const isPending = order.status === 'pending';
  const isReorderable = order.status === 'completed' || order.status === 'canceled';
  const isReviewable = order.status === 'completed' && !order.review;

  const scheduledTimeMs = order.scheduledTime ? new Date(order.scheduledTime).getTime() : 0;

  const hoursSinceScheduled = nowMs !== null ? (nowMs - scheduledTimeMs) / (1000 * 60 * 60) : 0;
  const isWithin24Hours = nowMs !== null && hoursSinceScheduled >= 0 && hoursSinceScheduled <= 24;
  const isBetween24And48Hours =
    nowMs !== null && hoursSinceScheduled > 24 && hoursSinceScheduled <= 48;
  const isWithin48Hours = nowMs !== null && hoursSinceScheduled >= 0 && hoursSinceScheduled <= 48;

  const counterpartyReport = isSeller ? order.buyerReport : order.sellerReport;
  const hasCounterpartyReported = counterpartyReport !== null;

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
              {!isSeller && isWithin24Hours && !hasCounterpartyReported && (
                <>
                  <Button variant="lime" onClick={() => void handleReportStatus('received')}>
                    Report Received
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => void handleReportStatus('not_received')}
                  >
                    Report Not Received
                  </Button>
                </>
              )}

              {isSeller && isBetween24And48Hours && !hasCounterpartyReported && (
                <Button variant="lime" onClick={() => void handleReportStatus('fulfilled')}>
                  Report Fulfilled
                </Button>
              )}

              {isWithin48Hours && hasCounterpartyReported && (
                <Button variant="destructive" onClick={() => void handleDisputeOrder()}>
                  Dispute Order
                </Button>
              )}
              {isReviewable && (
                <Button variant="outline" onClick={() => setIsReviewOpen(true)}>
                  Review
                </Button>
              )}
              {isReorderable && (
                <Button variant="lime" onClick={() => setIsReorderOpen(true)}>
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
            {order.status !== 'pending' &&
              order.status !== 'canceled' &&
              hoursSinceScheduled >= 0 && (
                <OrderStatusReportCard
                  report={order.buyerReport || order.sellerReport}
                  reportedAt={order.buyerReportedAt || order.sellerReportedAt}
                />
              )}
            <OrderItemsCard items={order.items || []} />
            {order.review && <OrderReviewCard review={order.review} />}
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
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <VisuallyHidden.Root>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>Share your experience with {order.seller.name}</DialogDescription>
        </VisuallyHidden.Root>
        <DialogContent
          className="max-w-md p-0 border-none bg-transparent shadow-none"
          aria-label="Leave a Review"
        >
          <CreateReviewForm
            sellerId={order.seller.id}
            orderId={order.id}
            sellerName={order.seller.name}
            sellerImage={order.seller.image}
            itemNames={order.items.map((item) => item.productName)}
            fulfillmentType={order.fulfillmentType}
            scheduledTime={order.scheduledTime}
            onClose={() => setIsReviewOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
