import type { ReactNode } from "react";

import { TableRow } from "./table";

interface SelectableTableRowProps {
  id: string;
  onSelect: () => void;
  isSelected?: boolean;
  children: ReactNode;
}

/**
 * A keyboard accessable and selectable table row.
 * @param props - Component props
 * @param props.id - The row id and data-test-id
 * @param props.onSelect - Callback for click events
 * @param props.isSelected - Is the row selected
 * @param props.children - Passthrough component
 * @returns A TableRow component
 */
export function SelectableTableRow({
  id,
  onSelect,
  isSelected,
  children,
}: SelectableTableRowProps) {
  return (
    <TableRow
    key={id}
    data-testid={id}
    tabIndex={0}
    role="row"
    onClick={() => onSelect()}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect();
      }
    }}
    className={`cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${
        isSelected ? 'bg-muted/60' : ''
    }`}
    >
      {children}
    </TableRow>
  );
}
