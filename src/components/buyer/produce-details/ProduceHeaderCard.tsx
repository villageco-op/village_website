'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ImageGallery } from '@/components/ui/image-gallery';
import type { ProduceDetail } from '@/lib/api/generated/models';
import { formatAppDate } from '@/lib/date-utils';

/**
 * Displays the main produce details, images, and description.
 * @param props - The header card props
 * @param props.produce - The produce details
 * @returns A full width header displaying large images and details
 */
export default function ProduceHeaderCard({ produce }: { produce: ProduceDetail }) {
  const pricePerLb = (Number(produce.pricePerOz) * 16).toFixed(2);
  const totalLbs = (Number(produce.totalOzInventory) / 16).toFixed(1);
  const images = (produce.images as string[]) || [];

  return (
    <Card className="overflow-hidden rounded-xl border border-forest-dark/10 bg-white shadow-sm">
      <ImageGallery images={images} title={produce.title} />

      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className="text-forest-dark border-forest-dark/30 capitalize"
              >
                {produce.produceType?.replace('_', ' ')}
              </Badge>
              {produce.isSubscribable && (
                <Badge className="bg-lime text-forest-dark hover:bg-lime-light">Subscribable</Badge>
              )}
            </div>
            <h1 className="font-heading text-3xl font-bold text-deep-forest">{produce.title}</h1>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-2xl font-bold text-ink">
              ${pricePerLb} <span className="text-base font-normal text-ink-3">/ lb</span>
            </p>
            <p className="text-sm text-ink-3 mt-1">{totalLbs} lbs available</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-lg text-deep-forest border-b border-border/50 pb-2">
            Description
          </h3>
          <p className="text-ink whitespace-pre-wrap">
            {produce.description || 'No description provided by the seller.'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/50">
          <div>
            <p className="text-xs text-ink-3 mb-1">Available By</p>
            <p className="font-medium text-ink">
              {formatAppDate(produce.availableBy, 'short', 'TBD')}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-3 mb-1">Harvest Frequency</p>
            <p className="font-medium text-ink">Every {produce.harvestFrequencyDays} days</p>
          </div>
          <div>
            <p className="text-xs text-ink-3 mb-1">Season Start</p>
            <p className="font-medium text-ink">
              {formatAppDate(produce.seasonStart, 'short', 'N/A')}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-3 mb-1">Season End</p>
            <p className="font-medium text-ink">
              {formatAppDate(produce.seasonEnd, 'short', 'N/A')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
