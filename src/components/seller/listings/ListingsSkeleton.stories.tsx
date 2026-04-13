import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ListingsSkeleton } from './ListingsSkeleton';

const meta: Meta<typeof ListingsSkeleton> = {
  title: 'Components/Seller/Listings/ListingsSkeleton',
  component: ListingsSkeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="container mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ListingsSkeleton>;

/**
 * The standard loading state for the listings page,
 * simulating a header and a 3-column grid of cards.
 */
export const Default: Story = {};

/**
 * Mobile view simulation to ensure the skeleton
 * stacks correctly on smaller screens.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Used within a constrained width container to see
 * how the grid adapts to smaller parent elements.
 */
export const ConstrainedWidth: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-2xl border-2 border-dashed border-muted p-4">
        <Story />
      </div>
    ),
  ],
};
