import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { OrderUserCard } from './OrderUserCard';

const meta: Meta<typeof OrderUserCard> = {
  title: 'Orders/OrderDetails/OrderUserCard',
  component: OrderUserCard,
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
type Story = StoryObj<typeof OrderUserCard>;

export const Buyer: Story = {
  args: {
    title: 'Customer Information',
    role: 'buyer',
    user: {
      id: 'usr_buyer_1',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    },
  },
};

export const Seller: Story = {
  args: {
    title: 'Producer Details',
    role: 'seller',
    user: {
      id: 'usr_seller_1',
      name: 'Sunny Side Farms',
      email: 'contact@sunnyside.org',
    },
  },
};

export const Anonymous: Story = {
  args: {
    title: 'Customer Information',
    role: 'buyer',
    user: {
      id: 'usr_anon',
      name: null,
      email: null,
    },
  },
};
