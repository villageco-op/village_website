import type { Payout } from './api/generated/models';

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
