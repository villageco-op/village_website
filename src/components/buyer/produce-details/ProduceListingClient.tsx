'use client';

import { ShoppingCart } from 'lucide-react';
import { VisuallyHidden } from 'radix-ui';
import { useState } from 'react';

import { BuyerOrderForm } from '../new-order/OrderBuyerForm';

import BuyerActivityDashboard from './BuyerActivityDashboard';
import ProduceHeaderCard from './ProduceHeaderCard';
import ProduceReviews from './ProduceReviews';
import SellerInfoMapCard from './SellerInfoMapCard';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { PageHeader } from '@/components/ui/page-header';
import { NotFoundState } from '@/components/ui/state-displays';
import { useGetProduce } from '@/lib/api/generated/produce/produce';

interface ProduceListingClientProps {
  id: string;
}

/**
 * Main Client Component for viewing a produce listing as a buyer.
 * @param props Props for the listing client
 * @param props.id The produce Id
 * @returns The client component
 */
export default function ProduceListingClient({ id }: ProduceListingClientProps) {
  const [showOrderForm, setShowOrderForm] = useState(false);

  const { isError, isLoading, data } = useGetProduce(id, { query: { enabled: !!id } });

  if (isLoading) {
    return <LoadingSkeleton heights={['h-8', 'h-125', 'h-64']} />;
  }

  if (isError || data?.status !== 200 || !data.data) {
    return (
      <NotFoundState
        title="Listing not found"
        description="We couldn't load the details for this produce listing. It may have been removed."
      />
    );
  }

  const produce = data.data;

  return (
    <div>
      <div className="flex flex-col w-full mx-auto gap-6">
        <PageHeader
          title={produce.title}
          subtitle={
            <p className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="capitalize">
                {produce.produceType?.replace('_', ' ')}
              </Badge>
              {produce.isSubscribable && (
                <Badge className="bg-lime text-forest-dark">Subscribable</Badge>
              )}
            </p>
          }
          actions={
            <div className="flex items-center gap-4">
              <div className="flex flex-col text-right">
                <p className="text-2xl font-bold text-ink font-heading">
                  ${produce.pricePerOz}{' '}
                  <span className="text-base font-normal text-ink-3">/ oz</span>
                </p>
              </div>
              <Button variant="lime" onClick={() => setShowOrderForm(true)}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Order Now
              </Button>
            </div>
          }
        />

        <div className="flex flex-col gap-8 w-full">
          <ProduceHeaderCard produce={produce} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <SellerInfoMapCard seller={produce.seller} />
            <BuyerActivityDashboard produceId={id} sellerId={produce.sellerId} />
          </div>

          <ProduceReviews produceId={id} sellerId={produce.seller.id} />
        </div>
      </div>

      <Dialog open={showOrderForm} onOpenChange={(open) => !open && setShowOrderForm(false)}>
        <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
          <VisuallyHidden.Root>
            <DialogTitle>Order Form for {produce.title}</DialogTitle>
            <DialogDescription>Complete the form below to place your order.</DialogDescription>
          </VisuallyHidden.Root>

          <BuyerOrderForm produceId={id} onClose={() => setShowOrderForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
