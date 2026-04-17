import ListingOrdersClient from '../../../../../components/pages/ListingOrdersClient';

/**
 * The view listing orders page for sellers.
 * Displays all orders associated with a specific produce listing.
 *
 * @param props - The URL parameters containing the listing ID
 * @param props.params - The parameters from the URL
 * @param props.params.id - The listing ID
 * @returns The listing orders client component
 */
export default function ListingOrdersPage({ params }: { params: { id: string } }) {
  return <ListingOrdersClient id={params.id} />;
}
