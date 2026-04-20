import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SubscriptionUserCard } from './SubscriptionUserCard';

const meta: Meta<typeof SubscriptionUserCard> = {
  title: 'Buyer/Subscriptions/Details/SubscriptionUserCard',
  component: SubscriptionUserCard,
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
type Story = StoryObj<typeof SubscriptionUserCard>;

export const SellerView: Story = {
  args: {
    title: 'Grower Information',
    role: 'seller',
    user: {
      id: 'seller-123',
      name: 'Oak Creek Organics',
      email: 'hello@oakcreek.farm',
      location: {
        city: 'Austin',
        state: 'TX',
        address: '123 Farm Road',
        lat: 30.2672,
        lng: -97.7431,
        country: 'USA',
        zip: '78701',
      },
    },
  },
};

export const BuyerView: Story = {
  args: {
    title: 'Customer Details',
    role: 'buyer',
    user: {
      id: 'buyer-456',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    },
  },
};

export const AnonymousUser: Story = {
  args: {
    title: 'User Profile',
    role: 'seller',
    user: {
      id: 'user-789',
      name: null,
      email: null,
    },
  },
};

export const MissingUser: Story = {
  args: {
    title: 'Hidden Card',
    role: 'seller',
    user: null,
  },
};
