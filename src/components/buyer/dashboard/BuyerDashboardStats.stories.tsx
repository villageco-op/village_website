import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BuyerDashboardStats } from './BuyerDashboardStats';

const meta: Meta<typeof BuyerDashboardStats> = {
  title: 'Buyer/Dashboard/BuyerDashboardStats',
  component: BuyerDashboardStats,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BuyerDashboardStats>;

/**
 * High activity state with positive growth and several active subscriptions.
 */
export const Active: Story = {
  args: {
    onOrderThisWeekLbs: 450,
    percentChangeFromLastWeek: 12.5,
    totalSpendThisMonth: 2450.75,
    totalSpendLastMonth: 2100.0,
    activeSubscriptions: [
      { id: '1', produceName: 'Organic Kale', amount: 1 },
      { id: '2', produceName: 'Honeycrisp Apples', amount: 1 },
      { id: '3', produceName: 'Red Radishes', amount: 0.5 },
    ],
    localGrowersSupplying: 8,
    furthestGrowerDistanceMiles: 14.2,
  },
};

/**
 * State showing a decline in volume compared to last week.
 */
export const DecreasingVolume: Story = {
  args: {
    onOrderThisWeekLbs: 120,
    percentChangeFromLastWeek: -5.2,
    totalSpendThisMonth: 800,
    totalSpendLastMonth: 1200,
    activeSubscriptions: [{ id: '1', produceName: 'Butter Lettuce', amount: 1 }],
    localGrowersSupplying: 2,
    furthestGrowerDistanceMiles: 45.0,
  },
};

/**
 * Testing the truncation ("...") logic when more than 4 subscriptions exist.
 */
export const ManySubscriptions: Story = {
  args: {
    ...Active.args,
    activeSubscriptions: [
      { id: '1', produceName: 'Carrots', amount: 1 },
      { id: '2', produceName: 'Beets', amount: 2 },
      { id: '3', produceName: 'Onions', amount: 1.5 },
      { id: '4', produceName: 'Garlic', amount: 1 },
      { id: '5', produceName: 'Potatoes', amount: 1 },
      { id: '6', produceName: 'Leeks', amount: 1 },
    ],
  },
};

/**
 * A fresh account with no historical or active data.
 */
export const Empty: Story = {
  args: {
    onOrderThisWeekLbs: 0,
    percentChangeFromLastWeek: 0,
    totalSpendThisMonth: 0,
    totalSpendLastMonth: 0,
    activeSubscriptions: [],
    localGrowersSupplying: 0,
    furthestGrowerDistanceMiles: 0,
  },
};
