import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { PaginationMetadata } from '@/lib/api/generated/models';
import { cn } from '@/lib/utils';

interface PaginationControlsProps {
  meta?: PaginationMetadata;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationControls({ meta, onPageChange, className }: PaginationControlsProps) {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className={cn("mt-6 flex items-center justify-between px-2", className)}>
      <div className="text-sm text-muted-foreground">
        Showing page <span className="font-medium text-ink">{meta.page}</span> of{' '}
        <span className="font-medium text-ink">{meta.totalPages}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page <= 1}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
