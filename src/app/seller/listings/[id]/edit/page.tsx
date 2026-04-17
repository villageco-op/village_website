import EditListingClient from '../../../../../components/pages/EditListingClient';

/**
 * The edit listing page for sellers.
 * @param props - The URL parameters containing the listing ID
 * @param props.params - The parameters from the URL
 * @param props.params.id - The listing ID
 * @returns The edit listing client
 */
export default function EditListingPage({ params }: { params: { id: string } }) {
  return <EditListingClient id={params.id} />;
}
