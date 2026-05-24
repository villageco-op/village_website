'use client';

import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { DeleteListingDialog } from './DeleteListingDialog';
import { EditListingSkeleton } from './EditListingSkeleton';

import { ListingStatusActions } from '@/components/seller/edit-listing/ListingStatusActions';
import type { ListingFormData } from '@/components/seller/new-listing/AddNewListingClient';
import { ListingBasicInfo } from '@/components/seller/new-listing/ListingBasicInfo';
import { ListingHarvestDetails } from '@/components/seller/new-listing/ListingHarvestDetails';
import { ListingImageUpload } from '@/components/seller/new-listing/ListingImageUpload';
import { ListingPricingInventory } from '@/components/seller/new-listing/ListingPricingInventory';
import { Button } from '@/components/ui/button';
import { NotFoundState } from '@/components/ui/state-displays';
import type { UpdateProducePayload, ProduceDetail } from '@/lib/api/generated/models';
import {
  useGetProduce,
  useUpdateProduce,
  useDeleteProduce,
} from '@/lib/api/generated/produce/produce';
import { UTCDateToLocal } from '@/lib/date-utils';
import { getStatusColors } from '@/lib/produce-utils';
import { cn } from '@/lib/utils';

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
        const produce: ProduceDetail = produceQuery.data.data;

        setFormData({
          title: produce.title,
          description: produce.description || '',
          produceType: produce.produceType || undefined,
          pricePerLb: (Number(produce.pricePerOz || 0) * 16).toFixed(2),
          totalLbsInventory: (Number(produce.totalOzInventory || 0) / 16).toString(),
          maxOrderLbs: produce.maxOrderQuantityOz
            ? (Number(produce.maxOrderQuantityOz) / 16).toString()
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

  useEffect(() => {
    if (produceQuery.isError) {
      toast.error('Failed to load listing details. Please try again.');
    }
  }, [produceQuery.isError]);

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

      // Convert user-friendly units back to API units (Lbs -> Oz)
      const pricePerOz = Number(formData.pricePerLb) / 16;
      const totalOzInventory = Math.round(Number(formData.totalLbsInventory) * 16);
      const maxOrderQuantityOz = formData.maxOrderLbs
        ? Math.round(Number(formData.maxOrderLbs) * 16)
        : null;

      const payload: UpdateProducePayload = {
        title: formData.title,
        description: formData.description || undefined,
        produceType: formData.produceType || undefined,
        pricePerOz: pricePerOz,
        totalOzInventory: totalOzInventory,
        maxOrderQuantityOz: maxOrderQuantityOz,
        harvestFrequencyDays: Number(formData.harvestFrequencyDays),
        availableBy: formData.availableBy ? new Date(formData.availableBy).toISOString() : null,
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
      console.error('Failed to update produce listing:', error);
      toast.error('Could not update listing. Please try again later.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if ((!produceQuery.isError && !formData) || produceQuery.isLoading) {
    return <EditListingSkeleton />;
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

  const statusColors = getStatusColors(status);
  const isPendingMutations = updateProduceMutation.isPending || deleteProduceMutation.isPending;

  return (
    <div className="min-h-screen bg-off-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              className="mb-2 -ml-3 text-ink-3 hover:text-ink hover:bg-slate-200/50"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listings
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-3xl font-bold text-deep-forest">Edit Listing</h1>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                  statusColors.bg,
                  statusColors.text,
                )}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', statusColors.dot)}></span>
                <span className="capitalize">{status}</span>
              </span>
            </div>
          </div>
        </div>

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
