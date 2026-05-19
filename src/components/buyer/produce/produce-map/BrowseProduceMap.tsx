'use client';

import { Leaf, MapPin, Store } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { ProduceIcon } from '@/components/ui/produce-icon';
import type { SellerMapGroup } from '@/lib/api/generated/models';

interface BrowseProduceMapProps {
  baseLat: number;
  baseLng: number;
  mapGroups: SellerMapGroup[];
  onSelectGroup: (group: SellerMapGroup) => void;
}

/**
 * Renders an interactive MapLibre map visualizing local sellers and their available produce.
 * @param props - The produce map props
 * @param props.baseLat - The buyers latitude
 * @param props.baseLng - The buyers longitude
 * @param props.mapGroups - The groups of sellers and produce
 * @param props.onSelectGroup - When a node is clicked
 * @returns A map component with clickable nodes
 */
export function BrowseProduceMap({
  baseLat,
  baseLng,
  mapGroups,
  onSelectGroup,
}: BrowseProduceMapProps) {
  const [hoveredGroup, setHoveredGroup] = useState<SellerMapGroup | null>(null);

  return (
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
      <NavigationControl position="bottom-right" showCompass={false} />

      {/* Base Store/User Location Pin */}
      <Marker longitude={baseLng} latitude={baseLat} anchor="bottom">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-deep-forest border-2 border-white shadow-lg drop-shadow-md z-20 transition-transform hover:scale-110"
          title="Your Location"
        >
          <Store className="h-5 w-5 text-white" />
        </div>
      </Marker>

      {/* Dynamic Grower Pins */}
      {mapGroups.map((group, idx) => {
        if (group.lat == null || group.lng == null) return null;

        return (
          <Marker
            key={`${String(group.sellerId)}-${idx}`}
            longitude={group.lng}
            latitude={group.lat}
            anchor="bottom"
          >
            <div
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-lime border-2 border-white text-deep-forest shadow-[0_4px_12px_rgba(0,0,0,0.15)] drop-shadow-sm transition-transform hover:scale-125 hover:z-30"
              onMouseEnter={() => setHoveredGroup(group)}
              onMouseLeave={() => setHoveredGroup(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectGroup(group);
              }}
            >
              <div className="h-4 w-4">
                <ProduceIcon type={group.produce[0].type} className="h-full w-full" />
              </div>
            </div>
          </Marker>
        );
      })}

      {/* Hover Popup Overlay showing produce details */}
      {hoveredGroup && hoveredGroup.lat != null && hoveredGroup.lng != null && (
        <Popup
          longitude={hoveredGroup.lng}
          latitude={hoveredGroup.lat}
          offset={16}
          closeButton={false}
          closeOnClick={false}
          className="z-50"
          maxWidth="300px"
        >
          <div
            className="flex flex-col gap-2 p-1"
            onMouseEnter={() => setHoveredGroup(hoveredGroup)}
            onMouseLeave={() => setHoveredGroup(null)}
          >
            <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-1 cursor-pointer">
              <div className="font-heading text-[0.85rem] font-bold text-deep-forest flex items-center hover:underline">
                <MapPin className="h-3.5 w-3.5 mr-1 text-ink-3" />
                {hoveredGroup.organization || hoveredGroup.name}
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto pr-1 space-y-2">
              {hoveredGroup.produce.map((item) => (
                <div key={String(item.id)} className="flex items-center gap-2 group">
                  {item.thumbnail ? (
                    <Image
                      src={String(item.thumbnail)}
                      alt={item.name}
                      width={32}
                      height={32}
                      className="h-8 w-8 shrink-0 rounded-md object-cover border border-forest-dark/10"
                    />
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 border border-border">
                      <Leaf className="h-4 w-4 text-ink-4" />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col overflow-hidden font-sans">
                    <div className="text-[0.75rem] font-semibold text-ink-1 truncate leading-tight">
                      {item.name}
                    </div>
                    <div className="text-[0.65rem] text-ink-3 font-medium flex items-center gap-1.5 leading-tight mt-0.5">
                      <span className="text-deep-forest">${item.price}/oz</span>
                      <span className="text-ink-4/50">•</span>
                      <span>{(Number(item.availableInventory) / 16).toFixed(1)} lbs left</span>
                    </div>
                  </div>
                </div>
              ))}

              {hoveredGroup.produce.length === 0 && (
                <div className="text-[0.7rem] text-ink-4 italic py-2 text-center">
                  No active listings available.
                </div>
              )}
            </div>
          </div>
        </Popup>
      )}

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 rounded-lg bg-white/95 p-3 shadow-sm backdrop-blur-sm border border-border/50 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-deep-forest border border-white shadow-sm">
            <Store className="h-3 w-3 text-white" />
          </div>
          <span className="text-xs font-semibold text-ink-2">Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lime border border-white shadow-sm">
            <Leaf className="h-3 w-3 text-deep-forest" strokeWidth={2.5} />
          </div>
          <span className="text-xs font-semibold text-ink-2">Active Sellers</span>
        </div>
      </div>
    </Map>
  );
}
