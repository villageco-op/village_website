import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OrderQuantityInputProps {
  quantityLbs: number;
  onChange: (value: number) => void;
  maxLbs: number;
}

/**
 * The order quantity input for new orders.
 * @param props - Props for the order quantity input
 * @param props.quantityLbs - The current quantity
 * @param props.onChange - When the quantity input is edited
 * @param props.maxLbs - The maximum quantity available
 * @returns An input with a label
 */
export function OrderQuantityInput({ quantityLbs, onChange, maxLbs }: OrderQuantityInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val) || val <= 0) {
      onChange(1);
    } else if (val > maxLbs) {
      onChange(maxLbs);
    } else {
      onChange(val);
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="quantity" className="text-ink-2 font-semibold">
        Quantity (lbs)
      </Label>
      <div className="flex items-center space-x-3">
        <Input
          id="quantity"
          type="number"
          step="0.5"
          min="0.5"
          max={maxLbs}
          value={quantityLbs}
          onChange={handleChange}
          className="h-10 w-24 text-center text-lg font-medium bg-white border-lime/50 focus-visible:ring-click-green"
        />
      </div>
      <p className="text-xs text-ink-3">
        {maxLbs > 0 ? `${maxLbs.toFixed(1)} lbs available` : 'Out of stock'}
      </p>
    </div>
  );
}
