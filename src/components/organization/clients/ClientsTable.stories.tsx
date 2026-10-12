import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from '@storybook/test';
import { useState } from 'react';

import { ClientsTable } from './ClientsTable';

import type { ClientResponse, PaginationMetadata } from '@/lib/api/generated/models';
import { generateMockClients } from '@/lib/storybook/utils/clientMockGenerators';

const MOCK_CLIENTS = generateMockClients(4);

const mockMeta: PaginationMetadata = {
  total: 45,
  totalPages: 5,
  page: 1,
  limit: 10,
};

const meta: Meta<typeof ClientsTable> = {
  title: 'Org/Clients/ClientsTable',
  component: ClientsTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    clients: MOCK_CLIENTS,
    maxReferrals: 4,
    isLoading: false,
    isError: false,
    searchQuery: '',
    setSearchQuery: fn(),
    statusFilter: 'all',
    setStatusFilter: fn(),
    meta: mockMeta,
    setPage: fn(),
    onRefetch: fn(),
    selectedClient: null,
    setSelectedClient: fn(),
    onEditClick: fn(),
    onDeleteClick: fn(),
    onViewReferralsClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ClientsTable>;

/**
 * Standard table view populated with a list of clients and pagination metadata.
 */
export const Default: Story = {};

/**
 * Table showing a client pre-selected, which enables the action bar above the table.
 */
export const ClientSelected: Story = {
  args: {
    selectedClient: MOCK_CLIENTS[0],
  },
};

/**
 * Skeleton loading state rendered while client data is being fetched.
 */
export const Loading: Story = {
  args: {
    isLoading: true,
    clients: [],
  },
};

/**
 * Inline error state rendered when an API request fails, offering a retry action.
 */
export const ErrorState: Story = {
  args: {
    isError: true,
    clients: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Unable to load clients')).toBeInTheDocument();

    // Test retry action trigger
    const retryBtn = canvas.getByRole('button', { name: /try again/i });
    await userEvent.click(retryBtn);
  },
};

/**
 * Empty state displayed when no client records exist or match the search filters.
 */
export const Empty: Story = {
  args: {
    clients: [],
  },
};

/**
 * Active filter state showing the clear filters button when search or status filters are applied.
 */
export const FilteredState: Story = {
  args: {
    searchQuery: 'Wayne',
    statusFilter: 'inactive',
    clients: [MOCK_CLIENTS[2]],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const clearBtn = canvas.getByRole('button', { name: /clear filters/i });
    await expect(clearBtn).toBeInTheDocument();

    await userEvent.click(clearBtn);

    await expect(args.setSearchQuery).toHaveBeenCalledWith('');
    await expect(args.setStatusFilter).toHaveBeenCalledWith('all');
  },
};

/**
 * Interactive example wrapping table state (selection, search query, status filter) locally.
 */
export const InteractiveWithState: Story = {
  render: (args) => {
    const InteractiveTable = () => {
      const [searchQuery, setSearchQuery] = useState('');
      const [statusFilter, setStatusFilter] = useState('all');
      const [page, setPage] = useState(1);
      const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(null);

      const filteredClients = MOCK_CLIENTS.filter((client) => {
        const matchesSearch =
          client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'active' && client.active) ||
          (statusFilter === 'inactive' && !client.active);

        return matchesSearch && matchesStatus;
      });

      return (
        <ClientsTable
          {...args}
          clients={filteredClients}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          setPage={setPage}
          meta={{
            ...mockMeta,
            page,
            total: filteredClients.length,
            totalPages: Math.ceil(filteredClients.length / 10) || 1,
          }}
        />
      );
    };

    return <InteractiveTable />;
  },
};

/**
 * Verifies selecting a row, enabling top bar actions, and firing action callbacks.
 */
export const ActionSelectionInteraction: Story = {
  args: {
    selectedClient: MOCK_CLIENTS[0],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 1. Verify buttons are active when a client is selected
    const editBtn = canvas.getByRole('button', { name: /edit/i });
    const deleteBtn = canvas.getByRole('button', { name: /delete/i });
    const referralsBtn = canvas.getByRole('button', { name: /view referrals/i });

    await expect(editBtn).toBeEnabled();
    await expect(deleteBtn).toBeEnabled();
    await expect(referralsBtn).toBeEnabled();

    // 2. Click actions and verify callback invocations
    await userEvent.click(editBtn);
    await expect(args.onEditClick).toHaveBeenCalledWith(MOCK_CLIENTS[0]);

    await userEvent.click(deleteBtn);
    await expect(args.onDeleteClick).toHaveBeenCalledWith(MOCK_CLIENTS[0]);

    await userEvent.click(referralsBtn);
    await expect(args.onViewReferralsClick).toHaveBeenCalledWith(MOCK_CLIENTS[0]);
  },
};
