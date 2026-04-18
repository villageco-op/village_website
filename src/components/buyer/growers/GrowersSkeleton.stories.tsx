import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GrowersSkeleton } from './GrowersSkeleton';

const meta: Meta<typeof GrowersSkeleton> = {
  title: 'Buyer/Growers/GrowersSkeleton',
  component: GrowersSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GrowersSkeleton>;

/**
 * The standard loading state for the Growers directory page.
 */
export const Default: Story = {};

/**
 * Mobile view to ensure the skeleton grid collapses to a single column.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Displays the skeleton within a smaller container to test responsiveness.
 */
export const ConstrainedWidth: Story = {
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-4xl border-x border-dashed p-4">
        <Story />
      </div>
    ),
  ],
};
