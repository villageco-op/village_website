'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ClientsTable } from './ClientsTable';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { EditClientModal } from './EditClientModal';
import { ViewReferralsModal } from './ViewReferralsModal';

import { usePagination } from '@/hooks/usePagination';
import {
  useGetClients,
  useUpdateClient,
  useDeleteClient,
} from '@/lib/api/generated/clients/clients';
import type { ClientResponse, UpdateClientPayload } from '@/lib/api/generated/models';

/**
 * Main dashboard container managing state and action handlers for the clients registry.
 * @returns The clients page client component
 */
export default function ClientsPageClient() {
  const { page, limit, setPage, resetPage } = usePagination(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(null);
  const [editingClient, setEditingClient] = useState<ClientResponse | null>(null);
  const [deletingClient, setDeletingClient] = useState<ClientResponse | null>(null);
  const [referralViewingClient, setReferralViewingClient] = useState<ClientResponse | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, statusFilter, resetPage]);

  const activeParam =
    statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined;

  const {
    data: clientsRes,
    isLoading,
    isError,
    refetch: refetchClients,
  } = useGetClients({
    search: debouncedSearch || undefined,
    active: activeParam,
    page,
    limit,
  });

  const { mutateAsync: updateClient, isPending: isUpdating } = useUpdateClient();
  const { mutateAsync: deleteClient, isPending: isDeleting } = useDeleteClient();

  const handleEditConfirm = async (id: string, payload: UpdateClientPayload) => {
    try {
      const response = await updateClient({ id, data: payload });
      if (response.status === 200) {
        toast.success('Client profile updated successfully.');
        void refetchClients();
        setEditingClient(null);
        setSelectedClient(null);
      }
    } catch (error) {
      toast.error('An error occurred while updating the client profile.');
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      const response = await deleteClient({ id });
      if (response.status === 200) {
        toast.success('Client record removed permanently.');
        void refetchClients();
        setDeletingClient(null);
        setSelectedClient(null);
      }
    } catch (error) {
      toast.error('Unable to complete removal process.');
    }
  };

  const clients = clientsRes?.status === 200 ? clientsRes.data?.data : [];
  const meta = clientsRes?.status === 200 ? clientsRes.data?.meta : undefined;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-bold text-ink">Clients</h1>
        <p className="text-sm text-ink-3">View, edit & delete clients and view referrals.</p>
      </div>

      <ClientsTable
        clients={clients || []}
        isLoading={isLoading}
        isError={isError}
        searchQuery={searchQuery}
        setSearchQuery={(query) => {
          setSearchQuery(query);
          setSelectedClient(null);
        }}
        statusFilter={statusFilter}
        setStatusFilter={(filter) => {
          setStatusFilter(filter);
          setSelectedClient(null);
        }}
        meta={meta}
        setPage={(page) => {
          setPage(page);
          setSelectedClient(null);
        }}
        onRefetch={() => {
          void refetchClients();
          setSelectedClient(null);
        }}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        onEditClick={(client) => setEditingClient(client)}
        onDeleteClick={(client) => setDeletingClient(client)}
        onViewReferralsClick={(client) => setReferralViewingClient(client)}
      />

      {editingClient && (
        <EditClientModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onConfirm={handleEditConfirm}
          isSubmitting={isUpdating}
        />
      )}

      {deletingClient && (
        <ConfirmDeleteModal
          client={deletingClient}
          onClose={() => setDeletingClient(null)}
          onConfirm={() => handleDeleteConfirm(deletingClient.id)}
          isSubmitting={isDeleting}
        />
      )}

      {referralViewingClient && (
        <ViewReferralsModal
          client={referralViewingClient}
          onClose={() => setReferralViewingClient(null)}
        />
      )}
    </div>
  );
}
