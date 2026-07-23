'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

/**
 * Skeleton loader designed to match the updated UI layout of the ClientsTable.
 * Renders placeholder rows matching Select, Name, Email, Phone Number, Address, and Referrals.
 * @param props - Component props
 * @param props.rowCount - Number of placeholder rows to display (defaults to 5)
 * @returns The skeleton component
 */
export function ClientsTableSkeleton({ rowCount = 5 }: { rowCount?: number }) {
  const skeletonRows = Array.from({ length: rowCount }, (_, i) => i);

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableBody>
          {skeletonRows.map((index) => (
            <TableRow key={index} className="hover:bg-transparent">
              {/* Radio Select Column */}
              <TableCell className="py-4">
                <Skeleton className="h-4 w-4 rouded-full" />
              </TableCell>

              {/* Name Column */}
              <TableCell className="py-4">
                <Skeleton className="h-4 w-32" />
              </TableCell>

              {/* Email Column */}
              <TableCell className="py-4">
                <Skeleton className="h-4 w-40" />
              </TableCell>

              {/* Phone Number Column */}
              <TableCell className="py-4">
                <Skeleton className="h-4 w-28" />
              </TableCell>

              {/* Address Column */}
              <TableCell className="py-4">
                <Skeleton className="h-4 w-48" />
              </TableCell>

              {/* Referrals Column */}
              <TableCell className="py-4">
                <Skeleton className="h-4 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
