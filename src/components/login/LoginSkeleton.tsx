'use client';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for the login page layout.
 * Mimics the card structure, dimensions, and padding of LoginClient.
 * @returns An animated placeholder screen for the Suspense boundary.
 */
export function LoginSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header Logo Placeholder */}
      <div className="mb-8 h-12 flex items-center justify-center">
        <Skeleton className="w-37.5 h-8 bg-black/5" />
      </div>

      {/* Login Card Placeholder */}
      <div className="max-w-md w-full bg-card border border-border/20 shadow-sm rounded-xl p-8 space-y-8">
        {/* Title & Subtitle */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <Skeleton className="h-9 w-64 bg-black/5" /> {/* Welcome text */}
          <Skeleton className="h-4 w-72 bg-black/5" /> {/* Subtitle text */}
        </div>

        <div className="space-y-6">
          {/* Google OAuth Button Placeholder */}
          <Skeleton className="w-full h-11 rounded-md bg-black/5" />

          {/* Separator / 'Or magic link' Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-border/40 absolute" />
            <Skeleton className="relative z-10 h-4 w-24 rounded-sm bg-black/5" />
          </div>

          {/* Magic Link Form Placeholders */}
          <div className="space-y-4">
            {/* Input Label & Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 bg-black/5" /> {/* Label */}
              <Skeleton className="w-full h-11 rounded-md bg-black/5" /> {/* Input field */}
            </div>

            {/* Submit Button */}
            <Skeleton className="w-full h-11 rounded-md bg-black/5" />
          </div>
        </div>

        {/* Footer Legal Terms Links */}
        <div className="flex flex-col items-center space-y-1 pt-2">
          <Skeleton className="h-3 w-56 bg-black/5" />
          <Skeleton className="h-3 w-32 bg-black/5" />
        </div>
      </div>
    </div>
  );
}
