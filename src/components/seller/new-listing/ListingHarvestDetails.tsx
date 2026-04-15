import type { StepComponentProps } from '@/components/pages/AddNewListingClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Collects information related to harvest cycles, seasons, and subscription capabilities.
 * @param props - Form data props
 * @param props.data - Current form data
 * @param props.updateData - Function to update the form data
 * @returns A card with an input for harvest season and frequency
 */
export function ListingHarvestDetails({ data, updateData }: StepComponentProps) {
  return (
    <Card className="rounded-xl border border-forest-dark/10 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-deep-forest">Harvest & Delivery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="availableBy" className="text-ink-2 font-semibold">
              Available By
            </Label>
            <Input
              id="availableBy"
              type="datetime-local"
              className="bg-white border-lime/50 focus-visible:ring-click-green"
              value={data.availableBy}
              onChange={(e) => updateData({ availableBy: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="harvestFrequency" className="text-ink-2 font-semibold">
              Harvest Frequency (Days) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="harvestFrequency"
              type="number"
              min="0"
              required
              placeholder="e.g. 7"
              className="bg-white border-lime/50 focus-visible:ring-click-green"
              value={data.harvestFrequencyDays}
              onChange={(e) => updateData({ harvestFrequencyDays: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="seasonStart" className="text-ink-2 font-semibold">
              Season Start <span className="text-red-500">*</span>
            </Label>
            <Input
              id="seasonStart"
              type="date"
              required
              className="bg-white border-lime/50 focus-visible:ring-click-green"
              value={data.seasonStart}
              onChange={(e) => updateData({ seasonStart: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seasonEnd" className="text-ink-2 font-semibold">
              Season End <span className="text-red-500">*</span>
            </Label>
            <Input
              id="seasonEnd"
              type="date"
              required
              className="bg-white border-lime/50 focus-visible:ring-click-green"
              value={data.seasonEnd}
              onChange={(e) => updateData({ seasonEnd: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="isSubscribable"
            checked={data.isSubscribable}
            onCheckedChange={(checked) => updateData({ isSubscribable: checked as boolean })}
            className="data-[state=checked]:bg-click-green data-[state=checked]:border-click-green"
          />
          <Label htmlFor="isSubscribable" className="text-ink-2 font-semibold cursor-pointer">
            Allow customers to set up recurring orders for this item
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
