'use client';

import { AddressMap } from '@/components/ui/address-map';
import { Card } from '@/components/ui/card';
import type { Location } from '@/lib/api/generated/models/location';

/**
 * Props for the plot location card component.
 */
interface PlotLocationCardProps {
  location?: Location;
}

/**
 * A card with a plots location, address, and an interactive map.
 * @param props - The props for seeding a location
 * @param props.location - The initial map location
 * @returns A component containing a pin on an interactive map
 */
export function PlotLocationCard({ location }: PlotLocationCardProps) {
  const address = location?.address || 'No Address';
  const city = location?.city ? `, ${location.city}` : '';
  const fullAddress = `${address}${city}`;

  return (
    <Card className="mb-5 flex flex-col rounded-xl border border-forest-dark/10 p-6 shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <div className="mb-4">
        <h2 className="font-heading text-[0.95rem] font-bold text-ink">
          My Plot — {address}
          {city}
        </h2>
      </div>

      <AddressMap
        lat={location?.lat}
        lng={location?.lng}
        address={fullAddress}
        mapHeight="h-56"
        zoom={14}
      />
    </Card>
  );
}
