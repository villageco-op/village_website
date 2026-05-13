'use client';

import { Truck, Store } from 'lucide-react';

import { AddressMap } from '../ui/address-map';

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
  const isDelivery = order.fulfillmentType?.toLowerCase() === 'delivery';

  const targetUser = isDelivery ? order.buyer : order.seller;
  const location = targetUser?.location;

  const title = isDelivery ? 'Delivery Location' : 'Pickup Location';
  const headerIcon = isDelivery ? <Truck /> : <Store />;

  return (
    <Card className="rounded-xl border border-forest-dark/10 bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-border/50 pb-3">
          <span className="leading-none h-5 w-5 text-ink-3">{headerIcon}</span>
          <h2 className="font-heading text-[0.95rem] font-bold text-ink">{title}</h2>
        </div>

        <AddressMap
          lat={location?.lat}
          lng={location?.lng}
          address={location?.address ? String(location.address) : null}
        />
      </CardContent>
    </Card>
  );
}
