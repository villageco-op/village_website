import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ListingOrdersSkeleton } from './ListingOrdersSkeleton';

const meta: Meta<typeof ListingOrdersSkeleton> = {
  title: 'Seller/ListingOrders/ListingOrdersSkeleton',
  component: ListingOrdersSkeleton,
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
type Story = StoryObj<typeof ListingOrdersSkeleton>;

/**
 * Standard loading state mimicking the layout of the listing orders page.
 */
export const Default: Story = {};

/**
 * Mobile view simulation to ensure skeleton rows and card padding adapt correctly.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
