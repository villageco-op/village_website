import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, fn } from '@storybook/test';

import { CancelOrderDialog } from './CancelOrderDialog';

const meta: Meta<typeof CancelOrderDialog> = {
  title: 'Orders/OrderDetails/CancelOrderDialog',
  component: CancelOrderDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    isOpen: true,
    onClose: fn(),
    onConfirm: fn<(reason: string) => Promise<void>>(async (reason) => {
      console.log('Confirmed with reason:', reason);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }),
    isPending: false,
  },
};

export default meta;
type Story = StoryObj<typeof CancelOrderDialog>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isPending: true,
  },
};

export const InteractionTest: Story = {
  play: async ({ canvasElement }) => {
    // Dialogs render in a Portal, so we search the entire body
    const body = within(canvasElement.ownerDocument.body);

    const textarea = body.getByPlaceholderText(/E.g., Out of stock/i);
    const confirmBtn = body.getByRole('button', { name: /Confirm Cancellation/i });

    // Button should be disabled initially (empty reason)
    await expect(confirmBtn).toBeDisabled();

    // Type a reason
    await userEvent.type(textarea, 'Items are no longer available.');

    // Button should now be enabled
    await expect(confirmBtn).toBeEnabled();

    // Click confirm
    await userEvent.click(confirmBtn);
  },
};
