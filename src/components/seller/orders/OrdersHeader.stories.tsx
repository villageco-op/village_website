import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { OrdersHeader } from './OrdersHeader';

const meta: Meta<typeof OrdersHeader> = {
  title: 'Components/Seller/Orders/OrdersHeader',
  component: OrdersHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-5xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OrdersHeader>;

/**
 * Standard view with a moderate number of pending orders.
 */
export const Default: Story = {
  args: {
    pendingCount: 3,
  },
};

/**
 * State when there are no pending orders.
 */
export const NoPending: Story = {
  args: {
    pendingCount: 0,
  },
};

/**
 * Mobile view to ensure text alignment and spacing
 * remains consistent on smaller screens.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    pendingCount: 12,
  },
};
