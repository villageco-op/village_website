import type { StepComponentProps } from '@/components/seller/new-listing/AddNewListingClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Handles UI for Pricing & Inventory in Lbs, which gets converted to Oz later.
 * @param props - Form data props
 * @param props.data - Current form data
 * @param props.updateData - Function to update the form data
 * @returns A card with an input for listing price and inventory
 */
export function ListingPricingInventory({ data, updateData }: StepComponentProps) {
  return (
    <Card className="rounded-xl border border-forest-dark/10 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-deep-forest">Pricing & Inventory</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-ink-2 font-semibold">
            Price per lb ($) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            required
            min="0.01"
            placeholder="0.00"
            className="bg-white border-lime/50 focus-visible:ring-click-green"
            value={data.pricePerLb}
            onChange={(e) => updateData({ pricePerLb: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inventory" className="text-ink-2 font-semibold">
            Total Inventory (lbs) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="inventory"
            type="number"
            step="0.1"
            required
            min="0.1"
            placeholder="e.g. 50"
            className="bg-white border-lime/50 focus-visible:ring-click-green"
            value={data.totalLbsInventory}
            onChange={(e) => updateData({ totalLbsInventory: e.target.value })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="maxOrder" className="text-ink-2 font-semibold">
            Max Order per Customer (lbs)
          </Label>
          <Input
            id="maxOrder"
            type="number"
            step="0.1"
            min="0"
            placeholder="No limit (leave empty)"
            className="bg-white border-lime/50 focus-visible:ring-click-green"
            value={data.maxOrderLbs}
            onChange={(e) => updateData({ maxOrderLbs: e.target.value })}
          />
          <p className="text-xs text-ink-3">
            Limits the quantity a single customer can buy in one checkout.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
