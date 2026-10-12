import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ExportClientTable } from './ExportClientTable';

import { generateMockClients } from '@/lib/storybook/utils/clientMockGenerators';

const mockClients = generateMockClients(3);

const meta: Meta<typeof ExportClientTable> = {
  title: 'Org/Export/ExportClientTable',
  component: ExportClientTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    clients: mockClients,
    hasFetched: true,
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
    hasFetched: true,
  },
};

/**
 * Empty state rendered when no client data is provided for export.
 */
export const Empty: Story = {
  args: {
    clients: [],
    hasFetched: true,
  },
};

/**
 * Not yet fetched state rendered when no clients have been loaded yet.
 */
export const NotYetLoaded: Story = {
  args: {
    clients: [],
    hasFetched: false,
  },
};
