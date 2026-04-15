import { AlertTriangle, Pause, Play, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ListingStatusActionsProps {
  status: string;
  onToggleStatus: () => void;
  onDelete: () => void;
  isPending: boolean;
}

/**
 * Component for handling listing status toggles and deletion.
 * @param props - Component props
 * @param props.status - The current listing status
 * @param props.onToggleStatus - Function to call when toggling status
 * @param props.onDelete - Function to call when deleting the listing
 * @param props.isPending - Boolean to indicate a toggle or delete is pending
 * @returns A danger zone card
 */
export function ListingStatusActions({
  status,
  onToggleStatus,
  onDelete,
  isPending,
}: ListingStatusActionsProps) {
  const isPaused = status === 'paused';

  return (
    <Card className="rounded-xl border border-red-200 shadow-sm bg-red-50/30">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-red-900 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
          Danger Zone & Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-ink-3">
          Manage the visibility of this listing or permanently remove it from your marketplace.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            type="button"
            variant="outline"
            className="bg-white text-ink-2 hover:bg-slate-50 border-gray-300"
            onClick={onToggleStatus}
            disabled={isPending}
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume Listing
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause Listing
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onDelete}
            disabled={isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Listing
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
