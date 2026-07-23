'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

/**
 * Skeleton loader designed to match the specific UI layout of the MembersTable.
 * Renders placeholder rows reflecting Member Info, Role, and Action controls.
 * @param props - Component props
 * @param props.rowCount - Number of placeholder rows to display (defaults to 5)
 * @returns The skeleton component without headers
 */
export function MembersTableSkeleton({ rowCount = 5 }: { rowCount?: number }) {
  const skeletonRows = Array.from({ length: rowCount }, (_, i) => i);

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableBody>
          {skeletonRows.map((index) => (
            <TableRow key={index} className="hover:bg-transparent">
              {/* Member Info Column */}
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  {/* Avatar circle */}
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex flex-col gap-1.5">
                    {/* Name */}
                    <Skeleton className="h-4 w-32" />
                    {/* Email */}
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </TableCell>

              {/* Role Column */}
              <TableCell className="py-4">
                {/* Pill/badge shape */}
                <Skeleton className="h-5 w-20 rounded-full" />
              </TableCell>

              {/* Actions Column */}
              <TableCell className="py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* Change Role Button */}
                  <Skeleton className="h-8 w-24 rounded-md" />
                  {/* Remove Button */}
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
