'use client';

import { Eyebrow } from '../ui/eyebrow';
import { ProduceIcon } from '../ui/produce-icon';

import { QuickOrderSkeleton } from './SellerProfileSkeletons';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ProduceListItem } from '@/lib/api/generated/models';
import { formatAppDate } from '@/lib/date-utils';

interface QuickOrderSectionProps {
  items?: ProduceListItem[];
  isLoading?: boolean;
}

/**
 * The quick order cards for the seller about tab.
 * @param props - Props for the quick order section
 * @param props.items - The produce list items
 * @param props.isLoading - If the items are loading
 * @returns An eyebrow for with cards
 */
export function QuickOrderSection({ items, isLoading }: QuickOrderSectionProps) {
  if (isLoading) {
    return (
      <div>
        <Eyebrow>Quick Order</Eyebrow>
        <QuickOrderSkeleton />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div>
        <Eyebrow>Quick Order</Eyebrow>
        <p className="text-sm text-ink-3">No items available.</p>
      </div>
    );
  }

  return (
    <div>
      <Eyebrow>Quick Order</Eyebrow>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {items.map((item) => (
          <Card
            key={String(item.id)}
            className="rounded-xl border-1.5 border-cream-dark p-4 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="flex items-center font-heading text-[0.95rem] font-extrabold text-deep-forest">
                  <ProduceIcon type={item.name} className="mr-1.5 h-4 w-4 text-lime" /> {item.name}
                </div>
                <div className="font-sans text-[0.72rem] text-ink-3">
                  {item.amount} · {formatAppDate(item.availableBy, 'weekdayDayMonth')}
                </div>
              </div>
              <span className="font-heading text-[1rem] font-extrabold text-deep-forest">
                {item.price}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="lime" className="flex-1">
                + Order
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
