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
import { Textarea } from '@/components/ui/textarea';
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
  const MAX_DESCRIPTION_LENGTH = 500;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-required">*</span>
          </Label>
          <Input
            id="title"
            required
            placeholder="e.g. Organic Heirloom Tomatoes"
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="description">
              Description <span className="text-xs font-normal text-ink-3">(Optional)</span>
            </Label>
            <span
              className={`text-[10px] ${data.description.length >= MAX_DESCRIPTION_LENGTH ? 'text-red-500' : 'text-ink-3'}`}
            >
              {data.description.length} / {MAX_DESCRIPTION_LENGTH}
            </span>
          </div>
          <Textarea
            id="description"
            placeholder="Tell buyers about your growing practices, flavor profile, or suggested uses..."
            rows={4}
            value={data.description}
            maxLength={MAX_DESCRIPTION_LENGTH}
            onChange={(e) => {
              if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                updateData({ description: e.target.value });
              }
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="produceType">Produce Type</Label>
          <Select
            value={data.produceType || 'ALL'}
            onValueChange={(val) =>
              updateData({ produceType: val === 'ALL' ? undefined : (val as ProduceType) })
            }
          >
            <SelectTrigger id="produceType">
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
