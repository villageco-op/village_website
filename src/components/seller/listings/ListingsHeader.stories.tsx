import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ListingsHeader } from './ListingsHeader';

const meta: Meta<typeof ListingsHeader> = {
  title: 'Components/Seller/Listings/ListingsHeader',
  component: ListingsHeader,
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
type Story = StoryObj<typeof ListingsHeader>;

/**
 * Standard view showing a typical number of active listings.
 */
export const Default: Story = {
  args: {
    activeCount: 12,
  },
};

/**
 * State when the seller has no active listings.
 * Useful for verifying pluralization/messaging.
 */
export const Empty: Story = {
  args: {
    activeCount: 0,
  },
};

/**
 * View with a large number of listings to check layout
 * stability with longer numeric strings.
 */
export const ManyListings: Story = {
  args: {
    activeCount: 128,
  },
};

/**
 * Mobile view to ensure the title and action buttons
 * stack correctly on smaller screens.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    activeCount: 5,
  },
};
