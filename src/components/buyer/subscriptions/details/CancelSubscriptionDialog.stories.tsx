import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, fn } from '@storybook/test';

import { CancelSubscriptionDialog } from './CancelSubscriptionDialog';

const meta: Meta<typeof CancelSubscriptionDialog> = {
  title: 'Buyer/Subscriptions/Details/CancelSubscriptionDialog',
  component: CancelSubscriptionDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    isOpen: true,
    onClose: fn(),
    onConfirm: fn<(reason: string) => Promise<void>>(async (reason) => {
      console.log('Cancellation confirmed:', reason);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }),
    isPending: false,
  },
};

export default meta;
type Story = StoryObj<typeof CancelSubscriptionDialog>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isPending: true,
  },
};

export const InteractionTest: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    const textarea = body.getByPlaceholderText(/E.g., Moving away/i);
    const confirmBtn = body.getByRole('button', { name: /Confirm Cancellation/i });

    // Ensure button is disabled without a reason
    await expect(confirmBtn).toBeDisabled();

    // Enter a reason
    await userEvent.type(
      textarea,
      'I am moving to a different city and can no longer receive local deliveries.',
    );

    // Button should now be enabled
    await expect(confirmBtn).toBeEnabled();

    // Click confirm
    await userEvent.click(confirmBtn);
  },
};
