import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BillingStatsCard } from './BillingStatsCard';

const meta: Meta<typeof BillingStatsCard> = {
  title: 'Buyer/Billing/BillingStatsCard',
  component: BillingStatsCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BillingStatsCard>;

export const Default: Story = {
  args: {
    data: {
      totalSpent: 1250.5,
      totalProduceLbs: 450,
      avgCostPerLb: 2.78,
      localSourcingPercentage: 85,
    },
  },
};

export const HighVolume: Story = {
  args: {
    data: {
      totalSpent: 15420.0,
      totalProduceLbs: 8200,
      avgCostPerLb: 1.88,
      localSourcingPercentage: 100,
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    ...Default.args,
  },
};
