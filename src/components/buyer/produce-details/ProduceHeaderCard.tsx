'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ImageGallery } from '@/components/ui/image-gallery';
import type { ProduceDetails } from '@/lib/api/generated/models';
import { formatAppDate } from '@/lib/date-utils';

interface ProduceHeaderCardProps {
  produce: ProduceDetails;
}

/**
 * Displays the main produce details, constrained image gallery, and description.
 * @param props The header card props
 * @param props.produce The produce details
 * @returns A full width header displaying images and structured details
 */
export default function ProduceHeaderCard({ produce }: ProduceHeaderCardProps) {
  const images = (produce.images as string[]) || [];

  return (
    <Card className="overflow-hidden">
      <div className="w-full h-72 sm:h-96 relative bg-slate-900">
        <ImageGallery
          images={images}
          title={produce.title}
          className="w-full h-full"
          imageClassName="object-cover w-full"
        />
      </div>

      <CardContent className="p-6 sm:p-8">
        <div className="space-y-4 mb-8">
          <h3 className="font-heading font-semibold text-lg text-deep-forest border-b border-border/50 pb-2">
            Description
          </h3>
          <p className="text-ink whitespace-pre-wrap">
            {produce.description || 'No description provided by the seller.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border/50">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
              Available By
            </span>
            <p className="font-medium text-ink">
              {formatAppDate(produce.availableBy, 'short', 'TBD')}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
              Harvest Frequency
            </span>
            <p className="font-medium text-ink">Every {produce.harvestFrequencyDays} days</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
              Season Start
            </span>
            <p className="font-medium text-ink">
              {formatAppDate(produce.seasonStart, 'short', 'N/A')}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
              Season End
            </span>
            <p className="font-medium text-ink">
              {formatAppDate(produce.seasonEnd, 'short', 'N/A')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
