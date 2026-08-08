import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface OrderSubscriptionToggleProps {
  isSubscription: boolean;
  onChange: (checked: boolean) => void;
  frequencyDays?: number;
}

/**
 * The toggle for setting isSubscription for a new order.
 * @param props - Props for the order subscription toggle
 * @param props.isSubscription - Current toggle value
 * @param props.onChange - When the toggle is clicked
 * @param props.frequencyDays - The harvest frequency (used for the description)
 * @returns A checkbox with a label and explanation
 */
export function OrderSubscriptionToggle({
  isSubscription,
  onChange,
  frequencyDays,
}: OrderSubscriptionToggleProps) {
  return (
    <Card>
      <CardContent className="flex items-start space-x-3 p-4">
        <Checkbox
          id="subscription"
          checked={isSubscription}
          onCheckedChange={(checked) => onChange(checked === true)}
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor="subscription" className="cursor-pointer">
            Subscribe to this item
          </Label>
          <p className="text-sm text-ink-3">
            Automatically receive this order every {frequencyDays || 7} days during the harvest
            season.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
