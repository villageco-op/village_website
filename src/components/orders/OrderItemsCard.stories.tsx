import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { OrderItemsCard } from './OrderItemsCard';

import { generateMockOrderItems } from '@/lib/storybook/utils/mockGenerators';

const meta: Meta<typeof OrderItemsCard> = {
  title: 'Orders/OrderDetails/OrderItemsCard',
  component: OrderItemsCard,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-3xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OrderItemsCard>;

export const Default: Story = {
  args: {
    items: generateMockOrderItems(3),
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};
