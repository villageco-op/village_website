import { Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProduceIcon } from '@/components/ui/produce-icon';
import type { ProduceListItem } from '@/lib/api/generated/models';

interface SellerListingCardProps {
  item: ProduceListItem;
  onOrderClicked: () => void;
}

/**
 * Card for displaying a listing in the seller profile listing tab.
 * @param props - Component props
 * @param props.item - The ProduceListItem
 * @param props.onOrderClicked - Callback for the order button
 * @returns A card component
 */
export function SellerListingCard({ item, onOrderClicked }: SellerListingCardProps) {
  return (
    <Card key={String(item.id)}>
      <div className="relative flex h-25 items-center justify-center bg-linear-to-br from-lime-pale to-[#eafaea] text-click-green overflow-hidden">
        {item.thumbnail ? (
          <Image
            src={String(item.thumbnail)}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <ProduceIcon type={item.name} className="h-10 w-10 opacity-60" />
        )}
      </div>
      <CardContent className="p-5 flex flex-col h-[calc(100%-100px)]">
        <div className="mb-1 font-heading text-[1.05rem] font-extrabold text-deep-forest line-clamp-1">
          {item.name}
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Badge className="bg-lime hover:bg-click-green border-none">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-white"></span>
            In Season
          </Badge>
          {item.isSubscribable && (
            <Badge className="bg-deep-forest hover:bg-forest-dark border-none">
              <Calendar className="mr-1 h-3 w-3" /> Subscribable
            </Badge>
          )}
        </div>
        <p className="mb-4 font-sans text-[0.76rem] leading-relaxed text-ink-3 line-clamp-3 flex-1">
          {item.description || 'No description provided for this listing.'}
        </p>

        <div className="mt-auto">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="font-heading text-xl font-extrabold text-deep-forest">
                {item.price}
              </div>
              <div className="font-sans text-[0.72rem] text-ink-3">
                {item.amount} available ·{' '}
                {new Date(item.availableBy).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
          <div className="mt-auto gap-2 flex pt-2">
            <Button variant="lime" className="flex-1" onClick={() => onOrderClicked()}>
              Order
            </Button>
            <Button variant="outline-forest" size="sm" asChild className="flex-1">
              <Link href={`/produce/${item.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
