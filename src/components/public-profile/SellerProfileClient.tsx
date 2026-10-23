'use client';

import { VisuallyHidden } from 'radix-ui';
import { useState } from 'react';

import { ProfileHero } from './ProfileHero';
import SellerAboutTab from './SellerAboutTab';
import SellerListingsTab from './SellerListingsTab';
import SellerReviewsTab from './SellerReviewsTab';

import { BuyerOrderForm } from '@/components/buyer/new-order/OrderBuyerForm';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { NotFoundState } from '@/components/ui/state-displays';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetProduceList } from '@/lib/api/generated/produce/produce';
import { useGetSellerProfile } from '@/lib/api/generated/sellers/sellers';

interface SellerProfileProps {
  sellerId: string;
}

/**
 * The seller profile page. Includes an about tab, listings tab, and reviews tab.
 * @param props - Props for the seller Id
 * @param props.sellerId - The Id of the seller being viewed
 * @returns The seller profile page
 */
export default function SellerProfile({ sellerId }: SellerProfileProps) {
  const [selectedProduceId, setSelectedProduceId] = useState<string | null>(null);

  const { data: response, isLoading, isError } = useGetSellerProfile(sellerId);

  const { data: produceResponse, isLoading: isProduceLoading } = useGetProduceList({
    sellerId: sellerId,
    limit: 2,
  });

  if (isLoading) {
    return <LoadingSkeleton heights={['h-64', 'h-128']} />;
  }

  if (isError || !response?.data || response.status !== 200) {
    return <NotFoundState title="Profile not found." />;
  }

  const profile = response.data;
  const quickOrderItems = produceResponse?.data?.data || [];

  return (
    <div className="min-h-screen pb-20">
      <ProfileHero
        name={profile.name}
        image={profile.image}
        joinedAt={profile.joinedAt as string | null}
        city={profile.city}
        state={profile.state}
        starRating={profile.starRating}
      />

      <Tabs defaultValue="about">
        <TabsList className="h-auto w-full justify-start rounded-none border-none bg-deep-forest p-0">
          <TabsTrigger
            value="about"
            className="cursor-pointer rounded-none border-transparent font-heading font-bold text-ink-3 data-[state=active]:border-b-2 data-[state=active]:border-b-lime  data-[state=active]:bg-transparent data-[state=active]:text-cream hover:text-cream"
          >
            About
          </TabsTrigger>
          <TabsTrigger
            value="listings"
            className="cursor-pointer rounded-none border-transparent font-heading font-bold text-ink-3 data-[state=active]:border-b-2 data-[state=active]:border-b-lime data-[state=active]:bg-transparent data-[state=active]:text-cream hover:text-cream"
          >
            Listings
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="cursor-pointer rounded-none border-transparent font-heading font-bold text-ink-3 data-[state=active]:border-b-2 data-[state=active]:border-b-lime data-[state=active]:bg-transparent data-[state=active]:text-cream hover:text-cream"
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        <div className="w-full container-custom mt-8 max-w-250">
          <div className="mt-8">
            <TabsContent value="about" className="m-0 focus-visible:outline-none">
              <SellerAboutTab
                profile={profile}
                quickOrderItems={quickOrderItems}
                isQuickOrderLoading={isProduceLoading}
              />
            </TabsContent>
            <TabsContent value="listings" className="w-full m-0 focus-visible:outline-none">
              <SellerListingsTab
                sellerId={sellerId}
                onOrderItem={(id) => setSelectedProduceId(id)}
              />
            </TabsContent>
            <TabsContent value="reviews" className="m-0 focus-visible:outline-none">
              <SellerReviewsTab sellerId={sellerId} profile={profile} />
            </TabsContent>
          </div>
        </div>
      </Tabs>

      <Dialog
        open={!!selectedProduceId}
        onOpenChange={(open) => !open && setSelectedProduceId(null)}
      >
        <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
          <VisuallyHidden.Root>
            <DialogTitle>Order Form</DialogTitle>
            <DialogDescription>Place an order for this produce item.</DialogDescription>
          </VisuallyHidden.Root>
          {selectedProduceId && (
            <BuyerOrderForm
              produceId={selectedProduceId}
              onClose={() => setSelectedProduceId(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
