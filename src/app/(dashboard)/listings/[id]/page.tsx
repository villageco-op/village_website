import ProduceListingClient from '@/components/buyer/produce-details/ProduceListingClient';

/**
 * The produce details page for buyers.
 * @param props - The URL parameters containing the produce listing ID
 * @param props.params - The parameters from the URL
 * @param props.params.id - The produce ID
 * @returns The produce details client component
 */
export default async function ProduceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProduceListingClient id={id} />;
}
