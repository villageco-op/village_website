import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BuyerDashboardHeader } from './BuyerDashboardHeader';

const meta: Meta<typeof BuyerDashboardHeader> = {
  title: 'Buyer/Dashboard/BuyerDashboardHeader',
  component: BuyerDashboardHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto bg-white p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BuyerDashboardHeader>;

/**
 * Standard view for a logged-in buyer.
 * Note: Depends on useAuth() returning a name.
 */
export const Default: Story = {};

/**
 * Mobile viewport to check date and name wrapping.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
