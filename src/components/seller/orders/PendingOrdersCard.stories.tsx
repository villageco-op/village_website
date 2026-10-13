import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PendingOrdersCard } from './PendingOrdersCard';

import { BASE_MOCK_ORDER, BASE_MOCK_ORDER_LIST_ITEM } from '@/lib/storybook/mocks/order.mock';
import {
  generateMockOrderListItems,
  generateMockOrders,
} from '@/lib/storybook/utils/mockGenerators';

const meta: Meta<typeof PendingOrdersCard> = {
  title: 'Seller/Orders/PendingOrdersCard',
  component: PendingOrdersCard,
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
type Story = StoryObj<typeof PendingOrdersCard>;

const MOCK_ORDER_DATA = generateMockOrders(2);

/**
 * A standard view showing a mix of single and multi-item orders with pickup and delivery.
 */
export const Default: Story = {
  args: {
    pendingCount: 2,
    orders: MOCK_ORDER_DATA,
  },
};

/**
 * Explicitly tests orders containing multiple items (+x more badge).
 */
export const MultipleOrderItems: Story = {
  args: {
    pendingCount: 1,
    orders: [
      {
        ...BASE_MOCK_ORDER,
        items: generateMockOrderListItems(2),
      },
    ],
  },
};

/**
 * State when there are no active pending orders.
 */
export const Empty: Story = {
  args: {
    pendingCount: 0,
    orders: [],
  },
};

/**
 * View showing a single order with a long "time ago" string
 * to test the layout of the timestamps and missing date state.
 */
export const LongWaitTime: Story = {
  args: {
    pendingCount: 1,
    orders: [
      {
        ...BASE_MOCK_ORDER,
        createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
        items: [BASE_MOCK_ORDER_LIST_ITEM],
      },
    ],
  },
};

/**
 * Mobile view to ensure badges, product details, and status elements wrap properly.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    ...Default.args,
  },
};
