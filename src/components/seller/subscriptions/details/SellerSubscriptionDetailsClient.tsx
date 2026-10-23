'use client';

import { Pause, Play, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { SellerUpdateStatusDialog } from './SellerUpdateStatusDialog';

import { CancellationReasonBanner } from '@/components/orders/CancellationReasonBanner';
import { OrderLocationCard } from '@/components/orders/OrderLocationCard';
import { PauseReasonBanner } from '@/components/subscriptions/PauseReasonBanner';
import { SubscriptionSummaryCard } from '@/components/subscriptions/SubscriptionSummaryCard';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import type { FulfillmentType, SubscriptionDetailResponse } from '@/lib/api/generated/models';
import { useUpdateSubscription } from '@/lib/api/generated/subscriptions/subscriptions';
import { formatAppDate } from '@/lib/date-utils';

interface SellerSubscriptionDetailClientProps {
  subscription: SubscriptionDetailResponse;
}

/**
 * Client component that fetches and displays a specific seller subscription.
 * @param props - Component props
 * @param props.subscription - The subscription information
 * @returns The client component
 */
export default function SellerSubscriptionDetailClient({
  subscription,
}: SellerSubscriptionDetailClientProps) {
  const id = subscription.id;
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [targetAction, setTargetAction] = useState<'canceled' | 'paused' | null>(null);

  const updateMutation = useUpdateSubscription();

  const handleUpdateStatus = async (reason: string) => {
    if (!targetAction) return;

    const actionText = targetAction === 'canceled' ? 'Canceling' : 'Pausing';
    const successText = targetAction === 'canceled' ? 'canceled' : 'paused';

    const toastId = toast.loading(`${actionText} subscription...`);
    try {
      await updateMutation.mutateAsync({
        id,
        data: { status: targetAction, cancelReason: reason },
      });
      toast.success(`Subscription has been ${successText}.`, { id: toastId });
      setIsStatusDialogOpen(false);
    } catch (error) {
      toast.error(`Failed to update the subscription status. Please try again.`, { id: toastId });
    }
  };

  const handleResume = async () => {
    const toastId = toast.loading('Resuming subscription...');
    try {
      await updateMutation.mutateAsync({ id, data: { status: 'active', cancelReason: undefined } });
      toast.success('Subscription successfully resumed.', { id: toastId });
    } catch (error) {
      toast.error('Failed to resume subscription.', { id: toastId });
    }
  };

  const openStatusDialog = (action: 'canceled' | 'paused') => {
    setTargetAction(action);
    setIsStatusDialogOpen(true);
  };

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
                <Button
                  variant="destructive"
                  onClick={() => openStatusDialog('canceled')}
                  disabled={updateMutation.isPending}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </Button>

                {isPaused ? (
                  <Button
                    variant="lime"
                    className="font-semibold"
                    onClick={() => void handleResume()}
                    disabled={updateMutation.isPending}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => openStatusDialog('paused')}
                    disabled={updateMutation.isPending}
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                )}
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
          <SubscriptionSummaryCard subscription={subscription} fromUser={subscription.buyer} />
          <OrderLocationCard
            fulfillmentType={subscription.fulfillmentType as FulfillmentType}
            buyer={subscription.buyer}
            seller={subscription.seller}
          />
        </div>
      </div>

      <SellerUpdateStatusDialog
        key={targetAction || 'closed'}
        isOpen={isStatusDialogOpen}
        action={targetAction}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={handleUpdateStatus}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
