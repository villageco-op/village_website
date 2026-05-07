import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SellerAboutTab from './SellerAboutTab';

import type { ProduceListItem } from '@/lib/api/generated/models';

const meta: Meta<typeof SellerAboutTab> = {
  title: 'Seller/Profile/SellerAboutTab',
  component: SellerAboutTab,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="container-custom max-w-5xl mx-auto py-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SellerAboutTab>;

const mockQuickOrderItems: ProduceListItem[] = [
  {
    id: 'prod-1',
    thumbnail: '',
    name: 'Baby Spinach',
    sellerName: 'Farmer John',
    sellerId: 'user-123',
    price: '$2.90/lb',
    amount: '20 lbs',
    availableBy: '2024-06-12T00:00:00Z',
    distance: 2.5,
    isSubscribable: true,
    description: 'Fresh organic baby spinach.',
  },
  {
    id: 'prod-2',
    thumbnail: '',
    name: 'Cherry Tomatoes',
    sellerName: 'Farmer John',
    sellerId: 'user-123',
    price: '$4.10/lb',
    amount: '30 lbs',
    availableBy: '2024-06-15T00:00:00Z',
    distance: 2.5,
    isSubscribable: false,
    description: 'Sweet and juicy cherry tomatoes.',
  },
];

export const Complete: Story = {
  args: {
    profile: {
      id: 'user-123',
      name: 'Farmer John',
      aboutMe:
        "I've been growing organic vegetables in the Austin area for over 15 years. My focus is on soil health and heirloom varieties that you can't find in big-box grocery stores. Every harvest is hand-picked the morning of delivery.",
      specialties: ['Heirloom Tomatoes', 'Microgreens', 'Organic Spinach', 'Root Vegetables'],
      image: '',
      country: 'USA',
      state: 'TX',
      city: 'Austin',
      joinedAt: '2021-03-20T00:00:00Z',
      starRating: 5.0,
      totalReviews: 89,
      activeBuyerCount: 12,
      reviewBreakdown: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 89 },
    },
    quickOrderItems: mockQuickOrderItems,
    isQuickOrderLoading: false,
  },
};

export const Minimal: Story = {
  args: {
    profile: {
      id: 'user-456',
      name: null,
      aboutMe: null,
      specialties: [],
      image: '',
      country: null,
      state: null,
      city: null,
      joinedAt: null,
      starRating: 0,
      totalReviews: 0,
      activeBuyerCount: 0,
      reviewBreakdown: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
    },
    quickOrderItems: [],
    isQuickOrderLoading: false,
  },
};

export const LoadingQuickOrders: Story = {
  args: {
    ...Complete.args,
    quickOrderItems: [],
    isQuickOrderLoading: true,
  },
};

export const ManySpecialties: Story = {
  args: {
    ...Complete.args,
    profile: {
      ...Complete.args?.profile!,
      specialties: [
        'Kale',
        'Chard',
        'Arugula',
        'Bok Choy',
        'Mustard Greens',
        'Carrots',
        'Radishes',
        'Beets',
        'Turnips',
        'Snap Peas',
        'Strawberries',
        'Blueberries',
        'Raspberries',
      ],
    },
  },
};
