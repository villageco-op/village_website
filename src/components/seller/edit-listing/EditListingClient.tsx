'use client';

import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { DeleteListingDialog } from './DeleteListingDialog';

import { ListingStatusActions } from '@/components/seller/edit-listing/ListingStatusActions';
import type { ListingFormData } from '@/components/seller/new-listing/AddNewListingClient';
import { ListingBasicInfo } from '@/components/seller/new-listing/ListingBasicInfo';
import { ListingHarvestDetails } from '@/components/seller/new-listing/ListingHarvestDetails';
import { ListingImageUpload } from '@/components/seller/new-listing/ListingImageUpload';
import { ListingPricingInventory } from '@/components/seller/new-listing/ListingPricingInventory';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { PageHeader } from '@/components/ui/page-header';
import { NotFoundState } from '@/components/ui/state-displays';
import { StatusPill } from '@/components/ui/status-pill';
import type { UpdateProducePayload, ProduceDetails } from '@/lib/api/generated/models';
import {
  useGetProduce,
  useUpdateProduce,
  useDeleteProduce,
} from '@/lib/api/generated/produce/produce';
import { UTCDateToLocal } from '@/lib/date-utils';
import { logger } from '@/lib/logger';

interface EditListingClientProps {
  id: string;
}

/**
 * Edit listing form and data synchronizer.
 * @param props - Component props containing the listing id
 * @param props.id - The listing ID
 * @returns A full page component with initialized cards
 */
export default function EditListingClient({ id }: EditListingClientProps) {
  const router = useRouter();

  const produceQuery = useGetProduce(id, { query: { enabled: !!id } });
  const updateProduceMutation = useUpdateProduce();
  const deleteProduceMutation = useDeleteProduce();

  const [formData, setFormData] = useState<ListingFormData | null>(null);
  const [status, setStatus] = useState<string>('draft');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (produceQuery.isSuccess && produceQuery.data?.data) {
      if (produceQuery.data.status === 200) {
        const produce: ProduceDetails = produceQuery.data.data;

        setFormData({
          title: produce.title,
          description: produce.description || '',
          produceType: produce.produceType || undefined,
          pricePerOz: Number(produce.pricePerOz || 0).toFixed(2),
          totalOzInventory: Number(produce.totalOzInventory || 0).toString(),
          maxOrderOz: produce.maxOrderQuantityOz
            ? Number(produce.maxOrderQuantityOz).toString()
            : '',
          availableBy: produce.availableBy ? UTCDateToLocal(new Date(produce.availableBy)) : '',
          harvestFrequencyDays: produce.harvestFrequencyDays?.toString() || '7',
          seasonStart: produce.seasonStart
            ? new Date(produce.seasonStart).toISOString().split('T')[0]
            : '',
          seasonEnd: produce.seasonEnd
            ? new Date(produce.seasonEnd).toISOString().split('T')[0]
            : '',
          isSubscribable: produce.isSubscribable || false,
          images: (produce.images as string[]) || [],
        });
        setStatus(produce.status || 'draft');
      }
    }
  }, [produceQuery.data, produceQuery.isSuccess]);

  const updateFormData = (updates: Partial<ListingFormData>) => {
    setFormData((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const handleAddImage = (url: string) => {
    if (!formData) return;
    updateFormData({ images: [...formData.images, url] });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (!formData) return;
    updateFormData({
      images: formData.images.filter((_, idx) => idx !== indexToRemove),
    });
  };

  const handleToggleStatus = async () => {
    const newStatus = status === 'paused' ? 'active' : 'paused';
    const toastId = toast.loading(
      newStatus === 'paused' ? 'Pausing listing...' : 'Resuming listing...',
    );

    try {
      await updateProduceMutation.mutateAsync({
        id,
        data: { status: newStatus as any },
      });
      setStatus(newStatus);
      toast.success(`Listing ${newStatus === 'paused' ? 'paused' : 'resumed'} successfully`, {
        id: toastId,
      });
    } catch (error) {
      toast.error('Failed to update status', { id: toastId });
    }
  };

  const handleConfirmDelete = async () => {
    const toastId = toast.loading('Deleting listing...');
    try {
      await deleteProduceMutation.mutateAsync({ id });
      toast.success('Listing deleted successfully', { id: toastId });
      setIsDeleteDialogOpen(false);
      router.push('/seller/listings');
    } catch (error) {
      toast.error('Failed to delete listing', { id: toastId });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!formData) return;

    if (isUploading) {
      toast.error('Please wait for images to finish uploading.');
      return;
    }

    let toastId: string | number | undefined = undefined;

    try {
      setIsSubmitting(true);
      toastId = toast.loading('Saving changes...');

      const pricePerOz = Number(formData.pricePerOz);
      const totalOzInventory = Number(formData.totalOzInventory);
      const maxOrderQuantityOz = formData.maxOrderOz ? Number(formData.maxOrderOz) : null;

      const payload: UpdateProducePayload = {
        title: formData.title,
        description: formData.description || undefined,
        produceType: formData.produceType || undefined,
        pricePerOz: pricePerOz,
        totalOzInventory: totalOzInventory,
        maxOrderQuantityOz: maxOrderQuantityOz,
        harvestFrequencyDays: Number(formData.harvestFrequencyDays),
        availableBy: formData.availableBy
          ? new Date(formData.availableBy).toISOString()
          : undefined,
        seasonStart: new Date(formData.seasonStart).toISOString(),
        seasonEnd: new Date(formData.seasonEnd).toISOString(),
        isSubscribable: formData.isSubscribable,
        images: formData.images.length > 0 ? formData.images : [],
      };

      const res = await updateProduceMutation.mutateAsync({ id, data: payload });

      if (res.status === 200) {
        toast.success('Listing updated successfully!', { id: toastId });
        router.push('/seller/listings');
      } else {
        throw new Error('Failed to update listing');
      }
    } catch (error) {
      logger.error('Failed to update produce listing:', error);
      toast.error('Could not update listing. Please try again later.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if ((!produceQuery.isError && !formData) || produceQuery.isLoading) {
    return <LoadingSkeleton heights={['h-20', 'h-128']} />;
  }

  if (produceQuery.isError || !formData) {
    return (
      <NotFoundState
        title="Listing not found"
        description="We couldn't load the details for this produce listing."
        action={<Button onClick={() => router.push('/seller/listings')}>Back to Listings</Button>}
      />
    );
  }

  const isPendingMutations = updateProduceMutation.isPending || deleteProduceMutation.isPending;

  return (
    <div>
      <div className="mx-auto flex w-full flex-col gap-6">
        <PageHeader title="Edit Listing" subtitle={<StatusPill status={status} />} />

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
          <ListingImageUpload
            images={formData.images}
            onAddImage={handleAddImage}
            onRemoveImage={handleRemoveImage}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />

          <ListingBasicInfo data={formData} updateData={updateFormData} />
          <ListingPricingInventory data={formData} updateData={updateFormData} />
          <ListingHarvestDetails data={formData} updateData={updateFormData} />

          <ListingStatusActions
            status={status}
            onToggleStatus={() => void handleToggleStatus()}
            onDelete={() => setIsDeleteDialogOpen(true)}
            isPending={isPendingMutations || isSubmitting}
          />

          <div className="flex justify-end gap-4 pt-4 pb-12">
            <Button
              type="button"
              variant="outline"
              className="text-ink-2 bg-white"
              onClick={() => router.back()}
              disabled={isSubmitting || isUploading || isPendingMutations}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading || isPendingMutations}
              className="bg-lime text-forest-dark hover:bg-lime-light font-bold min-w-36"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      <DeleteListingDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isPending={deleteProduceMutation.isPending}
      />
    </div>
  );
}
