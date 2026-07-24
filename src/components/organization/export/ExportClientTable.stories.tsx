import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ExportClientTable } from './ExportClientTable';

import type { ClientResponse } from '@/lib/api/generated/models';

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
    email: null as any,
    phone: null as any,
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
];

const meta: Meta<typeof ExportClientTable> = {
  title: 'Org/Export/ExportClientTable',
  component: ExportClientTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    clients: mockClients,
  },
};

export default meta;
type Story = StoryObj<typeof ExportClientTable>;

/**
 * Standard printable export table view showing active and inactive client records.
 */
export const Default: Story = {};

/**
 * Validates fallback values when client fields (e.g., email, phone, address) are missing or null.
 */
export const PartialDataAndFallbacks: Story = {
  args: {
    clients: [
      {
        id: 'cli_empty',
        name: null as any,
        email: null as any,
        phone: null as any,
        address: null,
        city: null,
        state: null,
        country: null,
        zip: null,
        organizationId: 'org-1',
        createdById: 'user-1',
        referredBy: null as any,
        active: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
  },
};

/**
 * Empty state rendered when no client data is provided for export.
 */
export const Empty: Story = {
  args: {
    clients: [],
  },
};
