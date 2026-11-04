'use client';

import type { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { InlineErrorState, EmptyState } from '@/components/ui/state-displays';
import type { PaginationMetadata } from '@/lib/api/generated/models';

/**
 * Properties for the TablePageCardShell component.
 */
interface TablePageCardShellProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  onRetry: () => void;
  meta?: PaginationMetadata;
  setPage: (page: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  filters: ReactNode;
  selectionIndicator?: ReactNode;
  actions: ReactNode;
  children: ReactNode;
}

/**
 * A reusable layout shell for registry tables providing a standardized card container,
 * top bar layout (filters left, selection center, actions right), inline state management
 * (loading skeletons, errors with retry, empty states), and pagination.
 * 
 * @param props - Component properties
 * @param props.isLoading - Whether data is currently loading
 * @param props.isError - Whether an error occurred during data fetching
 * @param props.isEmpty - Whether the table data is empty
 * @param props.onRetry - Callback to retry data fetching on error
 * @param props.meta - Pagination metadata object
 * @param props.setPage - Callback when page changes
 * @param props.emptyTitle - Custom title for the empty state
 * @param props.emptyDescription - Custom description for the empty state
 * @param props.filters - Filter elements rendered in the top-left slot
 * @param props.selectionIndicator - Selection indicator rendered in the center slot
 * @param props.actions - Action buttons rendered in the top-right slot
 * @param props.children - The table or primary content rendered inside the shell
 * @returns The rendered registry card shell component.
 */
export function TablePageCardShell({
  isLoading,
  isError,
  isEmpty,
  onRetry,
  meta,
  setPage,
  emptyTitle = 'No records found',
  emptyDescription = 'No records match your current filter criteria.',
  filters,
  selectionIndicator,
  actions,
  children,
}: TablePageCardShellProps) {
  return (
    <Card>
      <CardContent>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {filters}
          </div>

          <div className="text-xs text-muted-foreground">
            {selectionIndicator}
          </div>

          <div className="flex items-center gap-2">
            {actions}
          </div>
        </div>

        {isLoading ? (
          <LoadingSkeleton heights={['h-12', 'h-64']} />
        ) : isError ? (
          <InlineErrorState
            title="Unable to load records"
            description="An issue occurred fetching your data. Please try again."
            onRetry={onRetry}
          />
        ) : isEmpty ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          <div className="overflow-x-auto">
            {children}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <PaginationControls meta={meta} onPageChange={setPage} />
        )}
      </CardContent>
    </Card>
  );
}
