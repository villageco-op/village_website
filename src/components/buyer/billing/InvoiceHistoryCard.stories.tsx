import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { InvoiceHistoryCard } from './InvoiceHistoryCard';

import { Toaster } from '@/components/ui/sonner';
import { generateMockOrders } from '@/lib/storybook/utils/mockGenerators';

const SHORT_ORDER_LIST = generateMockOrders(2);
const LONG_ORDER_LIST = generateMockOrders(20);

const meta: Meta<typeof InvoiceHistoryCard> = {
  title: 'Buyer/Billing/InvoiceHistoryCard',
  component: InvoiceHistoryCard,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-5xl mx-auto">
        <Story />
        <Toaster></Toaster>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InvoiceHistoryCard>;

export const Default: Story = {
  args: {
    orders: SHORT_ORDER_LIST,
  },
};

export const EmptyState: Story = {
  args: {
    orders: [],
  },
};

export const LongHistory: Story = {
  args: {
    orders: LONG_ORDER_LIST,
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
