'use client';

import { VisuallyHidden } from 'radix-ui';
import { useState } from 'react';

import { BuyerOrderForm } from '../buyer/new-order/OrderBuyerForm';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';
import { NotFoundState } from '../ui/state-displays';

import SellerAboutTab from './SellerAboutTab';
import SellerHero from './SellerHero';
import SellerListingsTab from './SellerListingsTab';
import {
  SellerHeroSkeleton,
  SellerStatsRowSkeleton,
  SellerAboutTabSkeleton,
} from './SellerProfileSkeletons';
import SellerReviewsTab from './SellerReviewsTab';
import SellerStatsRow from './SellerStatsRow';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PublicUserProfile } from '@/lib/api/generated/models';
import { useGetProduceList } from '@/lib/api/generated/produce/produce';
import { useGetPublicUserProfile } from '@/lib/api/generated/users/users';

interface PublicSellerProfileProps {
  sellerId: string;
}

/**
 * The public seller profile page. Includes an about tab, listings tab, and reviews tab.
 * @param props - Props for the seller Id
 * @param props.sellerId - The Id of the seller being viewed
 * @returns The seller profile page
 */
export default function PublicSellerProfile({ sellerId }: PublicSellerProfileProps) {
  const [selectedProduceId, setSelectedProduceId] = useState<string | null>(null); // Added state

  const { data: response, isLoading, isError } = useGetPublicUserProfile(sellerId);

  const { data: produceResponse, isLoading: isProduceLoading } = useGetProduceList({
    sellerId: sellerId,
    limit: 2,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-off-white pb-20">
        <SellerHeroSkeleton />
        <div className="container-custom mt-8 max-w-250">
          <SellerStatsRowSkeleton />
          <div className="mt-8">
            <SellerAboutTabSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !response?.data || response.status !== 200) {
    return (
      <NotFoundState
        title="Seller profile not found."
        description="We couldn't load the details for this seller."
      />
    );
  }

  const profile: PublicUserProfile = response.data;
  const quickOrderItems = produceResponse?.data?.data || [];

  return (
    <div className="min-h-screen bg-off-white pb-20">
      <SellerHero profile={profile} />

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
          <SellerStatsRow profile={profile} />

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
