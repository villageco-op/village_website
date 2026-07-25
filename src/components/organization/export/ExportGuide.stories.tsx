import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from '@storybook/test';

import { ExportGuides } from './ExportGuide';

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
];

const meta: Meta<typeof ExportGuides> = {
  title: 'Org/Export/ExportGuides',
  component: ExportGuides,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    clients: mockClients,
    loading: false,
    onTriggerPrint: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ExportGuides>;

/**
 * Standard guide layout with active action buttons for CSV download and Print/PDF export.
 */
export const Default: Story = {};

/**
 * Disabled state when data is currently being fetched or loaded.
 */
export const LoadingState: Story = {
  args: {
    loading: true,
  },
};

/**
 * Verifies print trigger callback invocation when user clicks the print button.
 */
export const TriggerPrintInteraction: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const printButton = canvas.getByRole('button', { name: /print \/ save to pdf/i });
    await expect(printButton).toBeEnabled();

    await userEvent.click(printButton);
    await expect(args.onTriggerPrint).toHaveBeenCalledTimes(1);
  },
};
