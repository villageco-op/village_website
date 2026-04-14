import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { EarningsSkeleton } from './EarningsSkeleton';

const meta: Meta<typeof EarningsSkeleton> = {
  title: 'Components/Seller/Earnings/EarningsSkeleton',
  component: EarningsSkeleton,
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
type Story = StoryObj<typeof EarningsSkeleton>;

/**
 * The standard loading state for the earnings page.
 * It simulates a header, 4-stat grid, a progress card, and a table.
 */
export const Default: Story = {};

/**
 * Mobile view to verify that the stat cards stack vertically
 * and the table skeleton handles narrow widths.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Visualizes the skeleton within a constrained container
 * to test the responsiveness of the grid and progress bar.
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
