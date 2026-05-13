import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from '@storybook/test';

import OrderActionCard from './OrderActionCard';

const meta: Meta<typeof OrderActionCard> = {
  title: 'Buyer/ProduceDetails/OrderActionCard',
  component: OrderActionCard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof OrderActionCard>;

export const Default: Story = {
  args: {
    onOrder: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const orderButton = canvas.getByRole('button', { name: /order now/i });

    await userEvent.click(orderButton);
    await expect(args.onOrder).toHaveBeenCalled();
  },
};
