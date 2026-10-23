import { cookies } from 'next/headers';

import BuyerProfile from '@/components/public-profile/BuyerProfileClient';
import SellerProfile from '@/components/public-profile/SellerProfileClient';
import { NotFoundState } from '@/components/ui/state-displays';
import { fetchCurrentUser } from '@/lib/api/user';

/**
 * The public profile page.
 * @param props - The URL parameters containing the user ID
 * @param props.params - The parameters from the URL
 * @param props.params.id - The user ID
 * @returns The public profile client component
 */
export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const user = await fetchCurrentUser(cookieHeader);

  if (!user) {
    return <NotFoundState title="Profile not found" />;
  }

  if (user.stripeOnboardingComplete) {
    return <SellerProfile sellerId={id} />;
  }

  return <BuyerProfile buyerId={id} />;
}
