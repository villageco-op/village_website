import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SubscriptionsHeader } from './SubscriptionsHeader';

const meta: Meta<typeof SubscriptionsHeader> = {
  title: 'Buyer/Subscriptions/SubscriptionsHeader',
  component: SubscriptionsHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SubscriptionsHeader>;

export const Default: Story = {
  args: {
    activeCount: 5,
  },
};

export const SingleSubscription: Story = {
  args: {
    activeCount: 1,
  },
};

export const Empty: Story = {
  args: {
    activeCount: 0,
  },
};
