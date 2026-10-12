import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect } from '@storybook/test';

import { ConfirmDeleteModal } from './ConfirmDeleteModal';

import { BASE_MOCK_CLIENT } from '@/lib/storybook/mocks/client.mock';

const meta: Meta<typeof ConfirmDeleteModal> = {
  title: 'Org/Clients/ConfirmDeleteModal',
  component: ConfirmDeleteModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    client: BASE_MOCK_CLIENT,
    isSubmitting: false,
    onClose: fn(),
    onConfirm: fn().mockImplementation(() => Promise.resolve()),
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmDeleteModal>;

/**
 * Standard deletion warning confirmation state with destructive styling.
 */
export const Default: Story = {};

/**
 * Fallback display when client profile details lack a designated name.
 */
export const UnnamedClient: Story = {
  args: {
    client: {
      ...BASE_MOCK_CLIENT,
      name: null as any,
    },
  },
};

/**
 * Pending/Deleting state showing animated spinner during network call.
 */
export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};

/**
 * Tests executing record removal and verifying trigger execution.
 */
export const ConfirmDeletionFlow: Story = {
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);

    const deleteBtn = body.getByRole('button', { name: /confirm deletion/i });
    await userEvent.click(deleteBtn);

    await expect(args.onConfirm).toHaveBeenCalledTimes(1);
  },
};

/**
 * Tests aborting record removal via the cancel button.
 */
export const CancelFlow: Story = {
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);

    const cancelBtn = body.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelBtn);

    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};
