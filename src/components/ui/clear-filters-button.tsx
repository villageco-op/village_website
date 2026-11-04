import { X } from "lucide-react";

import { Button } from "./button";

interface ClearFiltersButtonProps {
  onClear: () => void;
}

/**
 * Clear filters button for resetting selected filters.
 * @param props - Component props
 * @param props.onClear - Callback for clearing filters 
 * @returns A button component
 */
export function ClearFiltersButton({
  onClear,
}: ClearFiltersButtonProps) {
  return (
    <Button
      onClick={() => onClear()}
      variant="outline-forest"
      size="sm"
    >
      <X className="mr-1.5 h-3.5 w-3.5" />
      Clear Filters
    </Button>
  );
};
