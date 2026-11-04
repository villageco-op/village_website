'use client';

import { Search, Edit2, Trash2, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ClearFiltersButton } from '@/components/ui/clear-filters-button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import RadioCell from '@/components/ui/table-cells';
import { TablePageCardShell } from '@/components/ui/table-page-card-shell';
import { SelectableTableRow } from '@/components/ui/table-row-selectable';
import { TableSelectionIndicator } from '@/components/ui/table-selection-indicator';
import { formatAddress } from '@/lib/address-utils';
import type { ClientResponse, PaginationMetadata } from '@/lib/api/generated/models';

interface ClientsTableProps {
  clients: ClientResponse[];
  maxReferrals: number;
  isLoading: boolean;
  isError: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  meta?: PaginationMetadata;
  setPage: (page: number) => void;
  onRefetch: () => void;
  selectedClient: ClientResponse | null;
  setSelectedClient: (client: ClientResponse | null) => void;
  onEditClick: (client: ClientResponse) => void;
  onDeleteClick: (client: ClientResponse) => void;
  onViewReferralsClick: (client: ClientResponse) => void;
}

/**
 * Table displaying clients utilizing the TablePageCardShell layout pattern,
 * with selectable rows via radio buttons, search and status filters, and action buttons.
 * @param props - Component props
 * @param props.clients - The clients list
 * @param props.maxReferrals - The max referrals per client
 * @param props.isLoading - Are the clients loading
 * @param props.isError - Did an error occur loading the clients
 * @param props.searchQuery - The current search input
 * @param props.setSearchQuery - When the search input value is changed
 * @param props.statusFilter - The current status filter value
 * @param props.setStatusFilter - When the status filter is changed
 * @param props.meta - Pagination metadata
 * @param props.setPage - When next or previous page is clicked
 * @param props.onRefetch - When retry fetch clients is clicked
 * @param props.selectedClient - The current selected client
 * @param props.setSelectedClient - When a table row is selected
 * @param props.onEditClick - When the edit button is clicked
 * @param props.onDeleteClick - When the delete button is clicked
 * @param props.onViewReferralsClick - When the view referrals button is clicked
 * @returns The table component within a card
 */
export function ClientsTable({
  clients,
  maxReferrals,
  isLoading,
  isError,
  searchQuery,
  setSearchQuery,
  meta,
  setPage,
  onRefetch,
  selectedClient,
  setSelectedClient,
  onEditClick,
  onDeleteClick,
  onViewReferralsClick,
}: ClientsTableProps) {
  const hasFilters = searchQuery;

  const filtersSlot = (
    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-ink-3" />
        <Input
          placeholder="Search name, email, phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full h-9 text-sm"
        />
      </div>

      {hasFilters && (
        <ClearFiltersButton
          onClear={() => {
            setSearchQuery('');
          }}
        />
      )}
    </div>
  );

  const selectionIndicatorSlot = selectedClient ? (
    <TableSelectionIndicator selectionText={selectedClient.name || 'Unnamed Client'} />
  ) : null;

  const actionsSlot = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={!selectedClient}
        onClick={() => selectedClient && onViewReferralsClick(selectedClient)}
        className="h-8 gap-1.5 px-3 text-xs"
      >
        <Users className="h-3.5 w-3.5" />
        View Referrals
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!selectedClient}
        onClick={() => selectedClient && onEditClick(selectedClient)}
        className="h-8 gap-1.5 px-3 text-xs"
      >
        <Edit2 className="h-3.5 w-3.5" />
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        disabled={!selectedClient}
        onClick={() => selectedClient && onDeleteClick(selectedClient)}
        className="h-8 gap-1.5 px-3 text-xs"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </Button>
    </div>
  );

  return (
    <TablePageCardShell
      isLoading={isLoading}
      isError={isError}
      isEmpty={clients.length === 0}
      onRetry={onRefetch}
      meta={meta}
      setPage={setPage}
      emptyTitle="No clients found"
      emptyDescription="No clients match your search criteria."
      filters={filtersSlot}
      selectionIndicator={selectionIndicatorSlot}
      actions={actionsSlot}
    >
      <Table className="w-full">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">Select</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Referrals</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => {
            const usedCount = client.referralCount || 0;
            const isMaxedOut = usedCount >= maxReferrals;
            const isSelected = selectedClient?.id === client.id;

            return (
              <SelectableTableRow
                key={client.id}
                id={client.id}
                onSelect={() => setSelectedClient(client)}
                isSelected={isSelected}
              >
                <RadioCell
                  name="client-selection"
                  isSelected={isSelected}
                  onChange={() => setSelectedClient(client)}
                />
                <TableCell className="font-heading font-bold text-table-body-foreground-highlighted">
                  {client.name || 'Unnamed Client'}
                </TableCell>
                <TableCell>{client.email || 'No email associated'}</TableCell>
                <TableCell>{client.phone || ''}</TableCell>
                <TableCell>{formatAddress(client)}</TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => onViewReferralsClick(client)}
                    className="cursor-pointer group inline-flex items-center gap-2 hover:opacity-80"
                  >
                    <span
                      className={`text-sm font-semibold underline decoration-dotted underline-offset-4 ${
                        isMaxedOut ? 'text-amber-600' : 'text-forest'
                      }`}
                    >
                      {usedCount} of {maxReferrals}
                    </span>
                  </button>
                </TableCell>
              </SelectableTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TablePageCardShell>
  );
}
