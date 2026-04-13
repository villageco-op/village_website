import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DashboardStats } from './DashboardStats';

const meta: Meta<typeof DashboardStats> = {
  title: 'Components/Seller/Dashboard/DashboardStats',
  component: DashboardStats,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-5xl mx-auto bg-cream/20 p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DashboardStats>;

/**
 * Positive growth across all metrics.
 */
export const Growth: Story = {
  args: {
    earnedThisMonth: 1240,
    earnedLastMonth: 980,
    soldThisWeekLbs: 42,
    onTrackWithGoal: true,
    activeListingsCount: 3,
    activeListingsNames: ['Organic Kale', 'Heirloom Tomatoes', 'Snap Peas'],
  },
};

/**
 * Metrics showing a decline or falling behind goals.
 */
export const Underperforming: Story = {
  args: {
    earnedThisMonth: 450,
    earnedLastMonth: 600,
    soldThisWeekLbs: 12,
    onTrackWithGoal: false,
    activeListingsCount: 1,
    activeListingsNames: ['Winter Squash'],
  },
};

/**
 * State for a new seller with no historical data or active listings.
 */
export const EmptyState: Story = {
  args: {
    earnedThisMonth: 0,
    earnedLastMonth: 0,
    soldThisWeekLbs: 0,
    onTrackWithGoal: false,
    activeListingsCount: 0,
    activeListingsNames: [],
  },
};

/**
 * Testing the truncation and layout with many active listing names.
 */
export const ManyListings: Story = {
  args: {
    earnedThisMonth: 3200,
    earnedLastMonth: 2800,
    soldThisWeekLbs: 156,
    onTrackWithGoal: true,
    activeListingsCount: 8,
    activeListingsNames: [
      'Red Beets',
      'Carrots',
      'Arugula',
      'Radishes',
      'Green Onions',
      'Bibb Lettuce',
      'Spinach',
      'Microgreens',
    ],
  },
};
