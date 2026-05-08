'use client';

import { MapPin } from 'lucide-react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Badge } from '@/components/ui/badge';
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

  // Default to Gary, IN if coordinates aren't provided
  const lat = location?.lat ?? 41.5934;
  const lng = location?.lng ?? -87.3464;

  return (
    <Card className="mb-5 flex flex-col rounded-xl border border-forest-dark/10 p-6 shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <div className="mb-4">
        <h2 className="font-heading text-[0.95rem] font-bold text-ink">
          My Plot — {address}
          {city}
        </h2>
      </div>

      {/* Map Container */}
      <div className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-[10px] bg-[#e8f0e0]">
        <Map
          initialViewState={{
            longitude: lng,
            latitude: lat,
            zoom: 14,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          attributionControl={false}
        >
          {/* Navigation Control */}
          <NavigationControl position="top-right" showCompass={false} />

          {/* Location Pin */}
          <Marker longitude={lng} latitude={lat} anchor="bottom">
            <div className="text-[2rem] drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] animate-in fade-in slide-in-from-bottom-2 duration-1000">
              <MapPin className="text-deep-forest" />
            </div>
          </Marker>
        </Map>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="font-sans text-[0.78rem] text-ink-3">
          Registered to: <span className="text-ink">Village System</span>
        </div>
        <Badge
          variant="outline"
          className="border-0 bg-lime-pale px-2.5 py-1 font-heading text-[0.65rem] font-bold uppercase tracking-[0.05em] text-click-green rounded-full"
        >
          Plot Active
        </Badge>
      </div>
    </Card>
  );
}
