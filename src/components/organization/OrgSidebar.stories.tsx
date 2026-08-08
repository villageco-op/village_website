import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { OrgSidebar } from './OrgSidebar';

import type { Organization } from '@/lib/api/generated/models/organization';
import type { User } from '@/lib/api/generated/models/user';

const meta: Meta<typeof OrgSidebar> = {
  title: 'Org/OrgSidebar',
  component: OrgSidebar,
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
type Story = StoryObj<typeof OrgSidebar>;

/**
 * Full Mock User conforming to the OpenAPI generated interface
 */
const mockUser: User = {
  id: 'user_123',
  name: 'Alex Gardener',
  organizationId: 'org_pantry_1',
  orgRole: 'admin',
  email: 'alex@village.com',
  emailVerified: '2024-01-01T00:00:00Z',
  image:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop',
  aboutMe: 'Managing community food support.',
  specialties: [],
  goal: '',
  address: '123 Main St',
  city: 'Madison',
  lat: 43.0,
  lng: -89.0,
  state: 'WI',
  country: 'United States',
  zip: '53703',
  deliveryRangeMiles: '10',
  stripeOnboardingComplete: true,
  isOnboardingComplete: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

/**
 * Mock Pantry Organization
 */
const mockPantryOrg: Organization = {
  id: 'org_pantry_1',
  name: 'Community Food Pantry',
  type: 'pantry',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  subdomain: '',
  email: null,
  website: null,
  phone: null,
  image: null,
  address: null,
  city: null,
  state: null,
  country: null,
  zip: null,
  lat: null,
  lng: null,
  maxReferrals: 4,
};

/**
 * Mock Restaurant Organization
 */
const mockRestaurantOrg: Organization = {
  id: 'org_rest_1',
  name: 'The Green Bistro',
  type: 'restaurant',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  subdomain: '',
  email: null,
  website: null,
  phone: null,
  image: null,
  address: null,
  city: null,
  state: null,
  country: null,
  zip: null,
  lat: null,
  lng: null,
  maxReferrals: null,
};

/**
 * Default view for a Pantry org with a logged-in user.
 */
export const FoodPantry: Story = {
  args: {
    user: mockUser,
    status: 'authenticated',
    org: mockPantryOrg,
    isLoading: false,
    isError: false,
    onRefetch: () => alert('Refetch clicked'),
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/org/clients',
      },
    },
  },
};

/**
 * View for a Restaurant org (uses RESTAURANT_NAV_GROUPS).
 */
export const Restaurant: Story = {
  args: {
    user: {
      ...mockUser,
      organizationId: 'org_rest_1',
    },
    status: 'authenticated',
    org: mockRestaurantOrg,
    isLoading: false,
    isError: false,
    onRefetch: () => alert('Refetch clicked'),
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/org/members',
      },
    },
  },
};

/**
 * Shows the "Members" route active.
 */
export const MembersActive: Story = {
  args: {
    ...FoodPantry.args,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/org/members',
      },
    },
  },
};

/**
 * Shows a nested route like "Settings" active.
 */
export const SettingsActive: Story = {
  args: {
    ...FoodPantry.args,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/settings',
      },
    },
  },
};

/**
 * Shows a user without an avatar image, triggering initials fallback.
 */
export const InitialsFallback: Story = {
  args: {
    ...FoodPantry.args,
    user: {
      ...mockUser,
      name: 'Sarah Smith',
      image: null,
    },
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/org/clients',
      },
    },
  },
};

/**
 * Sidebar state when org data or user auth is loading.
 */
export const Loading: Story = {
  args: {
    user: undefined,
    status: 'loading',
    org: undefined,
    isLoading: true,
    isError: false,
    onRefetch: () => {},
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/org/clients',
      },
    },
  },
};

/**
 * Error state rendered when fetching org fails or org is undefined.
 */
export const ErrorState: Story = {
  args: {
    user: mockUser,
    status: 'authenticated',
    org: undefined,
    isLoading: false,
    isError: true,
    onRefetch: () => alert('Retrying fetch...'),
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/org/clients',
      },
    },
  },
};

/**
 * Sidebar state when unauthenticated/guest user accesses the page.
 */
export const Unauthenticated: Story = {
  args: {
    user: undefined,
    status: 'unauthenticated',
    org: mockPantryOrg,
    isLoading: false,
    isError: false,
    onRefetch: () => {},
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/org/clients',
      },
    },
  },
};
