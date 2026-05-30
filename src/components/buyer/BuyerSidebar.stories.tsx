import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BuyerSidebar } from './BuyerSidebar';

import type { User } from '@/lib/api/generated/models/user';

const meta: Meta<typeof BuyerSidebar> = {
  title: 'Buyer/BuyerSidebar',
  component: BuyerSidebar,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-screen bg-deep-forest">
        <Story />
        <main className="flex-1 bg-cream/5 p-8 text-cream">
          <p className="font-sans opacity-50">Main content area (scroll to see sticky behavior)</p>
        </main>
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BuyerSidebar>;

/**
 * Full Mock User conforming to the OpenAPI generated interface,
 * adjusted for a typical Buyer persona.
 */
const mockUser: User = {
  id: 'buyer_123',
  name: 'County Fresh Mkt',
  organization: null,
  email: 'purchasing@countyfresh.com',
  emailVerified: '2024-01-01T00:00:00Z',
  image:
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=150&h=150&auto=format&fit=crop',
  aboutMe: 'A local market bringing fresh valley produce to Gary, IN.',
  deliveryRangeMiles: '0',
  specialties: [],
  goal: '90',
  stripeOnboardingComplete: false,
  isOnboardingComplete: true,
  address: '456 Market Ave',
  city: 'Gary',
  lat: 41.59,
  lng: -87.34,
  state: 'IN',
  country: 'United States',
  zip: '92921',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

/**
 * Default view with a logged-in user and Order Dashboard active.
 */
export const DashboardActive: Story = {
  args: {
    user: mockUser,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/buyer',
      },
    },
  },
};

/**
 * Shows a user with no profile image, triggering the initials fallback logic ("CF").
 */
export const InitialsFallback: Story = {
  args: {
    user: {
      ...mockUser,
      name: 'County Fresh Mkt',
      image: null,
    },
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/buyer',
      },
    },
  },
};

/**
 * Shows the "Browse Produce" page active.
 */
export const BrowseActive: Story = {
  args: {
    user: mockUser,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/buyer/browse',
      },
    },
  },
};

/**
 * Shows the "Order History" page active.
 */
export const OrdersActive: Story = {
  args: {
    user: mockUser,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/buyer/orders',
      },
    },
  },
};

/**
 * Shows a deeper nested route like Settings active.
 */
export const SettingsActive: Story = {
  args: {
    user: mockUser,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/buyer/settings',
      },
    },
  },
};

/**
 * Sidebar state when no user object is provided (Anonymous/Guest).
 */
export const Anonymous: Story = {
  args: {
    user: undefined,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/buyer',
      },
    },
  },
};
