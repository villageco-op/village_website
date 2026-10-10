'use client';

import Image from 'next/image';
import { Popup } from 'react-map-gl/maplibre';

import { Badge } from '@/components/ui/badge';
import type { MapGrower } from '@/lib/api/generated/models';
import { cn } from '@/lib/utils';

interface GrowerMapPopupProps {
  grower: MapGrower;
}

const getPillColor = (index: number) => {
  const styles = [
    'bg-lime/20 text-deep-forest hover:bg-lime/30',
    'bg-sun/20 text-yellow-900 hover:bg-sun/30',
    'bg-clay/10 text-clay hover:bg-clay/20',
  ];
  return styles[index % styles.length];
};

/**
 * The hover popup for displaying grower data in the supply map.
 * @param props Component props
 * @param props.grower The grower information
 * @returns
 */
export function SupplyMapPopup({ grower }: GrowerMapPopupProps) {
  if (grower.lat == null || grower.lng == null) return null;

  return (
    <Popup
      longitude={grower.lng}
      latitude={grower.lat}
      offset={28}
      closeButton={false}
      closeOnClick={false}
      className="z-50 pointer-events-none **:pointer-events-none"
      maxWidth="none"
    >
      <div className="flex items-center gap-3.5 px-2 py-1.5">
        {/* Image on the Left */}
        {grower.image && (
          <Image
            width={52}
            height={52}
            src={grower.image}
            alt={grower.name || 'Grower'}
            className="h-13 w-13 shrink-0 rounded-md object-cover"
          />
        )}

        <div className="flex flex-col justify-center min-w-44 overflow-hidden grow">
          {/* Header row with title on the left and right-aligned distance */}
          <div className="flex items-center justify-between gap-2">
            <div className="font-heading text-sm font-bold text-deep-forest leading-tight truncate">
              {grower.name || 'N/A'}
            </div>

            {grower.distanceMiles != null && (
              <span className="text-xs font-medium text-ink-3 whitespace-nowrap shrink-0">
                {grower.distanceMiles} mi
              </span>
            )}
          </div>

          {/* Specialties Pills */}
          {grower.specialties && grower.specialties.length > 0 && (
            <div className="mt-2 flex flex-nowrap items-center gap-1.5">
              {grower.specialties.slice(0, 2).map((specialty, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className={cn(
                    'border-none px-2 py-0.5 text-xs font-medium leading-tight rounded-sm whitespace-nowrap',
                    getPillColor(i),
                  )}
                >
                  {specialty}
                </Badge>
              ))}
              {grower.specialties.length > 2 && (
                <span className="text-xs text-ink-4 font-medium shrink-0 whitespace-nowrap ml-0.5">
                  +{grower.specialties.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
}
