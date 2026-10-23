import type { StepComponentProps } from '@/components/seller/new-listing/AddNewListingClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Handles UI for Pricing & Inventory in Oz.
 * @param props - Form data props
 * @param props.data - Current form data
 * @param props.updateData - Function to update the form data
 * @returns A card with an input for listing price and inventory
 */
export function ListingPricingInventory({ data, updateData }: StepComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing & Inventory</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">
            Price per oz ($) <span className="text-required">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            required
            min="0.01"
            placeholder="0.00"
            value={data.pricePerOz}
            onChange={(e) => updateData({ pricePerOz: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inventory">
            Total Inventory (oz) <span className="text-required">*</span>
          </Label>
          <Input
            id="inventory"
            type="number"
            step="0.01"
            required
            min="0.01"
            placeholder="e.g. 50"
            value={data.totalOzInventory}
            onChange={(e) => updateData({ totalOzInventory: e.target.value })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="maxOrder">Max Order per Customer (oz)</Label>
          <Input
            id="maxOrder"
            type="number"
            step="0.01"
            min="0"
            placeholder="No limit (leave empty)"
            value={data.maxOrderOz}
            onChange={(e) => updateData({ maxOrderOz: e.target.value })}
          />
          <p className="text-xs text-ink-3">
            Limits the quantity a single customer can buy in one checkout.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
