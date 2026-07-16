'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * Skeleton loader designed to match the specific UI layout of the MembersTable.
 * Renders a mock table layout with placeholder bars.
 * @param props - Component props
 * @param props.rowCount - Number of placeholder rows to display (defaults to 5)
 * @returns An skeleton loading component with table rows
 */
export function MembersTableSkeleton({ rowCount = 5 }: { rowCount?: number }) {
  const skeletonRows = Array.from({ length: rowCount }, (_, i) => i);

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-[rgba(42,75,40,0.08)]">
            <TableHead className="font-heading text-[0.7rem] font-bold uppercase tracking-wider text-ink-3">
              Member Information
            </TableHead>
            <TableHead className="font-heading text-[0.7rem] font-bold uppercase tracking-wider text-ink-3">
              Role Designation
            </TableHead>
            <TableHead className="font-heading text-[0.7rem] font-bold uppercase tracking-wider text-ink-3 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonRows.map((index) => (
            <TableRow key={index} className="border-[rgba(42,75,40,0.05)] hover:bg-transparent">
              {/* Member Info Column */}
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  {/* Avatar circle */}
                  <Skeleton className="h-9 w-9 rounded-full bg-slate-100" />
                  <div className="flex flex-col gap-1.5">
                    {/* Name */}
                    <Skeleton className="h-4 w-32 bg-slate-100" />
                    {/* Email */}
                    <Skeleton className="h-3 w-48 bg-slate-100" />
                  </div>
                </div>
              </TableCell>

              {/* Role Column */}
              <TableCell className="py-4">
                {/* Pill/badge shape */}
                <Skeleton className="h-5 w-20 rounded-full bg-slate-100" />
              </TableCell>

              {/* Actions Column */}
              <TableCell className="py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* Change Role Button */}
                  <Skeleton className="h-8 w-24 rounded-md bg-slate-100" />
                  {/* Remove Button */}
                  <Skeleton className="h-8 w-20 rounded-md bg-slate-100" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
