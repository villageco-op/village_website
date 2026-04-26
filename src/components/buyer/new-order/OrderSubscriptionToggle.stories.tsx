import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { OrderSubscriptionToggle } from './OrderSubscriptionToggle';

const meta: Meta<typeof OrderSubscriptionToggle> = {
  title: 'Buyer/NewOrder/OrderSubscriptionToggle',
  component: OrderSubscriptionToggle,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OrderSubscriptionToggle>;

export const Default: Story = {
  args: {
    isSubscription: false,
    frequencyDays: 7,
  },
  render: (args) => {
    const [checked, setChecked] = useState(args.isSubscription);
    return <OrderSubscriptionToggle {...args} isSubscription={checked} onChange={setChecked} />;
  },
};

export const BiWeekly: Story = {
  args: {
    isSubscription: true,
    frequencyDays: 14,
  },
  render: (args) => {
    const [checked, setChecked] = useState(args.isSubscription);
    return <OrderSubscriptionToggle {...args} isSubscription={checked} onChange={setChecked} />;
  },
};
