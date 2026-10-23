'use client';

import { AddressMap } from '@/components/ui/address-map';
import { Card, CardContent } from '@/components/ui/card';
import { FulfillmentType, type UserBasicInfo } from '@/lib/api/generated/models';

interface OrderLocationCardProps {
  fulfillmentType: FulfillmentType;
  buyer: UserBasicInfo;
  seller: UserBasicInfo;
}

/**
 * Displays an interactive map with the fulfillment location.
 * @param props - Component props
 * @param props.fulfillmentType - The order fulfillment type
 * @param props.buyer - The buyer user info
 * @param props.seller - The seller user info
 * @returns A card with a interactive map and open in Google Maps button
 */
export function OrderLocationCard({ fulfillmentType, buyer, seller }: OrderLocationCardProps) {
  const isDelivery = fulfillmentType === FulfillmentType.delivery;
  const targetUser = isDelivery ? buyer : seller;
  const location = targetUser?.location;

  const title = isDelivery ? 'Delivery Location' : 'Pickup Location';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-border/50 pb-3">
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
