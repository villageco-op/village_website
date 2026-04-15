import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { OrdersSkeleton } from './OrdersSkeleton';

const meta: Meta<typeof OrdersSkeleton> = {
  title: 'Seller/Orders/OrdersSkeleton',
  component: OrdersSkeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="container mx-auto max-w-5xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OrdersSkeleton>;

/**
 * The standard loading state for the orders page,
 * showing skeleton loaders for the header, pending orders, and history.
 */
export const Default: Story = {};

/**
 * Mobile view simulation to ensure the flex layouts
 * and skeleton cards stack correctly.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
