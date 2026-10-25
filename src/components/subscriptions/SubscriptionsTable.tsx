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
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import RadioCell, {
  IdentityCell,
  DateTimeCell,
  LocationCell,
  FulfillmentCell,
  QuantityOzCell,
  SubscriptionProductCell,
  StatusCell,
} from '@/components/ui/table-cells';
import { TablePageCardShell } from '@/components/ui/table-page-card-shell';
import { SelectableTableRow } from '@/components/ui/table-row-selectable';
import { TableSelectionIndicator } from '@/components/ui/table-selection-indicator';
import type {
  SubscriptionDetailResponse,
  SubscriptionStatus,
  PaginationMetadata,
} from '@/lib/api/generated/models';

/**
 * Properties for the SubscriptionsTable component.
 */
interface SubscriptionsTableProps {
  subscriptions: SubscriptionDetailResponse[];
  isLoading: boolean;
  isError: boolean;
  userRole: 'buyer' | 'seller';
  statusFilter: SubscriptionStatus | 'all';
  setStatusFilter: (filter: SubscriptionStatus | 'all') => void;
  selectedSubscription: SubscriptionDetailResponse | null;
  setSelectedSubscription: (sub: SubscriptionDetailResponse | null) => void;
  meta?: PaginationMetadata;
  setPage: (page: number) => void;
  onRefetch: () => void;
}

/**
 * Table displaying subscriptions utilizing the RegistryCardShell layout pattern,
 * with selectable rows via radio buttons, status filter inline on the left, and key actions in the top right.
 * @param props - Component properties
 * @param props.subscriptions - Array of subscription detail responses to display
 * @param props.isLoading - Whether the subscriptions data is currently loading
 * @param props.isError - Whether an error occurred while fetching subscriptions
 * @param props.userRole - Role of the current user viewing the table
 * @param props.statusFilter - Current status filter value
 * @param props.setStatusFilter - Callback to update the status filter
 * @param props.selectedSubscription - Currently selected subscription row, if any
 * @param props.setSelectedSubscription - Callback to update the selected subscription
 * @param props.meta - Pagination metadata object
 * @param props.setPage - Callback to change the active page
 * @param props.onRefetch - Callback to refetch data on error recovery or manual retry
 * @returns The rendered subscriptions table component.
 */
export function SubscriptionsTable({
  subscriptions,
  isLoading,
  isError,
  userRole,
  statusFilter,
  setStatusFilter,
  selectedSubscription,
  setSelectedSubscription,
  meta,
  setPage,
  onRefetch,
}: SubscriptionsTableProps) {
  const router = useRouter();
  const hasFilters = statusFilter !== 'all';

  const filtersSlot = (
    <>
      <Select
        value={statusFilter}
        onValueChange={(val) => setStatusFilter(val as SubscriptionStatus | 'all')}
      >
        <SelectTrigger title="Status Filter" className="w-full sm:w-40 h-9 text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="paused">Paused</SelectItem>
          <SelectItem value="canceled">Canceled</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && <ClearFiltersButton onClear={() => setStatusFilter('all')} />}
    </>
  );

  const selectionIndicatorSlot = selectedSubscription ? (
    <TableSelectionIndicator
      selectionText={selectedSubscription.product?.title || selectedSubscription.product.id}
    />
  ) : null;

  const actionsSlot = (
    <Button
      variant="outline"
      size="sm"
      disabled={!selectedSubscription}
      onClick={() => {
        if (selectedSubscription) {
          router.push(`/${userRole}/subscriptions/${selectedSubscription.id}`);
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
      isEmpty={subscriptions.length === 0}
      onRetry={onRefetch}
      meta={meta}
      setPage={setPage}
      emptyTitle="No subscriptions found"
      emptyDescription="No subscriptions match your current filter criteria."
      filters={filtersSlot}
      selectionIndicator={selectionIndicatorSlot}
      actions={actionsSlot}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">Select</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>From</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Next Order</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((sub) => {
            const counterparty = userRole === 'seller' ? sub.buyer : sub.seller;
            const counterpartyName = counterparty?.name || '-';
            const counterpartyId = counterparty?.id || '';
            const counterpartyImage = counterparty?.image;

            const product = sub.product;
            const productTitle = product?.title || '-';
            const productId = sub.productId || sub.product?.id;
            const isSelected = selectedSubscription?.id === sub.id;

            return (
              <SelectableTableRow
                id={sub.id}
                key={sub.id}
                onSelect={() => setSelectedSubscription(sub)}
                isSelected={isSelected}
              >
                <RadioCell
                  name="subscription-selection"
                  isSelected={isSelected}
                  onChange={() => setSelectedSubscription(sub)}
                />

                <SubscriptionProductCell
                  title={productTitle}
                  onProductClick={() => {
                    void router.push(`/produce/${productId}`);
                  }}
                />

                <IdentityCell
                  id={counterpartyId}
                  name={counterpartyName}
                  image={counterpartyImage}
                  onNameClick={
                    counterpartyId
                      ? () => {
                          void router.push(`/public-profile/${counterpartyId}`);
                        }
                      : undefined
                  }
                />

                <QuantityOzCell quantityOz={sub.quantityOz} />

                <DateTimeCell date={sub.nextDeliveryDate} />

                <LocationCell location={counterparty?.location} />

                <FulfillmentCell fulfillmentType={sub.fulfillmentType} />

                <StatusCell status={sub.status} />
              </SelectableTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TablePageCardShell>
  );
}
