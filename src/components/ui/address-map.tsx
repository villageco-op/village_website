'use client';

import { Check, Copy, ExternalLink, MapPin } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AddressMapProps {
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
  zoom?: number;
  className?: string;
  mapHeight?: string;
}

export function AddressMap({
  lat,
  lng,
  address = 'No address provided',
  zoom = 14,
  className,
  mapHeight = 'h-52',
}: AddressMapProps) {
  const [copied, setCopied] = useState(false);

  // Default to Gary, IN if coordinates aren't provided
  const displayLat = lat ?? 41.5934;
  const displayLng = lng ?? -87.3464;
  const displayAddress = address || 'No address provided';

  const handleCopy = () => {
    navigator.clipboard.writeText(displayAddress).catch(() => {
      toast.error('Failed to copy address');
    });
    setCopied(true);
    toast.success('Address copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMap = () => {
    const url =
      lat && lng
        ? `https://www.google.com/maps/search/?api=1&query=${displayLat},${displayLng}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Map Container */}
      <div className={cn(
        "relative flex w-full items-center justify-center overflow-hidden rounded-[10px] bg-[#e8f0e0] border border-border/50",
        mapHeight
      )}>
        <Map
          initialViewState={{
            longitude: displayLng,
            latitude: displayLat,
            zoom: zoom,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          attributionControl={false}
        >
          <NavigationControl position="top-right" showCompass={false} />

          <Marker longitude={displayLng} latitude={displayLat} anchor="bottom">
            <div className="text-[2.2rem] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-bottom-2 duration-1000 text-deep-forest">
              <MapPin />
            </div>
          </Marker>
        </Map>
      </div>

      {/* Address and Actions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-2 text-sm text-ink-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="font-medium text-ink leading-snug">{displayAddress}</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-white text-ink-3 hover:text-ink text-xs font-semibold"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="mr-1.5 h-3.5 w-3.5 text-lime-600" />
            ) : (
              <Copy className="mr-1.5 h-3.5 w-3.5" />
            )}
            <span className="hidden min-[360px]:inline">{copied ? 'Copied!' : 'Copy Address'}</span>
            <span className="inline min-[360px]:hidden">{copied ? 'Copied!' : 'Copy'}</span>
          </Button>
          <Button
            variant="forest"
            size="sm"
            className="flex-1 text-xs font-semibold"
            onClick={handleOpenMap}
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Open Maps
          </Button>
        </div>
      </div>
    </div>
  );
}
