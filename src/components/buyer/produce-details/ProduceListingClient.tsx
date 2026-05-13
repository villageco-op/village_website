'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { VisuallyHidden } from 'radix-ui';
import { useState } from 'react';

import { BuyerOrderForm } from '../new-order/OrderBuyerForm';

import BuyerActivityDashboard from './BuyerActivityDashboard';
import OrderActionCard from './OrderActionCard';
import ProduceHeaderCard from './ProduceHeaderCard';
import ProduceListingSkeleton from './ProduceListingSkeleton';
import ProduceReviews from './ProduceReviews';
import SellerInfoMapCard from './SellerInfoMapCard';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { NotFoundState } from '@/components/ui/state-displays';
import type { ProduceDetail } from '@/lib/api/generated/models';
import { useGetProduce } from '@/lib/api/generated/produce/produce';

interface ProduceListingClientProps {
  id: string;
}

/**
 * Main Client Component for viewing a produce listing as a buyer.
 * @param props - Props for the listing client
 * @param props.id - The produce Id
 * @returns The client component
 */
export default function ProduceListingClient({ id }: ProduceListingClientProps) {
  const router = useRouter();
  const [showOrderForm, setShowOrderForm] = useState(false);

  const produceQuery = useGetProduce(id, { query: { enabled: !!id } });
  const produce = produceQuery.data?.data as ProduceDetail | undefined;

  if (produceQuery.isLoading) {
    return <ProduceListingSkeleton />;
  }

  if (produceQuery.isError || !produce) {
    return (
      <NotFoundState
        title="Listing not found"
        description="We couldn't load the details for this produce listing. It may have been removed."
      />
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation & Header */}
        <Button
          variant="ghost"
          className="mb-6 -ml-3 text-ink-3 hover:text-ink hover:bg-slate-200/50"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Product Info & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            <ProduceHeaderCard produce={produce} />
            <ProduceReviews produceId={id} sellerId={produce.seller.id} />
          </div>

          {/* Right Column: Order Actions, Seller Map, & Buyer Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 items-start">
            <div className="md:col-start-2 md:row-start-2">
              <OrderActionCard onOrder={() => setShowOrderForm(true)} />
            </div>

            <div className="md:col-start-2 md:row-start-1 lg:col-start-1 lg:row-start-2">
              <SellerInfoMapCard seller={produce.seller} />
            </div>

            <div className="md:col-start-1 md:row-start-1 lg:col-start-1 lg:row-start-3">
              <BuyerActivityDashboard produceId={id} sellerId={produce.sellerId} />
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
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
