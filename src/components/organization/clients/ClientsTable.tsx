'use client';

import { Search, X, Edit2, Trash2, Users } from 'lucide-react';

import { ClientsTableSkeleton } from './ClientsTableSkeleton';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { EmptyState, InlineErrorState } from '@/components/ui/state-displays';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatAddress } from '@/lib/address-utils';
import type { ClientResponse, PaginationMetadata } from '@/lib/api/generated/models';

interface ClientsTableProps {
  clients: ClientResponse[];
  maxReferrals: number;
  isLoading: boolean;
  isError: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
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
 * Table displaying clients with actions and filters.
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
  statusFilter,
  setStatusFilter,
  meta,
  setPage,
  onRefetch,
  selectedClient,
  setSelectedClient,
  onEditClick,
  onDeleteClick,
  onViewReferralsClick,
}: ClientsTableProps) {
  return (
    <Card>
      <CardContent>
        {/* Filters and Inputs bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

            {(searchQuery || statusFilter !== 'all') && (
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                variant="outline-forest"
                size="sm"
                className="h-9 px-3 text-sm"
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Clear Filters
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {selectedClient && (
              <span>
                Selected:{' '}
                <strong className="text-foreground">
                  {selectedClient.name || 'Unnamed Client'}
                </strong>
              </span>
            )}
          </div>

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
        </div>

        {/* Client table or states */}
        {isLoading ? (
          <ClientsTableSkeleton />
        ) : isError ? (
          <InlineErrorState
            title="Unable to load clients"
            description="An issue occurred fetching your clients. Please try again."
            onRetry={onRefetch}
          />
        ) : clients.length === 0 ? (
          <EmptyState
            title="No clients found"
            description="No clients match your search criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Select</TableHead>
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
                    <TableRow
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className={`cursor-pointer ${isSelected ? 'bg-muted/60' : ''}`}
                    >
                      <TableCell>
                        <input
                          type="radio"
                          name="client-selection"
                          checked={isSelected}
                          onChange={() => setSelectedClient(client)}
                          className="h-4 w-4 cursor-pointer accent-primary"
                        />
                      </TableCell>
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {meta && meta.totalPages > 1 && <PaginationControls meta={meta} onPageChange={setPage} />}
      </CardContent>
    </Card>
  );
}
