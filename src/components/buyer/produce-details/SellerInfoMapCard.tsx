'use client';

import { AddressMap } from '@/components/ui/address-map';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import type { ProduceDetails } from '@/lib/api/generated/models';

/**
 * Displays seller info and an interactive map showing their pickup location or delivery range.
 * @param props - The props for the info map card
 * @param props.seller - The seller information
 * @returns A map card
 */
export default function SellerInfoMapCard({ seller }: { seller: ProduceDetails['seller'] }) {
  return (
    <Card>
      <CardContent className="p-6 pt-0 space-y-6">
        <div className="flex items-center gap-3">
          <Avatar>
            {seller.image && (
              <AvatarImage
                src={seller.image}
                alt={seller.name || 'Seller'}
                className="object-cover"
              />
            )}
            <AvatarFallback>{(seller.name || seller.id)[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-ink">{seller.name || 'Anonymous Grower'}</p>
            <div className="flex items-center gap-2 text-xs text-ink-3 mt-1">
              {seller.canDeliver ? (
                <span className="flex items-center">Delivers ({seller.deliveryRangeMiles}mi)</span>
              ) : (
                <span className="flex items-center">Pickup Only</span>
              )}
            </div>
          </div>
        </div>

        <AddressMap
          lat={seller.location?.lat}
          lng={seller.location?.lng}
          address={seller.location?.address}
          mapHeight="h-48"
          zoom={12}
        />
      </CardContent>
    </Card>
  );
}
