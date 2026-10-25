'use client';

import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ClearFiltersButton } from '@/components/ui/clear-filters-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusPill } from '@/components/ui/status-pill';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import RadioCell, {
  AmountCell,
  DateTimeCell,
  IdentityCell,
  LocationCell,
  OrderProductCell,
} from '@/components/ui/table-cells';
import { TablePageCardShell } from '@/components/ui/table-page-card-shell';
import { SelectableTableRow } from '@/components/ui/table-row-selectable';
import { TableSelectionIndicator } from '@/components/ui/table-selection-indicator';
import type { OrderSummary, OrderStatus, PaginationMetadata } from '@/lib/api/generated/models';

/**
 * Properties for the OrdersTable component.
 */
interface OrdersTableProps {
  orders: OrderSummary[];
  isLoading: boolean;
  isError: boolean;
  userRole: 'buyer' | 'seller';
  statusFilter: OrderStatus | 'all';
  setStatusFilter: (filter: OrderStatus | 'all') => void;
  selectedOrder: OrderSummary | null;
  setSelectedOrder: (order: OrderSummary | null) => void;
  meta?: PaginationMetadata;
  setPage: (page: number) => void;
  onRefetch: () => void;
}

/**
 * Table displaying orders utilizing the TablePageCardShell layout pattern,
 * with selectable rows via radio buttons, status filter inline on the left, and key actions in the top right.
 *
 * @param props Component properties
 * @param props.orders Array of order summaries to display
 * @param props.isLoading Whether the orders data is currently loading
 * @param props.isError Whether an error occurred while fetching orders
 * @param props.userRole Role of the current user viewing the table
 * @param props.statusFilter Current status filter value
 * @param props.setStatusFilter Callback to update the status filter
 * @param props.selectedOrder Currently selected order row, if any
 * @param props.setSelectedOrder Callback to update the selected order
 * @param props.meta Pagination metadata object
 * @param props.setPage Callback to change the active page
 * @param props.onRefetch Callback to refetch data on error recovery or manual retry
 * @returns The rendered orders table component.
 */
export function OrdersTable({
  orders,
  isLoading,
  isError,
  userRole,
  statusFilter,
  setStatusFilter,
  selectedOrder,
  setSelectedOrder,
  meta,
  setPage,
  onRefetch,
}: OrdersTableProps) {
  const router = useRouter();
  const hasFilters = statusFilter !== 'all';

  const filtersSlot = (
    <>
      <Select
        value={statusFilter}
        onValueChange={(val) => setStatusFilter(val as OrderStatus | 'all')}
      >
        <SelectTrigger title="Status Filter" className="w-full sm:w-40 h-9 text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && <ClearFiltersButton onClear={() => setStatusFilter('all')} />}
    </>
  );

  const selectionIndicatorSlot = selectedOrder ? (
    <TableSelectionIndicator
      selectionText={selectedOrder.items[0]?.product.title || selectedOrder.items[0]?.product.id}
    />
  ) : null;

  const actionsSlot = (
    <Button
      variant="outline"
      size="sm"
      disabled={!selectedOrder}
      onClick={() => {
        if (selectedOrder) {
          router.push(`/orders/${selectedOrder.id}`);
        }
      }}
      className="h-8 gap-1.5 px-3 text-xs"
    >
      <Eye className="h-3.5 w-3.5" />
      View Details
    </Button>
  );

  return (
    <TablePageCardShell
      isLoading={isLoading}
      isError={isError}
      isEmpty={orders.length === 0}
      onRetry={onRefetch}
      meta={meta}
      setPage={setPage}
      emptyTitle="No orders found"
      emptyDescription="No orders match your current filter criteria."
      filters={filtersSlot}
      selectionIndicator={selectionIndicatorSlot}
      actions={actionsSlot}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">Select</TableHead>
            <TableHead className="w-75">Product / Order</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date / Time</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const itemsCount = order.items?.length || 0;
            const extraItemsCount = itemsCount > 1 ? itemsCount - 1 : 0;
            const firstItem = order.items?.[0];
            const product = firstItem?.product;

            const counterparty =
              order.counterparty || (userRole === 'seller' ? order.buyer : order.seller);
            const counterpartyName = counterparty?.name || userRole;
            const counterpartyId = userRole === 'seller' ? order.buyerId : order.sellerId;
            const dateValue = order.scheduledTime || order.createdAt;

            const isSelected = selectedOrder?.id === order.id;

            return (
              <SelectableTableRow
                id={order.id}
                key={order.id}
                onSelect={() => setSelectedOrder(order)}
                isSelected={isSelected}
              >
                <RadioCell
                  name="order-selection"
                  isSelected={isSelected}
                  onChange={() => setSelectedOrder(order)}
                />

                <OrderProductCell
                  title={product?.title}
                  image={product?.images?.[0]}
                  extraCount={extraItemsCount}
                />

                <IdentityCell
                  id={counterpartyId}
                  name={counterpartyName}
                  avatarFallback={false}
                  onNameClick={
                    counterpartyId
                      ? () => {
                          void router.push(`/public-profile/${counterpartyId}`);
                        }
                      : undefined
                  }
                />

                <LocationCell location={counterparty?.location} />

                <DateTimeCell date={dateValue} />

                <AmountCell amount={order.totalAmount} />

                <TableCell className="py-3.5 text-center">
                  <StatusPill status={order.status} />
                </TableCell>
              </SelectableTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TablePageCardShell>
  );
}
