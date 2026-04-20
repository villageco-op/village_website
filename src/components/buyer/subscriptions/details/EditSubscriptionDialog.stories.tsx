import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, fn } from '@storybook/test';

import { EditSubscriptionDialog } from './EditSubscriptionDialog';

const meta: Meta<typeof EditSubscriptionDialog> = {
  title: 'Buyer/Subscriptions/Details/EditSubscriptionDialog',
  component: EditSubscriptionDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    isOpen: true,
    onClose: fn(),
    onConfirm: fn<(qty: number, type: string) => Promise<void>>(async (qty, type) => {
      console.log('Update confirmed:', { qty, type });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }),
    isPending: false,
    currentQuantity: 16,
    currentFulfillment: 'delivery',
    pricePerOz: 0.75,
  },
};

export default meta;
type Story = StoryObj<typeof EditSubscriptionDialog>;

/**
 * Standard view with current subscription values pre-filled.
 */
export const Default: Story = {};

/**
 * Loading state while the update is being processed.
 */
export const Saving: Story = {
  args: {
    isPending: true,
  },
};

/**
 * Tests that the user can change quantity/fulfillment and that the estimated cost updates.
 */
export const InteractionTest: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    const qtyInput = body.getByLabelText(/Quantity \(oz\)/i);
    const fulfillmentSelect = body.getByLabelText(/Fulfillment Type/i);
    const saveBtn = body.getByRole('button', { name: /Save Changes/i });

    // Change quantity from 16 to 20
    await userEvent.clear(qtyInput);
    await userEvent.type(qtyInput, '20');

    // Verify the math: 20 * 0.75 = $15.00
    await expect(body.getByText(/\$15.00/i)).toBeInTheDocument();

    // Change fulfillment type
    await userEvent.selectOptions(fulfillmentSelect, 'pickup');
    await expect(fulfillmentSelect).toHaveValue('pickup');

    // Click save
    await userEvent.click(saveBtn);
  },
};

/**
 * Validation state: ensuring the save button is disabled for invalid quantities.
 */
export const InvalidQuantity: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const qtyInput = body.getByLabelText(/Quantity \(oz\)/i);
    const saveBtn = body.getByRole('button', { name: /Save Changes/i });

    await userEvent.clear(qtyInput);
    await userEvent.type(qtyInput, '0');

    await expect(saveBtn).toBeDisabled();
  },
};
