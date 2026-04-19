import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SellerSidebar } from './SellerSidebar';

import type { User } from '@/lib/api/generated/models/user';

const meta: Meta<typeof SellerSidebar> = {
  title: 'Seller/SellerSidebar',
  component: SellerSidebar,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-deep-forest flex">
        <Story />
        <main className="flex-1 p-8 bg-cream/5 text-cream">
          <p className="font-sans opacity-50">Main content area (scroll to see sticky behavior)</p>
        </main>
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SellerSidebar>;

/**
 * Full Mock User conforming to the OpenAPI generated interface
 */
const mockUser: User = {
  id: 'user_123',
  name: 'Alex Gardener',
  email: 'alex@village.com',
  emailVerified: '2024-01-01T00:00:00Z',
  image:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop',
  aboutMe: 'Growing organic greens in the heart of the valley.',
  specialties: ['Spinach', 'Kale'],
  goal: 'Expand to 50 local families',
  address: '123 Farm Lane',
  city: 'Madison',
  lat: 43.0,
  lng: 89.0,
  state: 'WI',
  country: 'United States',
  zip: '45678',
  deliveryRangeMiles: '15',
  stripeAccountId: 'acct_123',
  stripeOnboardingComplete: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

/**
 * Default view with a logged-in user and Dashboard active.
 */
export const DashboardActive: Story = {
  args: {
    user: mockUser,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/seller',
      },
    },
  },
};

/**
 * Shows a user with no profile image, triggering the initials fallback logic.
 */
export const InitialsFallback: Story = {
  args: {
    user: {
      ...mockUser,
      name: 'Sarah Smith',
      image: null,
    },
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/seller',
      },
    },
  },
};

/**
 * Shows the "My Listings" page active with the default lime badge.
 */
export const ListingsActive: Story = {
  args: {
    user: mockUser,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/seller/listings',
      },
    },
  },
};

/**
 * Shows the "Orders" page active with the "sun" variant badge.
 */
export const OrdersActive: Story = {
  args: {
    user: mockUser,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/seller/orders',
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
        pathname: '/seller/settings',
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
        pathname: '/seller',
      },
    },
  },
};
