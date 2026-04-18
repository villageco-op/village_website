import type { Order, Payout } from './api/generated/models';

/**
 * Generates a CSV file from the payouts data and triggers a browser download.
 * @param payouts - Seller payouts array
 */
export const handleDownloadSellerPayoutsCSV = (payouts: Payout[]) => {
  if (payouts.length === 0) return;

  const headers = ['Date', 'Crop', 'Qty Sold (lbs)', 'Buyer', 'Amount ($)'];

  const rows = payouts.map((payout) => [
    new Date(payout.date).toLocaleDateString(),
    `"${payout.productName}"`, // Encapsulate in quotes to handle potential commas
    payout.quantityLbs,
    `"${payout.buyerName}"`,
    payout.amountDollars.toFixed(2),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', `payout_history_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generates a comprehensive CSV file for all listed historical orders.
 * @param orders - List of orders
 */
export const handleDownloadBuyerInvoicesCSV = (orders: Order[]) => {
  if (orders.length === 0) return;

  const headers = ['Date', 'Order ID', 'Fulfillment Type', 'Status', 'Total ($)'];

  const rows = orders.map((order) => [
    order.scheduledTime ? new Date(order.scheduledTime).toLocaleDateString() : 'N/A',
    order.id,
    order.fulfillmentType,
    order.status || 'unknown',
    Number(order.totalAmount || 0).toFixed(2),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', `invoice_history_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
