import OrdersClient from '@/components/orders/OrdersClient';

/**
 * The buyer orders page containing pending and past orders.
 * @returns The buyer orders client
 */
export default function BuyerOrders() {
  return <OrdersClient role="buyer" />;
}
