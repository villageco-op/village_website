'use client';

import { ArrowLeft, Pause, Play, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { SellerUpdateStatusDialog } from './SellerUpdateStatusDialog';

import { OrderDetailSkeleton } from '@/components/orders/OrderDetailSkeleton';
import { SubscriptionLocationCard } from '@/components/subscriptions/SubscriptionLocationCard';
import { SubscriptionSummaryCard } from '@/components/subscriptions/SubscriptionSummaryCard';
import { SubscriptionUserCard } from '@/components/subscriptions/SubscriptionUserCard';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import {
  useGetSubscriptionById,
  useUpdateSubscription,
} from '@/lib/api/generated/subscriptions/subscriptions';

interface SellerSubscriptionDetailClientProps {
  id: string;
}

/**
 * Client component that fetches and displays a specific seller subscription.
 * Allows sellers to pause or cancel the subscription with a provided reason,
 * but restricts them from modifying fulfillment details or quantity.
 *
 * @param props - Component props
 * @param props.id - The ID of the subscription
 * @returns A page for viewing subscription details from the seller's perspective
 */
export default function SellerSubscriptionDetailClient({
  id,
}: SellerSubscriptionDetailClientProps) {
  const router = useRouter();

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [targetAction, setTargetAction] = useState<'canceled' | 'paused' | null>(null);

  const query = useGetSubscriptionById(id, { query: { enabled: !!id } });
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
      void query.refetch();
    } catch (error) {
      toast.error(`Failed to update the subscription status. Please try again.`, { id: toastId });
    }
  };

  const handleResume = async () => {
    const toastId = toast.loading('Resuming subscription...');
    try {
      await updateMutation.mutateAsync({ id, data: { status: 'active', cancelReason: undefined } });
      toast.success('Subscription successfully resumed.', { id: toastId });
      void query.refetch();
    } catch (error) {
      toast.error('Failed to resume subscription.', { id: toastId });
    }
  };

  const openStatusDialog = (action: 'canceled' | 'paused') => {
    setTargetAction(action);
    setIsStatusDialogOpen(true);
  };

  if (query.isLoading) {
    return (
      <div className="min-h-screen bg-off-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <OrderDetailSkeleton />
        </div>
      </div>
    );
  }

  if (query.isError || query.data?.status !== 200 || !query.data?.data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-off-white p-4">
        <h2 className="mb-2 text-2xl font-bold text-deep-forest">Subscription not found</h2>
        <p className="mb-6 text-ink-3">We couldn&apos;t load the details for this subscription.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const subscription = query.data.data;
  const isCanceled = subscription.status === 'canceled';
  const isPaused = subscription.status === 'paused';

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
                Subscription Details
              </h1>
              <StatusPill status={subscription.status} />
            </div>
            <p className="mt-1 font-sans text-sm text-ink-3">
              Started on{' '}
              {subscription.createdAt
                ? new Date(subscription.createdAt).toLocaleDateString()
                : 'Unknown date'}
            </p>
            {/* If there's an existing reason for a paused/canceled sub, show it */}
            {(isCanceled || isPaused) && subscription.cancelReason && (
              <p className="mt-2 text-sm text-destructive max-w-xl">
                <span className="font-semibold text-ink-3">Reason provided: </span>
                {subscription.cancelReason}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {!isCanceled && (
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="bg-white border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
                onClick={() => openStatusDialog('canceled')}
                disabled={updateMutation.isPending}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Subscription
              </Button>

              {isPaused ? (
                <Button
                  variant="lime"
                  className="font-semibold"
                  onClick={() => void handleResume()}
                  disabled={updateMutation.isPending}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Resume Subscription
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="bg-white text-ink-3 hover:bg-slate-50 hover:text-ink"
                  onClick={() => openStatusDialog('paused')}
                  disabled={updateMutation.isPending}
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Pause Subscription
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-6 md:col-span-2">
            <SubscriptionSummaryCard subscription={subscription} />
            <SubscriptionLocationCard subscription={subscription} />
          </div>

          <div className="flex flex-col gap-6">
            <SubscriptionUserCard title="Buyer Details" user={subscription.buyer} role="buyer" />
          </div>
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
