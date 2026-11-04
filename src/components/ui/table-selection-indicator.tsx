interface TableSelectionIndicatorProps {
  selectionText: string;
}

/**
 * Selected item indicator for tables.
 * @param props - Component props
 * @param props.selectionText - The selected item name or title 
 * @returns A span containing "Selected: ..."
 */
export function TableSelectionIndicator({
  selectionText
}: TableSelectionIndicatorProps) {
  return (
    <span>
      Selected:{' '}
      <strong className="text-foreground">
        {selectionText}
      </strong>
    </span>
  );
}
