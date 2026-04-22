'use client';

import { AlertCircle, ArrowLeft, Pause, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { SubscriptionLocationCard } from '../../../subscriptions/SubscriptionLocationCard';
import { SubscriptionSummaryCard } from '../../../subscriptions/SubscriptionSummaryCard';
import { SubscriptionUserCard } from '../../../subscriptions/SubscriptionUserCard';

import { CancelSubscriptionDialog } from './CancelSubscriptionDialog';
import { EditSubscriptionDialog } from './EditSubscriptionDialog';

import { OrderDetailSkeleton } from '@/components/orders/OrderDetailSkeleton';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import type { FulfillmentType } from '@/lib/api/generated/models';
import {
  useGetSubscriptionById,
  useUpdateSubscription,
} from '@/lib/api/generated/subscriptions/subscriptions';

interface SubscriptionDetailClientProps {
  id: string;
}

/**
 * Client component that fetches and displays a specific subscription.
 * Manages states for editing and canceling operations.
 *
 * @param props - Component props
 * @param props.id - The ID of the subscription
 * @returns A page for viewing subscription details with a cancel button and edit button
 */
export default function SubscriptionDetailClient({ id }: SubscriptionDetailClientProps) {
  const router = useRouter();

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const query = useGetSubscriptionById(id, { query: { enabled: !!id } });
  const updateMutation = useUpdateSubscription();

  const handleCancel = async (reason: string) => {
    const toastId = toast.loading('Canceling subscription...');
    try {
      await updateMutation.mutateAsync({ id, data: { status: 'canceled', cancelReason: reason } });
      toast.success('Subscription has been canceled.', { id: toastId });
      setIsCancelOpen(false);
      void query.refetch();
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
      void query.refetch();
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
      void query.refetch();
    } catch (error) {
      toast.error('Failed to update subscription.', { id: toastId });
    }
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
          </div>

          {/* Action Buttons */}
          {!isCanceled && (
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="bg-white border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
                onClick={() => setIsCancelOpen(true)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="bg-white text-ink-3 hover:bg-slate-50 hover:text-ink"
                onClick={() => void handleTogglePause(subscription.status)}
                disabled={updateMutation.isPending}
              >
                {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                className="bg-lime text-forest-dark hover:bg-lime/80 font-semibold"
                onClick={() => setIsEditOpen(true)}
              >
                Edit Subscription
              </Button>
            </div>
          )}
        </div>

        {/* Cancellation Reason Banner */}
        {isCanceled && subscription.cancelReason && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">Cancellation Reason</p>
              <p className="mt-1">{subscription.cancelReason}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-6 md:col-span-2">
            <SubscriptionSummaryCard subscription={subscription} />
            <SubscriptionLocationCard subscription={subscription} />
          </div>

          <div className="flex flex-col gap-6">
            <SubscriptionUserCard title="Grower Details" user={subscription.seller} role="seller" />
          </div>
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
