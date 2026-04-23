'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useGetGrowersForMap } from '@/lib/api/generated/growers/growers';
import type { MapGrower } from '@/lib/api/generated/models';
import { cn } from '@/lib/utils';

interface SupplyMapCardProps {
  localGrowersSupplying: number;
  avgGrowerDistanceMiles: number;
}

/**
 * A card displaying a map of a buyer's sourcing network and local economic impact.
 * Fetches dynamic grower locations from the API.
 *
 * @param props - The props containing mapping metadata
 * @param props.localGrowersSupplying - Amount of unique growers the buyer has ordered from
 * @param props.avgGrowerDistanceMiles - Average distance between buyer and growers
 * @returns A component with a map and statistics
 */
export function SupplyMapCard({
  localGrowersSupplying,
  avgGrowerDistanceMiles,
}: SupplyMapCardProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [hoveredGrower, setHoveredGrower] = useState<MapGrower | null>(null);

  const {
    data: response,
    isLoading,
    isError,
  } = useGetGrowersForMap({
    buyerId: user?.id,
  });

  // Use Gary, IN bounds as fallback base point if user location is missing
  const baseLat = user?.lat ?? 41.602;
  const baseLng = user?.lng ?? -87.3371;

  if (isLoading) {
    return (
      <Card className="mb-5 flex flex-col rounded-xl border border-forest-dark/10 p-6 shadow-sm h-100">
        <div className="mb-5 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="flex-1 w-full rounded-[10px]" />
      </Card>
    );
  }

  let growers: MapGrower[] = [];

  if (response?.status === 200) {
    growers = response?.data || [];
  }

  const getPillColor = (index: number) => {
    const styles = [
      'bg-lime/20 text-deep-forest hover:bg-lime/30',
      'bg-sun/20 text-yellow-900 hover:bg-sun/30',
      'bg-clay/10 text-clay hover:bg-clay/20',
    ];
    return styles[index % styles.length];
  };

  return (
    <Card className="mb-5 flex flex-col rounded-xl border border-forest-dark/10 p-6 shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <div className="mb-5">
        <h2 className="font-heading text-[0.95rem] font-bold text-ink">Your Supply Map</h2>
        <p className="mt-0.5 font-sans text-[0.78rem] text-ink-3">
          {localGrowersSupplying} active growers · All within{' '}
          {Math.ceil(avgGrowerDistanceMiles * 1.5)} miles
        </p>
      </div>

      {/* Map Container */}
      <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-[10px] bg-linear-to-br from-[#e8f0e0] to-[#d4e6c8]">
        {isError ? (
          <div className="text-sm font-bold text-destructive">Failed to load map data</div>
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
              <div className="text-[1.5rem] drop-shadow-md z-10" title="Your Store">
                📍
              </div>
            </Marker>

            {/* Dynamic Grower Pins */}
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
                    className="text-[1.2rem] drop-shadow-sm cursor-pointer transition-transform hover:scale-125"
                    onMouseEnter={() => setHoveredGrower(grower)}
                    onMouseLeave={() => setHoveredGrower(null)}
                    onClick={() => router.push(`/seller/${grower.sellerId}`)}
                  >
                    🌱
                  </div>
                </Marker>
              );
            })}

            {/* Hover Popup Overlay */}
            {hoveredGrower && hoveredGrower.lat != null && hoveredGrower.lng != null && (
              <Popup
                longitude={hoveredGrower.lng}
                latitude={hoveredGrower.lat}
                offset={14}
                closeButton={false}
                closeOnClick={false}
                className="z-50 pointer-events-none"
                maxWidth="none"
              >
                <div className="flex items-center gap-3 px-1 py-0.5">
                  {/* Image on the Left */}
                  {hoveredGrower.image && (
                    <Image
                      src={hoveredGrower.image}
                      alt={hoveredGrower.name || 'Grower'}
                      className="h-10 w-10 shrink-0 rounded-full object-cover shadow-sm border border-forest-dark/10"
                    />
                  )}

                  {/* Text on the Right */}
                  <div className="flex flex-col justify-center min-w-30 overflow-hidden">
                    <div className="font-heading text-[0.75rem] font-bold text-deep-forest leading-tight truncate">
                      {hoveredGrower.name || 'Local Grower'}
                    </div>

                    {/* Rating, City, and Distance */}
                    <div className="text-[0.62rem] text-ink-3 mt-0.5 flex flex-wrap items-center gap-x-1 leading-tight">
                      {hoveredGrower.rating > 0 ? (
                        <span className="flex items-center gap-0.5 whitespace-nowrap">
                          <span className="text-sun-dark">⭐</span>
                          {hoveredGrower.rating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-ink-4 whitespace-nowrap">New</span>
                      )}

                      {(hoveredGrower.city || hoveredGrower.distanceMiles != null) && (
                        <span className="text-ink-4/50">•</span>
                      )}

                      {hoveredGrower.city && (
                        <span className="truncate max-w-16.25">{hoveredGrower.city}</span>
                      )}

                      {hoveredGrower.city && hoveredGrower.distanceMiles != null && (
                        <span className="text-ink-4/50">•</span>
                      )}

                      {hoveredGrower.distanceMiles != null && (
                        <span className="whitespace-nowrap">{hoveredGrower.distanceMiles} mi</span>
                      )}
                    </div>

                    {/* Specialties Pills (Max 2 to prevent overcrowding) */}
                    {hoveredGrower.specialties && hoveredGrower.specialties.length > 0 && (
                      <div className="mt-1.5 flex flex-nowrap gap-1">
                        {hoveredGrower.specialties.slice(0, 2).map((specialty, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className={cn(
                              'border-none px-1.5 py-[0.1rem] text-[0.55rem] font-medium leading-tight rounded-sm whitespace-nowrap',
                              getPillColor(i),
                            )}
                          >
                            {specialty}
                          </Badge>
                        ))}
                        {hoveredGrower.specialties.length > 2 && (
                          <span className="text-[0.55rem] text-ink-4 self-center ml-0.5 font-medium shrink-0 whitespace-nowrap">
                            +{hoveredGrower.specialties.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            )}

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-heading text-[0.65rem] font-bold tracking-[0.08em] uppercase text-deep-forest opacity-80 whitespace-nowrap bg-white/80 px-2 py-0.5 rounded shadow-sm pointer-events-none">
              Gary, IN · Your sourcing network
            </div>
          </Map>
        )}
      </div>

      {/* Legend Pills */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className="border-0 bg-deep-forest/10 text-deep-forest px-2.5 py-1 font-heading text-[0.65rem] font-bold uppercase tracking-[0.05em] rounded-full"
        >
          📍 Your store
        </Badge>
        <Badge
          variant="outline"
          className="border-0 bg-lime-pale text-click-green px-2.5 py-1 font-heading text-[0.65rem] font-bold uppercase tracking-[0.05em] rounded-full"
        >
          🌱 Active growers
        </Badge>
        <Badge
          variant="outline"
          className="border-0 bg-sun-light text-[#8a6000] px-2.5 py-1 font-heading text-[0.65rem] font-bold uppercase tracking-[0.05em] rounded-full"
        >
          avg {avgGrowerDistanceMiles.toFixed(1)} mi away
        </Badge>
      </div>

      {/* Impact Box */}
      <div className="mt-3.5 rounded-lg bg-lime-pale p-3.5">
        <div className="mb-1 font-heading text-[0.78rem] font-bold text-deep-forest">
          🌿 Your impact this month
        </div>
        <div className="font-sans text-[0.76rem] leading-[1.55] text-ink-2">
          Every order keeps dollars in our local community. This month your purchases supported{' '}
          <strong>{localGrowersSupplying} local families.</strong>
        </div>
      </div>
    </Card>
  );
}
