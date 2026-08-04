import EditListingClient from '../../../../../../components/seller/edit-listing/EditListingClient';

/**
 * The edit listing page for sellers.
 * @param props - The URL parameters containing the listing ID
 * @param props.params - The parameters from the URL
 * @param props.params.id - The listing ID
 * @returns The edit listing client
 */
export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditListingClient id={id} />;
}
