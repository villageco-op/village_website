'use client';

import { House, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { SupplyMapPopup } from './SupplyMapPopup';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { InlineErrorState } from '@/components/ui/state-displays';
import { useAuth } from '@/hooks/useAuth';
import { useGetGrowersForMap } from '@/lib/api/generated/growers/growers';
import type { MapGrower } from '@/lib/api/generated/models';

interface SupplyMapCardProps {
  localGrowersSupplying: number;
}

/**
 * A card displaying a map of a buyer's sourcing network and local economic impact.
 * Fetches dynamic grower locations from the API.
 *
 * @param props - The props containing mapping metadata
 * @param props.localGrowersSupplying - Amount of unique growers the buyer has ordered from
 * @returns A component with a map and statistics
 */
export function SupplyMapCard({ localGrowersSupplying }: SupplyMapCardProps) {
  const { user, status } = useAuth();
  const router = useRouter();

  const [hoveredGrower, setHoveredGrower] = useState<MapGrower | null>(null);

  const {
    data: response,
    isLoading: isGrowersLoading,
    isError,
  } = useGetGrowersForMap({
    buyerId: user?.id,
  });

  const isLoading = isGrowersLoading || status === 'loading';

  // Use Gary, IN bounds as fallback base point if user location is missing
  const baseLat = user?.lat ?? 41.602;
  const baseLng = user?.lng ?? -87.3371;

  let growers: MapGrower[] = [];

  if (response?.status === 200) {
    growers = response?.data || [];
  }

  return (
    <Card className="flex flex-col w-full">
      <CardContent>
        <div className="mb-5">
          <h2 className="font-heading text-[0.95rem] font-bold text-ink">Your Supply Map</h2>
          <p className="mt-0.5 font-sans text-[0.78rem] text-ink-3">
            {localGrowersSupplying} active growers
          </p>
        </div>

        {/* Map Container */}
        <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-[10px] bg-linear-to-br from-[#e8f0e0] to-[#d4e6c8]">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-[10px]" />
          ) : isError ? (
            <InlineErrorState title="Failed to load map data" />
          ) : (
            <Map
              initialViewState={{
                longitude: baseLng,
                latitude: baseLat,
                zoom: 11,
              }}
              style={{ width: '100%', height: '100%' }}
              mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
              attributionControl={false}
            >
              <NavigationControl position="top-right" showCompass={false} />

              {/* Base Store Pin */}
              <Marker longitude={baseLng} latitude={baseLat} anchor="bottom">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-deep-forest border-2 border-white shadow-lg drop-shadow-md z-20 transition-transform"
                  title="Your Location"
                >
                  <House className="h-5 w-5 text-white" />
                </div>
              </Marker>

              {growers.map((grower) => {
                if (grower.lat == null || grower.lng == null) return null;

                return (
                  <Marker
                    key={String(grower.sellerId)}
                    longitude={grower.lng}
                    latitude={grower.lat}
                    anchor="bottom"
                  >
                    <div
                      className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full bg-lime border-2 border-white text-deep-forest shadow-lg drop-shadow-md z-20 transition-transform hover:scale-110"
                      onMouseEnter={() => setHoveredGrower(grower)}
                      onMouseLeave={() => setHoveredGrower(null)}
                      onClick={() => router.push(`/public-profile/${grower.sellerId}`)}
                      title={grower.name || 'Grower'}
                    >
                      <Store className="h-5 w-5" />
                    </div>
                  </Marker>
                );
              })}

              {hoveredGrower && <SupplyMapPopup grower={hoveredGrower} />}
            </Map>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
