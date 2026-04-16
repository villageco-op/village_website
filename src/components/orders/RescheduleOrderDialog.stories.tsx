import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, fn } from '@storybook/test';

import { RescheduleOrderDialog } from './RescheduleOrderDialog';

const meta: Meta<typeof RescheduleOrderDialog> = {
  title: 'Orders/OrderDetails/RescheduleOrderDialog',
  component: RescheduleOrderDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    isOpen: true,
    onClose: fn(),
    onConfirm: fn<(newTimeIso: string) => Promise<void>>(async (time) => {
      console.log('Confirmed new time:', time);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }),
    currentScheduledTime: '2026-04-20T14:30:00Z',
    isPending: false,
  },
};

export default meta;
type Story = StoryObj<typeof RescheduleOrderDialog>;

/**
 * Normal view showing the current time pre-filled in local format.
 */
export const Default: Story = {};

/**
 * View when the "Propose New Time" button is clicked and waiting for API.
 */
export const SendingRequest: Story = {
  args: {
    isPending: true,
  },
};

/**
 * Tests that the user can select a new date and trigger the confirm callback.
 */
export const InteractionTest: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    const timeInput = body.getByLabelText(/New Date & Time/i);
    const proposeBtn = body.getByRole('button', { name: /Propose New Time/i });

    await userEvent.clear(timeInput);
    await userEvent.type(timeInput, '2026-05-25T10:00');

    await expect(proposeBtn).toBeEnabled();
    await userEvent.click(proposeBtn);
  },
};
