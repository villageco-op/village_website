import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { EarningsStatRow } from './EarningsStatRow';

import type { SellerEarningsResponse } from '@/lib/api/generated/models';

const mockEarningsData: SellerEarningsResponse = {
  earnedThisMonth: 1250.5,
  earnedLastMonth: 1000.0,
  remainingToGoal: 249.5,
  monthlyGoal: 1500.0,
  totalEarnedYTD: 15420.0,
  ytdStartDate: '2024-01-01T00:00:00Z',
  avgPerLbSold: 2.45,
  amountSoldDollarsPerProduceThisMonth: [
    {
      produceName: 'Tomato',
      amount: 5.0,
    },
    {
      produceName: 'Cucumber',
      amount: 1.49,
    },
    {
      produceName: 'Butternut Squash',
      amount: 2.69,
    },
  ],
};

const meta: Meta<typeof EarningsStatRow> = {
  title: 'Seller/Earnings/EarningsStatRow',
  component: EarningsStatRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-7xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EarningsStatRow>;

/**
 * Standard view with positive growth compared to the previous month.
 */
export const Default: Story = {
  args: {
    data: mockEarningsData,
  },
};

/**
 * Mobile view to ensure the 4-card grid stacks correctly
 * from 4 columns to 2, then to 1.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    data: mockEarningsData,
  },
};
