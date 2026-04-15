import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MonthlyGoalCard } from './MonthlyGoalCard';

const mockProduceBreakdown = [
  { produceName: 'Organic Kale', amount: 450 },
  { produceName: 'Heirloom Tomatoes', amount: 320 },
  { produceName: 'Honey Crisp Apples', amount: 180 },
  { produceName: 'Wild Mushrooms', amount: 95 },
];

const meta: Meta<typeof MonthlyGoalCard> = {
  title: 'Seller/Earnings/MonthlyGoalCard',
  component: MonthlyGoalCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-3xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MonthlyGoalCard>;

/**
 * Standard progress toward the monthly goal.
 */
export const Default: Story = {
  args: {
    earnedThisMonth: 1045,
    monthlyGoal: 2000,
    produceBreakdown: mockProduceBreakdown,
  },
};

/**
 * Visualizes the state when the seller has just started the month.
 */
export const EarlyProgress: Story = {
  args: {
    earnedThisMonth: 150,
    monthlyGoal: 2500,
    produceBreakdown: [{ produceName: 'Organic Kale', amount: 150 }],
  },
};

/**
 * Ensures the progress bar stays at 100% and does not
 * overflow the container when the goal is exceeded.
 */
export const GoalExceeded: Story = {
  args: {
    earnedThisMonth: 3200,
    monthlyGoal: 2500,
    produceBreakdown: [
      ...mockProduceBreakdown,
      { produceName: 'Special Reserve Cider', amount: 1200 },
      { produceName: 'Fresh Eggs', amount: 955 },
    ],
  },
};

/**
 * Mobile view to check how the produce breakdown pills wrap
 * and how the large font size for the dollar amount behaves.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    earnedThisMonth: 1045,
    monthlyGoal: 2000,
    produceBreakdown: mockProduceBreakdown,
  },
};
