import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OrderQuantityInputProps {
  quantityOz: number;
  onChange: (value: number) => void;
  maxOz: number;
}

/**
 * The order quantity input for new orders.
 * @param props - Props for the order quantity input
 * @param props.quantityOz - The current quantity
 * @param props.onChange - When the quantity input is edited
 * @param props.maxOz - The maximum quantity available
 * @returns An input with a label
 */
export function OrderQuantityInput({ quantityOz, onChange, maxOz }: OrderQuantityInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val) || val <= 0) {
      onChange(1);
    } else if (val > maxOz) {
      onChange(maxOz);
    } else {
      onChange(val);
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="quantity">Quantity (oz)</Label>
      <div className="flex items-center space-x-3">
        <Input
          id="quantity"
          type="number"
          step="0.1"
          min="0.1"
          max={maxOz}
          value={quantityOz}
          onChange={handleChange}
          className="max-w-24"
        />
      </div>
      <p className="text-xs text-ink-3">
        {maxOz > 0 ? `${maxOz.toFixed(1)} oz available` : 'Out of stock'}
      </p>
    </div>
  );
}
