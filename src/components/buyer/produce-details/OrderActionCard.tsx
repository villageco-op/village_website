'use client';

import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface OrderActionCardProps {
  onOrder: () => void;
}

/**
 * Quick action card for initiating an order.
 * @param props - Props for the action card
 * @param props.onOrder - When order is clicked
 * @returns A small card with a title and button
 */
export default function OrderActionCard({ onOrder }: OrderActionCardProps) {
  return (
    <Card className="rounded-xl border border-forest-dark/10 bg-white shadow-sm">
      <CardContent className="p-6">
        <h3 className="font-heading text-lg font-bold text-deep-forest mb-4">Ready to purchase?</h3>
        <div className="space-y-3">
          <Button
            className="w-full bg-lime text-forest-dark hover:bg-lime/80 font-bold"
            onClick={() => onOrder()}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Order Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
