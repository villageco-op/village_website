import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Home, Package, Settings, Truck } from 'lucide-react';

import { Sidebar, type NavGroup } from './Sidebar';

import type { User } from '@/lib/api/generated/models/user';

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
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
type Story = StoryObj<typeof Sidebar>;

const mockUser: User = {
  id: 'user_generic_1',
  name: 'Sam Logistics',
  organization: null,
  email: 'sam@transport.com',
  emailVerified: '2024-01-01T00:00:00Z',
  image:
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&h=150&auto=format&fit=crop',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  aboutMe: 'Cool guy',
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
  zip: '45678',
};

const mockNavGroups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { name: 'Dashboard', icon: Home, href: '/dashboard' },
      { name: 'Deliveries', sub: 'Active routes', icon: Truck, href: '/deliveries', badge: 5 },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Inventory', icon: Package, href: '/inventory', badge: 'New', badgeVariant: 'sun' },
      { name: 'Settings', icon: Settings, href: '/settings' },
    ],
  },
];

/**
 * A completely custom instance of the AppSidebar, acting as a generic logistics navigation.
 */
export const CustomLogisticsView: Story = {
  args: {
    user: mockUser,
    roleLabel: 'Driver',
    fallbackName: 'Driver',
    navGroups: mockNavGroups,
    settingsHref: '/settings',
    publicProfileBaseUrl: '/driver',
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/deliveries',
      },
    },
  },
};

/**
 * When the user has no image, the avatar falls back to initials.
 */
export const InitialsFallback: Story = {
  args: {
    user: { ...mockUser, image: null, name: 'Warehouse Admin' },
    roleLabel: 'Admin',
    fallbackName: 'Admin',
    navGroups: mockNavGroups,
    settingsHref: '/settings',
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/dashboard',
      },
    },
  },
};

/**
 * What the generic sidebar looks like when the user is logged out (undefined user).
 */
export const Anonymous: Story = {
  args: {
    user: undefined,
    roleLabel: 'Guest',
    fallbackName: 'Guest User',
    navGroups: mockNavGroups,
    settingsHref: '/login',
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/dashboard',
      },
    },
  },
};
