import { Trash2, Loader2, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { toast } from 'sonner';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useUploadImage } from '@/lib/api/generated/upload/upload';
import { cn } from '@/lib/utils';

/**
 * Props for the listing image upload component.
 */
interface ListingImageUploadProps {
  images: string[];
  onAddImage: (url: string) => void;
  onRemoveImage: (index: number) => void;
  isUploading: boolean;
  setIsUploading: (val: boolean) => void;
}

/**
 * Handles image uploading with drag-and-drop styling, image previews, and server synchronization.
 * @param props - Image upload props including images and callbacks
 * @param props.images - An array of image urls to seed the component
 * @param props.onAddImage - Function to call when adding an image
 * @param props.onRemoveImage - Function to call when removing an image
 * @param props.isUploading - Is uploading state
 * @param props.setIsUploading - Function to set is uploading
 * @returns A card containing an images array and upload and remove buttons
 */
export function ListingImageUpload({
  images,
  onAddImage,
  onRemoveImage,
  isUploading,
  setIsUploading,
}: ListingImageUploadProps) {
  const uploadImageMutation = useUploadImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let toastId: string | number | undefined = undefined;

    try {
      setIsUploading(true);
      toastId = toast.loading('Uploading image...');

      const res = await uploadImageMutation.mutateAsync({
        data: { file },
      });

      if (res.status === 200 && res.data?.url) {
        onAddImage(res.data.url);
        toast.success('Image uploaded successfully', { id: toastId });
      } else {
        throw new Error('Failed to upload');
      }
    } catch (error) {
      toast.error('Could not upload image. Please try again.', { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card className="rounded-xl border border-forest-dark/10 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-deep-forest">Product Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg border border-border/50 overflow-hidden bg-slate-50"
            >
              {/* FIXED: Replaced w-full/h-full with the `fill` property natively supported by next/image */}
              <Image src={url} alt={`Upload preview ${index + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {images.length < 4 && (
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={cn(
                'aspect-square rounded-lg border-2 border-dashed border-lime/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50',
                isUploading && 'opacity-50 cursor-not-allowed',
              )}
            >
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-lime-600" />
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 text-ink-3" />
                  <span className="text-xs font-medium text-ink-3">Upload Image</span>
                </>
              )}
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="sr-only"
          accept="image/jpeg, image/png, image/webp"
          onChange={(e) => void handleFileChange(e)}
        />
        <p className="text-xs text-ink-3">Upload up to 4 images (JPEG, PNG, WebP).</p>
      </CardContent>
    </Card>
  );
}
