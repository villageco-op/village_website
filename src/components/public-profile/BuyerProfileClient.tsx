'use client';

import BuyerAboutTab from './BuyerAboutTab';
import { ProfileHero } from './ProfileHero';

import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { NotFoundState } from '@/components/ui/state-displays';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetBuyerProfile } from '@/lib/api/generated/buyers/buyers';

interface BuyerProfileProps {
  buyerId: string;
}

/**
 * The public buyer profile page.
 * @param props - Props for the buyer Id
 * @param props.buyerId - The Id of the buyer being viewed
 * @returns The buyer profile page
 */
export default function BuyerProfile({ buyerId }: BuyerProfileProps) {
  const { data: response, isLoading, isError } = useGetBuyerProfile(buyerId);

  if (isLoading) {
    return <LoadingSkeleton heights={['h-64', 'h-128']} />;
  }

  if (isError || !response?.data || response.status !== 200) {
    return <NotFoundState title="Profile not found." />;
  }

  const profile = response.data;

  return (
    <div className="min-h-screen pb-20">
      <ProfileHero
        name={profile.name}
        image={profile.image}
        joinedAt={profile.joinedAt as string | null}
        city={profile.city}
        state={profile.state}
      />

      <Tabs defaultValue="about">
        <TabsList className="h-auto w-full justify-start rounded-none border-none bg-deep-forest p-0">
          <TabsTrigger
            value="about"
            disabled
            className="rounded-none border-transparent font-heading font-bold text-ink-3 data-[state=active]:border-b-2 data-[state=active]:border-b-lime  data-[state=active]:bg-transparent data-[state=active]:text-cream"
          >
            About
          </TabsTrigger>
        </TabsList>

        <div className="w-full container-custom mt-8 max-w-250">
          <div className="mt-8">
            <TabsContent value="about" className="m-0 focus-visible:outline-none">
              <BuyerAboutTab profile={profile} />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
