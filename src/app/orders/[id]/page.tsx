import OrderDetailClient from '../../../components/orders/OrderDetailClient';

/**
 * The view specific order page.
 * Accessible by both the buyer and seller of the order.
 *
 * @param props - The URL parameters containing the order ID
 * @param props.params - The parameters from the URL
 * @param props.params.id - The order ID
 * @returns The order detail client component
 */
export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return <OrderDetailClient id={params.id} />;
}
