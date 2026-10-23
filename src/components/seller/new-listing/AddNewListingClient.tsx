'use client';

import { Loader2, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ListingBasicInfo } from './ListingBasicInfo';
import { ListingHarvestDetails } from './ListingHarvestDetails';
import { ListingImageUpload } from './ListingImageUpload';
import { ListingPricingInventory } from './ListingPricingInventory';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import type { CreateProducePayload, ProduceType } from '@/lib/api/generated/models';
import { useCreateProduce } from '@/lib/api/generated/produce/produce';
import { formatLocalDate } from '@/lib/date-utils';
import { logger } from '@/lib/logger';

/**
 * Interface for the new listing form.
 */
export interface ListingFormData {
  title: string;
  produceType: ProduceType | undefined;
  pricePerOz: string;
  totalOzInventory: string;
  maxOrderOz: string;
  availableBy: string;
  harvestFrequencyDays: string;
  seasonStart: string;
  seasonEnd: string;
  isSubscribable: boolean;
  images: string[];
  description: string;
}

/**
 * Props for the form components.
 */
export interface StepComponentProps {
  data: ListingFormData;
  updateData: (updates: Partial<ListingFormData>) => void;
}

/**
 * Form for all the information for a new listing and image upload controls.
 * @returns A full page component with cards for entering listing information
 */
export default function AddNewListingClient() {
  const router = useRouter();
  const createProduceMutation = useCreateProduce();

  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    produceType: undefined,
    pricePerOz: '',
    totalOzInventory: '',
    maxOrderOz: '',
    availableBy: '',
    harvestFrequencyDays: '7',
    seasonStart: '',
    seasonEnd: '',
    isSubscribable: false,
    images: [],
    description: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  let toastId: string | number | undefined = undefined;

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleAddImage = (url: string) => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (isUploading) {
      toast.error('Please wait for images to finish uploading.');
      return;
    }

    try {
      setIsSubmitting(true);
      toastId = toast.loading('Creating listing...');

      const pricePerOz = Number(formData.pricePerOz);
      const totalOzInventory = Math.round(Number(formData.totalOzInventory));
      const maxOrderQuantityOz = formData.maxOrderOz
        ? Math.round(Number(formData.maxOrderOz))
        : null;

      const payload: CreateProducePayload = {
        title: formData.title,
        description: formData.description || undefined,
        produceType: formData.produceType || undefined,
        pricePerOz,
        totalOzInventory,
        maxOrderQuantityOz,
        harvestFrequencyDays: Number(formData.harvestFrequencyDays),
        availableBy: formData.availableBy
          ? new Date(formData.availableBy).toISOString()
          : undefined,
        seasonStart: formatLocalDate(formData.seasonStart),
        seasonEnd: formatLocalDate(formData.seasonEnd),
        isSubscribable: formData.isSubscribable,
        images: formData.images.length > 0 ? formData.images : undefined,
      };

      const res = await createProduceMutation.mutateAsync({ data: payload });
      if (res.status === 201) {
        toast.success('Listing created successfully!', { id: toastId });
        router.push('/seller/listings');
      } else {
        throw new Error('Failed to create listing');
      }
    } catch (error) {
      logger.error('Failed to create produce listing:', error);
      toast.error('Could not create listing. Please try again later.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader title="Create New Listing" />

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

        <div className="flex justify-end gap-4 pt-4 pb-12">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading} className="min-w-35">
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ImageIcon className="w-4 h-4 mr-2" />
            )}
            Publish Listing
          </Button>
        </div>
      </form>
    </div>
  );
}
