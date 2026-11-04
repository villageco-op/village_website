import OrdersClient from '../../../../components/orders/OrdersClient';

/**
 * The seller orders page containing pending and past orders.
 * @returns The seller orders client
 */
export default function SellerOrders() {
  return <OrdersClient role="seller" />;
}
