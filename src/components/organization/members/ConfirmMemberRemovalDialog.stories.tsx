import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, fn } from '@storybook/test';

import { ConfirmRemovalDialog } from './ConfirmMemberRemovalDialog';

import { BASE_MOCK_MEMBER } from '@/lib/storybook/mocks/organization.mock';

const meta: Meta<typeof ConfirmRemovalDialog> = {
  title: 'Org/Members/ConfirmRemovalDialog',
  component: ConfirmRemovalDialog,
  parameters: {
    layout: 'centered',
  },
  args: {
    member: BASE_MOCK_MEMBER,
    onClose: fn(),
    onConfirm: fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }),
    isSubmitting: false,
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmRemovalDialog>;

export const Default: Story = {};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};

export const InteractionTest: Story = {
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);

    // Verify warning text is present
    await expect(body.getByText(/immediately lose access/i)).toBeInTheDocument();

    // Test Confirm Click
    const confirmBtn = body.getByRole('button', { name: /Confirm Removal/i });
    await userEvent.click(confirmBtn);
    await expect(args.onConfirm).toHaveBeenCalled();

    // Test Cancel Click
    const cancelBtn = body.getByRole('button', { name: /Cancel/i });
    await userEvent.click(cancelBtn);
    await expect(args.onClose).toHaveBeenCalled();
  },
};
