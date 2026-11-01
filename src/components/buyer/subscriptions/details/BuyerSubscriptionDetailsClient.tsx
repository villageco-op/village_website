'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Pause, Play } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { CancelSubscriptionDialog } from './CancelSubscriptionDialog';
import { EditSubscriptionDialog } from './EditSubscriptionDialog';

import { CancellationReasonBanner } from '@/components/orders/CancellationReasonBanner';
import { OrderLocationCard } from '@/components/orders/OrderLocationCard';
import { PauseReasonBanner } from '@/components/subscriptions/PauseReasonBanner';
import { SubscriptionSummaryCard } from '@/components/subscriptions/SubscriptionSummaryCard';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { PageHeader } from '@/components/ui/page-header';
import { NotFoundState } from '@/components/ui/state-displays';
import type { FulfillmentType, SubscriptionDetailResponse } from '@/lib/api/generated/models';
import {
  getGetSubscriptionByIdQueryKey,
  getGetSubscriptionsQueryKey,
  useGetSubscriptionById,
  useUpdateSubscription,
} from '@/lib/api/generated/subscriptions/subscriptions';
import { formatAppDate } from '@/lib/date-utils';

interface BuyerSubscriptionDetailClientProps {
  subscription: SubscriptionDetailResponse;
}

/**
 * Client component that fetches and displays a specific subscription.
 * Manages states for editing and canceling operations.
 *
 * @param props - Component props
 * @param props.subscription - The subscription
 * @returns A page for viewing subscription details with a cancel button and edit button
 */
export default function BuyerSubscriptionDetailClient({
  subscription: initialSubscription,
}: BuyerSubscriptionDetailClientProps) {
  const id = initialSubscription.id;
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const queryClient = useQueryClient();

  const updateMutation = useUpdateSubscription({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: [getGetSubscriptionByIdQueryKey(id)],
        });
        void queryClient.invalidateQueries({
          queryKey: [getGetSubscriptionsQueryKey()],
        });
      },
    },
  });

  const { data, isLoading, isError } = useGetSubscriptionById(id, {
    query: {
      enabled: !!id,
      initialData: {
        data: initialSubscription,
        status: 200,
        headers: new Headers(),
      },
      staleTime: 1000 * 60 * 5,
    },
  });

  const handleCancel = async (reason: string) => {
    const toastId = toast.loading('Canceling subscription...');
    try {
      await updateMutation.mutateAsync({ id, data: { status: 'canceled', cancelReason: reason } });
      toast.success('Subscription has been canceled.', { id: toastId });
      setIsCancelOpen(false);
    } catch (error) {
      toast.error('Failed to cancel the subscription. Please try again.', { id: toastId });
    }
  };

  const handleTogglePause = async (currentStatus: string) => {
    const newStatus = currentStatus === 'paused' ? 'active' : 'paused';
    const actionText = currentStatus === 'paused' ? 'Resuming' : 'Pausing';

    const toastId = toast.loading(`${actionText} subscription...`);
    try {
      await updateMutation.mutateAsync({ id, data: { status: newStatus } });
      toast.success(`Subscription successfully ${newStatus}.`, { id: toastId });
    } catch (error) {
      toast.error(`Failed to change subscription status.`, { id: toastId });
    }
  };

  const handleEdit = async (quantityOz: number, fulfillmentType: string) => {
    const toastId = toast.loading('Updating subscription...');
    try {
      await updateMutation.mutateAsync({
        id,
        data: { quantityOz, fulfillmentType: fulfillmentType as FulfillmentType },
      });
      toast.success('Subscription updated successfully. Changes apply next cycle.', {
        id: toastId,
      });
      setIsEditOpen(false);
    } catch (error) {
      toast.error('Failed to update subscription.', { id: toastId });
    }
  };

  if (isLoading) {
    return <LoadingSkeleton heights={['h-8', 'h-125', 'h-64']} />;
  }

  if (isError || data?.status !== 200 || !data.data) {
    return (
      <NotFoundState
        title="Subscription not found"
        description="We couldn't load the details for this subscription."
      />
    );
  }

  const subscription = data.data;

  const isCanceled = subscription.status === 'canceled';
  const isPaused = subscription.status === 'paused';

  return (
    <div>
      <div className="flex flex-col w-full mx-auto gap-6">
        <PageHeader
          title="Subscription Details"
          subtitle={`Started on ${formatAppDate(subscription.createdAt, 'full', 'Unknown date')}`}
          actions={
            !isCanceled && (
              <div className="flex flex-wrap gap-3">
                <Button variant="destructive" onClick={() => setIsCancelOpen(true)}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void handleTogglePause(subscription.status)}
                  disabled={updateMutation.isPending}
                >
                  {isPaused ? (
                    <Play className="mr-2 h-4 w-4" />
                  ) : (
                    <Pause className="mr-2 h-4 w-4" />
                  )}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button variant="lime" onClick={() => setIsEditOpen(true)}>
                  Edit
                </Button>
              </div>
            )
          }
        />

        {isCanceled && subscription.cancelReason && (
          <CancellationReasonBanner reason={subscription.cancelReason} />
        )}
        {isPaused && subscription.cancelReason && (
          <PauseReasonBanner reason={subscription.cancelReason} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <SubscriptionSummaryCard subscription={subscription} fromUser={subscription.seller} />
          <OrderLocationCard
            fulfillmentType={subscription.fulfillmentType as FulfillmentType}
            buyer={subscription.buyer}
            seller={subscription.seller}
          />
        </div>
      </div>

      <CancelSubscriptionDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancel}
        isPending={updateMutation.isPending}
      />

      <EditSubscriptionDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onConfirm={handleEdit}
        isPending={updateMutation.isPending}
        currentQuantity={Number(subscription.quantityOz)}
        currentFulfillment={subscription.fulfillmentType}
        pricePerOz={Number(subscription.product?.pricePerOz || 0)}
      />
    </div>
  );
}
