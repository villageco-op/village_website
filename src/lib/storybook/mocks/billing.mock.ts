import type { BillingSummaryResponse } from '@/lib/api/generated/models';

export const BASE_MOCK_BILLING_SUMMARY: BillingSummaryResponse = {
  totalSpent: 842.5,
  totalProduceLbs: 312,
  avgCostPerLb: 2.7,
  localSourcingPercentage: 92,
};
