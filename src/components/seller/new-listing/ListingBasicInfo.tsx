import type { StepComponentProps } from '@/components/seller/new-listing/AddNewListingClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProduceType } from '@/lib/api/generated/models';
import { formatProduceType } from '@/lib/produce-utils';

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
          <Select
            value={data.produceType || 'ALL'}
            onValueChange={(val) =>
              updateData({ produceType: val === 'ALL' ? undefined : (val as ProduceType) })
            }
          >
            <SelectTrigger id="produceType" className="h-9 bg-white text-sm">
              <SelectValue placeholder="All Produce" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Produce</SelectItem>
              {Object.entries(ProduceType).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {formatProduceType(key)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
