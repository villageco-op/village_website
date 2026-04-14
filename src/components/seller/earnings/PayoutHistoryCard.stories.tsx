import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PayoutHistoryCard } from './PayoutHistoryCard';

import type { Payout } from '@/lib/api/generated/models';

const mockPayouts: Payout[] = [
  {
    date: '2024-03-12T10:00:00Z',
    productName: 'Heirloom Tomatoes',
    quantityLbs: 45,
    buyerName: 'Central Market',
    amountDollars: 135.0,
  },
  {
    date: '2024-03-10T14:30:00Z',
    productName: 'Organic Kale',
    quantityLbs: 20,
    buyerName: 'Green Grocer',
    amountDollars: 60.0,
  },
  {
    date: '2024-03-05T09:15:00Z',
    productName: 'Honey Crisp Apples',
    quantityLbs: 100,
    buyerName: 'Village Kitchen',
    amountDollars: 250.0,
  },
  {
    date: '2024-02-28T11:00:00Z',
    productName: 'Wild Mushrooms',
    quantityLbs: 5,
    buyerName: 'The Bistro',
    amountDollars: 75.5,
  },
];

const meta: Meta<typeof PayoutHistoryCard> = {
  title: 'Components/Seller/Earnings/PayoutHistoryCard',
  component: PayoutHistoryCard,
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
type Story = StoryObj<typeof PayoutHistoryCard>;

/**
 * Standard view with several payout entries.
 */
export const Default: Story = {
  args: {
    payouts: mockPayouts,
  },
};

/**
 * State displayed when no payouts have been recorded
 * within the specified timeframe.
 */
export const Empty: Story = {
  args: {
    payouts: [],
  },
};

/**
 * Mobile view to ensure the table remains legible or
 * appropriately scrollable on small screens.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    payouts: mockPayouts,
  },
};

/**
 * View with a larger list of payouts to test table
 * density and scrolling.
 */
export const ExtensiveHistory: Story = {
  args: {
    payouts: [
      ...mockPayouts,
      ...mockPayouts.map((p, i) => ({ ...p, date: `2024-01-0${i + 1}T10:00:00Z` })),
    ],
  },
};
