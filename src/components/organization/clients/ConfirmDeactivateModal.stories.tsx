import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from '@storybook/test';

import { ConfirmDeactivateModal } from './ConfirmDeactivateModal';

import type { ClientResponse } from '@/lib/api/generated/models';

const mockClient: ClientResponse = {
  id: 'cli_123',
  name: 'Acme Corporation',
  email: 'contact@acme.com',
  phone: null,
  address: null,
  city: null,
  state: null,
  country: null,
  zip: null,
  organizationId: 'org-1',
  createdById: 'user-1',
  referredBy: null,
  active: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const meta: Meta<typeof ConfirmDeactivateModal> = {
  title: 'Org/Clients/ConfirmDeactivateModal',
  component: ConfirmDeactivateModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    client: mockClient,
    isSubmitting: false,
    onClose: fn(),
    onConfirm: fn().mockImplementation(() => Promise.resolve()),
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmDeactivateModal>;

/**
 * Standard deactivation confirmation state.
 */
export const Default: Story = {};

/**
 * Modal state when a client record has no explicit name set.
 */
export const UnnamedClient: Story = {
  args: {
    client: {
      id: 'cli_999',
      email: null,
      phone: null,
      address: null,
      organizationId: 'org-1',
      createdById: 'user-1',
      referredBy: null,
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    } as ClientResponse,
  },
};

/**
 * Submitting state displaying the loading spinner and disabled buttons.
 */
export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};

/**
 * Tests clicking the deactivation confirmation button and firing `onConfirm`.
 */
export const ConfirmFlow: Story = {
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);

    const confirmBtn = body.getByRole('button', { name: /deactivate profile/i });
    await userEvent.click(confirmBtn);

    await expect(args.onConfirm).toHaveBeenCalledTimes(1);
  },
};

/**
 * Tests clicking the cancel action to close the modal.
 */
export const CancelFlow: Story = {
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);

    const cancelBtn = body.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelBtn);

    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};
