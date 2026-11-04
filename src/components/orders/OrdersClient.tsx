'use client';

import { useState } from 'react';

import { OrdersTable } from './OrdersTable';

import { PageHeader } from '@/components/ui/page-header';
import { usePagination } from '@/hooks/usePagination';
import type { GetOrdersParams, OrderStatus, OrderSummary } from '@/lib/api/generated/models';
import { useGetOrders } from '@/lib/api/generated/orders/orders';

interface OrdersClientProps {
  role: 'buyer' | 'seller';
}

/**
 * The orders page with a filterable table of orders.
 * @param props - Component props
 * @param props.role - The user's role. Either buyer or seller.
 * @returns The orders page client component.
 */
export default function OrdersClient({ role }: OrdersClientProps) {
  const { page, limit, setPage, resetPage } = usePagination(12);

  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderSummary | null>(null);

  const queryParams: GetOrdersParams = { role: role, page, limit };

  if (statusFilter !== 'all') {
    queryParams.status = statusFilter;
  }

  const { data: response, isLoading, isError, refetch } = useGetOrders(queryParams);

  const orders = response?.status === 200 ? response.data?.data || [] : [];
  const meta = response?.status === 200 ? response.data?.meta : undefined;

  const totalCount = meta?.total || orders.length;

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Orders"
        subtitle={`Showing ${orders.length} out of ${totalCount} orders.`}
      />

      <OrdersTable
        orders={orders}
        isLoading={isLoading}
        isError={isError}
        userRole="seller"
        statusFilter={statusFilter}
        setStatusFilter={(val) => {
          setStatusFilter(val);
          setSelectedOrder(null);
          resetPage();
        }}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        meta={meta}
        setPage={(newPage) => {
          setPage(newPage);
          setSelectedOrder(null);
        }}
        onRefetch={() => {
          void refetch();
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}
