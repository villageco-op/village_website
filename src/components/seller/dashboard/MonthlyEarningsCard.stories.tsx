import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MonthlyEarningsCard } from './MonthlyEarningsCard';

const meta: Meta<typeof MonthlyEarningsCard> = {
  title: 'Seller/Dashboard/MonthlyEarningsCard',
  component: MonthlyEarningsCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MonthlyEarningsCard>;

/**
 * Standard view showing progress towards the monthly goal with multiple produce types.
 */
export const Default: Story = {
  args: {
    earnedThisMonth: 850,
    monthlyGoal: 1200,
    earningsByProduce: [
      { produceName: 'Heirloom Tomatoes', earned: 450 },
      { produceName: 'Sweet Corn', earned: 300 },
      { produceName: 'Zucchini', earned: 100 },
    ],
  },
};

/**
 * State when the user has exceeded their monthly goal.
 */
export const GoalExceeded: Story = {
  args: {
    earnedThisMonth: 1500,
    monthlyGoal: 1000,
    earningsByProduce: [
      { produceName: 'Organic Honey', earned: 1200 },
      { produceName: 'Lavender', earned: 300 },
    ],
  },
};

/**
 * State for the beginning of a month or a new user with no earnings yet.
 */
export const NoEarnings: Story = {
  args: {
    earnedThisMonth: 0,
    monthlyGoal: 500,
    earningsByProduce: [],
  },
};

/**
 * Testing the badge wrapping and color cycling with many different produce items.
 */
export const DiverseProduce: Story = {
  args: {
    earnedThisMonth: 2450,
    monthlyGoal: 3000,
    earningsByProduce: [
      { produceName: 'Strawberries', earned: 800 },
      { produceName: 'Blueberries', earned: 600 },
      { produceName: 'Raspberries', earned: 400 },
      { produceName: 'Blackberries', earned: 300 },
      { produceName: 'Currants', earned: 200 },
      { produceName: 'Gooseberries', earned: 150 },
    ],
  },
};

/**
 * Edge case to ensure the component handles a goal of $0 without breaking (division by zero).
 */
export const ZeroGoal: Story = {
  args: {
    earnedThisMonth: 100,
    monthlyGoal: 0,
    earningsByProduce: [{ produceName: 'Wild Mushrooms', earned: 100 }],
  },
};
