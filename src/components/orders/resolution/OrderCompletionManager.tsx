'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { OrderCompletionDialog } from './OrderCompletionDialog';

import { CreateReviewForm } from '@/components/orders/CreateReviewForm';
import { useOrderCompletion } from '@/components/providers/OrderCompletionProvider';
import { Button } from '@/components/ui/button';
import { OrderBuyerReport, OrderSellerReport } from '@/lib/api/generated/models';
import { useReportOrderStatus } from '@/lib/api/generated/orders/orders';

/**
 * Persistant component that handles displying the order completion dialog queue.
 * @returns An order completion dialog component for the current order or null
 */
export function OrderCompletionManager() {
  const { currentOrder, role, queueLength, currentIndex, dismissCurrentOrder, refetchOrders } =
    useOrderCompletion();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<typeof currentOrder | null>(null);

  const { mutateAsync: reportOrderStatus, isPending: isSubmitting } = useReportOrderStatus();

  const handleReport = async (reportType: OrderBuyerReport | OrderSellerReport) => {
    const toastId = toast.loading('Updating order status...');
    try {
      const targetOrder = currentOrder;

      await reportOrderStatus({
        id: targetOrder!.id,
        data: { report: reportType! },
      });

      toast.success('Order status updated successfully!', { id: toastId });

      refetchOrders();

      if (role === 'buyer' && reportType === OrderBuyerReport.received) {
        setReviewOrder(targetOrder);
        setShowReviewModal(true);
      } else {
        dismissCurrentOrder();
      }
    } catch (err) {
      toast.error('Failed to submit status update. Please try again.', { id: toastId });
    }
  };

  if (showReviewModal && reviewOrder) {
    return (
      <CreateReviewForm
        sellerId={reviewOrder.sellerId}
        orderId={reviewOrder.id}
        sellerName={reviewOrder.seller.name}
        sellerImage={reviewOrder.seller.image}
        itemNames={reviewOrder.items.map((item) => item.product.title)}
        fulfillmentType={reviewOrder.fulfillmentType}
        scheduledTime={reviewOrder.scheduledTime}
        onClose={() => {
          setShowReviewModal(false);
          setReviewOrder(null);
          dismissCurrentOrder();
        }}
      />
    );
  }

  if (!currentOrder) return null;

  const isBuyer = role === 'buyer';
  const isDelivery = currentOrder.fulfillmentType === 'delivery';

  return (
    <OrderCompletionDialog
      isOpen={!!currentOrder}
      onClose={dismissCurrentOrder}
      title={isBuyer ? 'Did you receive your order?' : 'Did you fulfill this order?'}
      description={
        isBuyer
          ? `Please confirm whether your scheduled ${isDelivery ? 'delivery' : 'pickup'} arrived successfully.`
          : `The scheduled time has passed. Please confirm if this order was ${isDelivery ? 'delivered' : 'picked up'}.`
      }
      currentIndex={currentIndex}
      totalCount={queueLength}
      order={currentOrder}
    >
      <div className="flex flex-col gap-3 pt-2">
        {isBuyer ? (
          <>
            <Button
              variant="forest"
              className="w-full justify-center font-bold"
              onClick={() => void handleReport(OrderBuyerReport.received)}
              disabled={isSubmitting}
            >
              Yes, Order {isDelivery ? 'Delivered' : 'Picked Up'}
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-center"
              onClick={() => void handleReport(OrderBuyerReport.not_received)}
              disabled={isSubmitting}
            >
              No, I didn&apos;t receive it (Submit Support Ticket)
            </Button>
          </>
        ) : (
          <Button
            variant="forest"
            className="w-full justify-center"
            onClick={() => void handleReport(OrderSellerReport.fulfilled)}
            disabled={isSubmitting}
          >
            Yes, Order {isDelivery ? 'Delivered' : 'Picked Up'}
          </Button>
        )}
        <Button
          variant="ghost"
          size="xs"
          className="w-full"
          onClick={dismissCurrentOrder}
          disabled={isSubmitting}
        >
          Remind me later
        </Button>
      </div>
    </OrderCompletionDialog>
  );
}
