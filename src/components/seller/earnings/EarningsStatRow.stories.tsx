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
  title: 'Components/Seller/Earnings/EarningsStatRow',
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
 * View showing a decrease in earnings compared to last month.
 * Useful for testing the 'text-clay' (red/orange) delta indicator.
 */
export const NegativeGrowth: Story = {
  args: {
    data: {
      ...mockEarningsData,
      earnedThisMonth: 800.0,
      earnedLastMonth: 1200.0,
      remainingToGoal: 700.0,
    },
  },
};

/**
 * State when the monthly goal has been surpassed.
 * Verifies that "Remaining to goal" handles negative values gracefully (Math.max).
 */
export const GoalReached: Story = {
  args: {
    data: {
      ...mockEarningsData,
      earnedThisMonth: 1800.0,
      remainingToGoal: -300.0,
    },
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
