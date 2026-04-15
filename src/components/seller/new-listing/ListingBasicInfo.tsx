import type { StepComponentProps } from '@/components/pages/AddNewListingClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Collects basic identifier information for the listing.
 * @param props - Form data props
 * @param props.data - Current form data
 * @param props.updateData - Function to update the form data
 * @returns A card with an input for the listing title and type
 */
export function ListingBasicInfo({ data, updateData }: StepComponentProps) {
  return (
    <Card className="rounded-xl border border-forest-dark/10 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-deep-forest">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-ink-2 font-semibold">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            required
            placeholder="e.g. Organic Heirloom Tomatoes"
            className="bg-white border-lime/50 focus-visible:ring-click-green"
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="produceType" className="text-ink-2 font-semibold">
            Produce Type
          </Label>
          <Input
            id="produceType"
            placeholder="e.g. vegetable, fruit, herb"
            className="bg-white border-lime/50 focus-visible:ring-click-green"
            value={data.produceType}
            onChange={(e) => updateData({ produceType: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
