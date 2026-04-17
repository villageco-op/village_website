'use client';

import { Check, Copy, ExternalLink, MapPin } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { OrderDetailResponse } from '@/lib/api/generated/models';

interface OrderLocationCardProps {
  order: OrderDetailResponse;
}

/**
 * Displays an interactive map with the fulfillment location.
 * - If pickup, shows the seller's location.
 * - If delivery, shows the buyer's location.
 *
 * @param props - Component props
 * @param props.order - The specific order detailing fulfillment type and users
 * @returns A card with a interactive map and open in Google Maps button
 */
export function OrderLocationCard({ order }: OrderLocationCardProps) {
  const [copied, setCopied] = useState(false);

  const isDelivery = order.fulfillmentType?.toLowerCase() === 'delivery';

  const targetUser = isDelivery ? order.buyer : order.seller;
  const location = targetUser?.location;

  const title = isDelivery ? 'Delivery Location' : 'Pickup Location';
  const headerIcon = isDelivery ? '🚚' : '🏪';
  const address =
    typeof location?.address === 'string'
      ? location.address
      : location?.address
        ? String(location.address)
        : 'No address provided';

  // Default to Gary, IN if coordinates aren't provided
  const lat = location?.lat ?? 41.5934;
  const lng = location?.lng ?? -87.3464;

  const handleCopy = () => {
    navigator.clipboard.writeText(address).catch(() => {
      toast.error('Failed to copy address');
    });
    setCopied(true);
    toast.success('Address copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMap = () => {
    const url =
      location?.lat && location?.lng
        ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  return (
    <Card className="rounded-xl border border-forest-dark/10 bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-border/50 pb-3">
          <span className="text-lg leading-none">{headerIcon}</span>
          <h2 className="font-heading text-[0.95rem] font-bold text-ink">{title}</h2>
        </div>

        {/* Map Container */}
        <div className="relative mb-4 flex h-52 w-full items-center justify-center overflow-hidden rounded-[10px] bg-[#e8f0e0] border border-border/50">
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
            <NavigationControl position="top-right" showCompass={false} />

            <Marker longitude={lng} latitude={lat} anchor="bottom">
              <div className="text-[2.2rem] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-bottom-2 duration-1000">
                📍
              </div>
            </Marker>
          </Map>
        </div>

        {/* Address and Actions */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2 text-sm text-ink-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="font-medium text-ink leading-snug">{address}</span>
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
              {copied ? 'Copied!' : 'Copy Address'}
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
      </CardContent>
    </Card>
  );
}
