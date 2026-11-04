import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SellerAboutTab from './SellerAboutTab';

import { MOCK_SELLER_PUBLIC_PROFILE } from '@/lib/storybook/mocks/user.mock';

const meta: Meta<typeof SellerAboutTab> = {
  title: 'Profile/SellerAboutTab',
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

export const Complete: Story = {
  args: {
    profile: MOCK_SELLER_PUBLIC_PROFILE,
  },
};

export const Minimal: Story = {
  args: {
    profile: {
      id: 'user-456',
      name: null,
      organization: null,
      organizationId: '',
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
