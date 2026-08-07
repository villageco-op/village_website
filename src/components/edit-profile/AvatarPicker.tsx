'use client';

import { Camera } from 'lucide-react';
import Image from 'next/image';
import { useRef, useEffect } from 'react';

import { Label } from '@/components/ui/label';

interface AvatarPickerProps {
  label: string;
  value: string | null;
  onChange: (previewUrl: string | null, file: File | null) => void;
}

/**
 * Profile image picker for users and organizations.
 * @param props - Component props
 * @param props.label - The label describing the inputs purpose (e.g., update profile image)
 * @param props.value - The current image value: can be a static network URL, a temporary blob URI, or null
 * @param props.onChange - Emits the newly generated preview URL and the raw browser File up to the parent form
 * @returns A picker component with preview display
 */
export function AvatarPicker({ label, value, onChange }: AvatarPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (value && value.startsWith('blob:')) {
        URL.revokeObjectURL(value);
      }

      const nextPreviewUrl = URL.createObjectURL(file);
      onChange(nextPreviewUrl, file);
    }
  };

  useEffect(() => {
    return () => {
      if (value && value.startsWith('blob:')) {
        URL.revokeObjectURL(value);
      }
    };
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <div
        className="w-20 h-20 rounded-full bg-lime/20 border-2 border-dashed border-lime flex items-center justify-center cursor-pointer overflow-hidden relative group transition-colors hover:border-click-green"
        onClick={() => fileInputRef.current?.click()}
      >
        {value ? (
          <Image
            src={value}
            alt="Profile Image"
            fill
            className="object-cover"
            sizes="80px"
            priority
          />
        ) : (
          <Camera className="w-6 h-6 text-click-green group-hover:scale-110 transition-transform" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-5 h-5 text-white" />
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />

      <Label
        className="text-xs font-semibold text-ink-3 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {label}
      </Label>
    </div>
  );
}
