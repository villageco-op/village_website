import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from '@storybook/test';
import { useState } from 'react';

import { ClientsTable } from './ClientsTable';

import type { ClientResponse, PaginationMetadata } from '@/lib/api/generated/models';

const mockClients: ClientResponse[] = [
  {
    id: 'cli_1',
    name: 'Acme Corp',
    email: 'contact@acme.com',
    phone: '0001231234',
    address: '123 Forest Ave',
    city: 'Madison',
    state: 'WI',
    country: 'USA',
    zip: '53703',
    organizationId: 'org-1',
    createdById: 'user-1',
    referredBy: null as any,
    active: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'cli_2',
    name: 'Stark Industries',
    email: 'info@stark.com',
    phone: '0001231234',
    address: '200 Park Ave',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    zip: '10166',
    organizationId: 'org-1',
    createdById: 'user-1',
    referredBy: null as any,
    active: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'cli_3',
    name: 'Wayne Enterprises',
    email: 'bruce@wayne.com',
    phone: '0001231234',
    address: null,
    city: null,
    state: null,
    country: null,
    zip: null,
    organizationId: 'org-1',
    createdById: 'user-1',
    referredBy: null as any,
    active: false,
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 'cli_4',
    name: 'Cyberdyne Systems',
    email: 'support@cyberdyne.com',
    phone: '0001231234',
    address: null,
    city: null,
    state: null,
    country: null,
    zip: null,
    organizationId: 'org-1',
    createdById: 'user-1',
    referredBy: null as any,
    active: true,
    createdAt: '2024-04-05T00:00:00Z',
    updatedAt: '2024-04-05T00:00:00Z',
  },
];

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
    clients: mockClients,
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
    selectedClient: mockClients[0],
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
    clients: [mockClients[2]],
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

      const filteredClients = mockClients.filter((client) => {
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
    selectedClient: mockClients[0],
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
    await expect(args.onEditClick).toHaveBeenCalledWith(mockClients[0]);

    await userEvent.click(deleteBtn);
    await expect(args.onDeleteClick).toHaveBeenCalledWith(mockClients[0]);

    await userEvent.click(referralsBtn);
    await expect(args.onViewReferralsClick).toHaveBeenCalledWith(mockClients[0]);
  },
};
