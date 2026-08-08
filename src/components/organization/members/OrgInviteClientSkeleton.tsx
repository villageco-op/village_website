'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for the OrgInviteClient component.
 * @returns An animated skeleton page matching the invitation flow layout.
 */
export function OrgInviteSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      {/* Header Skeleton with Back Button */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" /> {/* Back Button icon */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-72" /> {/* Page Title */}
            <Skeleton className="h-4 w-96" /> {/* Subtitle */}
          </div>
        </div>
      </div>

      {/* InviteMembersForm Skeleton Layout */}
      <div className="flex flex-col gap-6">
        {/* The Form Card */}
        <Card className="rounded-xl border border-border bg-white shadow-sm">
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-5 w-36" /> {/* Form Section Title */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-20" /> {/* Label */}
                <Skeleton className="h-10 w-full" /> {/* Input Field */}
              </div>
              <div className="space-y-2 sm:w-48">
                <Skeleton className="h-4 w-12" /> {/* Label */}
                <Skeleton className="h-10 w-full" /> {/* Select Dropdown */}
              </div>
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" /> {/* Submit Button */}
            </div>
          </CardContent>
        </Card>

        {/* Invited Members Table List Placeholder */}
        <Card className="rounded-xl border border-border bg-white shadow-sm">
          <CardContent className="p-6">
            <Skeleton className="mb-6 h-5 w-48" /> {/* Section Title */}
            <div className="space-y-4">
              {/* Fake Table Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>

              {/* Fake Table Rows */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b py-4 last:border-0"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
