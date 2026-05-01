'use client';

import { Card, CardContent } from '@/components/ui/card';
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
 * The loading skeleton for the browse produce page.
 * @returns A table layout with animated skeletons
 */
export function BrowseProduceSkeleton() {
  return (
    <Card className="rounded-xl border border-forest-dark/10 bg-off-white shadow-sm overflow-hidden mt-6">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 bg-slate-50/50">
                <TableHead className="pl-4">
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-10" />
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <TableRow key={i} className="border-border/50">
                  <TableCell className="pl-4 py-4">
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell className="py-4 pr-4">
                    <div className="flex gap-2 justify-end">
                      <Skeleton className="h-6 w-16 rounded-md" />
                      <Skeleton className="h-6 w-20 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
