import PublicSellerProfile from '@/components/seller-profile/PublicSellerProfileClient';

/**
 * The public profile page.
 * @param props - The URL parameters containing the user ID
 * @param props.params - The parameters from the URL
 * @param props.params.id - The user ID
 * @returns The public seller profile client component
 */
export default function PublicProfilePage({ params }: { params: { id: string } }) {
  return <PublicSellerProfile sellerId={params.id} />;
}
