'use client';

import { Store, Truck, User as UserIcon } from 'lucide-react';
import Image from 'next/image';

import { AddressMap } from '@/components/ui/address-map';
import { Card, CardContent } from '@/components/ui/card';
import type { ProduceDetail } from '@/lib/api/generated/models';

/**
 * Displays seller info and an interactive map showing their pickup location or delivery range.
 * @param props - The props for the info map card
 * @param props.seller - The seller information
 * @returns A map card
 */
export default function SellerInfoMapCard({ seller }: { seller: ProduceDetail['seller'] }) {
  return (
    <Card className="rounded-xl border border-forest-dark/10 bg-white shadow-sm">
      <CardContent className="p-6 pt-0 space-y-6">
        {/* Seller Basic Info */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full overflow-hidden bg-slate-100 border border-border">
            {seller.image ? (
              <Image
                src={seller.image as string}
                alt={seller.organization || seller.name || 'Seller'}
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <UserIcon className="h-6 w-6 text-ink-3" />
            )}
          </div>
          <div>
            <p className="font-bold text-ink">{seller.name || 'Anonymous Grower'}</p>
            <div className="flex items-center gap-2 text-xs text-ink-3 mt-1">
              {seller.canDeliver ? (
                <span className="flex items-center">
                  <Truck className="w-3 h-3 mr-1" /> Delivers ({seller.deliveryRangeMiles}mi)
                </span>
              ) : (
                <span className="flex items-center">
                  <Store className="w-3 h-3 mr-1" /> Pickup Only
                </span>
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
