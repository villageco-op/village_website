import { ArrowLeft, Loader2, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../../ui/button';

import { ListingBasicInfo } from './ListingBasicInfo';
import { ListingHarvestDetails } from './ListingHarvestDetails';
import { ListingImageUpload } from './ListingImageUpload';
import { ListingPricingInventory } from './ListingPricingInventory';

import type { CreateProducePayload } from '@/lib/api/generated/models';
import { useCreateProduce } from '@/lib/api/generated/produce/produce';

/**
 * Interface for the new listing form.
 */
export interface ListingFormData {
  title: string;
  produceType: string;
  pricePerLb: string;
  totalLbsInventory: string;
  availableBy: string;
  harvestFrequencyDays: string;
  seasonStart: string;
  seasonEnd: string;
  isSubscribable: boolean;
  images: string[];
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
    produceType: '',
    pricePerLb: '',
    totalLbsInventory: '',
    availableBy: '',
    harvestFrequencyDays: '7',
    seasonStart: '',
    seasonEnd: '',
    isSubscribable: false,
    images: [],
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

      // Convert user-friendly units (Lbs) to API units (Oz)
      const pricePerOz = Number(formData.pricePerLb) / 16;
      const totalOzInventory = Math.round(Number(formData.totalLbsInventory) * 16);

      const payload: CreateProducePayload = {
        title: formData.title,
        produceType: formData.produceType || undefined,
        pricePerOz,
        totalOzInventory,
        harvestFrequencyDays: Number(formData.harvestFrequencyDays),
        availableBy: formData.availableBy ? new Date(formData.availableBy).toISOString() : null,
        seasonStart: new Date(formData.seasonStart).toISOString(),
        seasonEnd: new Date(formData.seasonEnd).toISOString(),
        isSubscribable: formData.isSubscribable,
        images: formData.images.length > 0 ? formData.images : undefined,
      };

      const res = await createProduceMutation.mutateAsync({ data: payload });
      console.log(res.status);
      if (res.status === 201) {
        toast.success('Listing created successfully!', { id: toastId });
        router.push('/seller/listings');
      } else {
        throw new Error('Failed to create listing');
      }
    } catch (error) {
      console.error('Failed to create produce listing:', error);
      toast.error('Could not create listing. Please try again later.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              className="mb-2 -ml-3 text-ink-3 hover:text-ink hover:bg-slate-200/50"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listings
            </Button>
            <h1 className="font-heading text-3xl font-bold text-deep-forest">Create New Listing</h1>
            <p className="font-sans text-sm text-ink-3 mt-1">
              Add a new produce item to your marketplace.
            </p>
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

          <div className="flex justify-end gap-4 pt-4 pb-12">
            <Button
              type="button"
              variant="outline"
              className="text-ink-2 bg-white"
              onClick={() => router.back()}
              disabled={isSubmitting || isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="bg-lime text-forest-dark hover:bg-lime-light font-bold min-w-35"
            >
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
    </div>
  );
}
