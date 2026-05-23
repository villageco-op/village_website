import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SidebarProfile from './SidebarProfile';

import type { User } from '@/lib/api/generated/models/user';

const meta: Meta<typeof SidebarProfile> = {
  title: 'Layout/Sidebar/SidebarProfile',
  component: SidebarProfile,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story, context) => {
      // Mimic the sidebar wrapper width to demonstrate text truncation and layout
      const isCollapsed = context.args.isCollapsed;
      return (
        <div
          className={`bg-forest-dark transition-all duration-300 ease-in-out ${
            isCollapsed ? 'w-16' : 'w-58'
          }`}
        >
          <Story />
        </div>
      );
    },
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SidebarProfile>;

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
  stripeAccountId: 'id',
  stripeOnboardingComplete: false,
  address: '456 Market Ave',
  city: 'Gary',
  lat: 41.59,
  lng: -87.34,
  state: 'IN',
  country: 'United States',
  zip: '45678',
};

/**
 * Standard expanded profile view with a user avatar, name, and role.
 */
export const Default: Story = {
  args: {
    user: mockUser,
    roleLabel: 'Driver',
    fallbackName: 'Driver',
    settingsHref: '/settings',
    publicProfileBaseUrl: '/driver',
    isCollapsed: false,
  },
};

/**
 * Collapsed view, showing only the avatar.
 */
export const Collapsed: Story = {
  args: {
    ...Default.args,
    isCollapsed: true,
  },
};

/**
 * Expanded view when the user doesn't have an image, falling back to initials.
 */
export const InitialsFallback: Story = {
  args: {
    ...Default.args,
    user: { ...mockUser, image: null, name: 'Warehouse Admin' },
    roleLabel: 'Admin',
  },
};

/**
 * View when no user is passed in (logged out). Prompts the user to log in.
 */
export const Anonymous: Story = {
  args: {
    user: undefined,
    roleLabel: 'Guest',
    fallbackName: 'Guest User',
    settingsHref: '/login',
    isCollapsed: false,
  },
};

/**
 * Logged out view when the sidebar is collapsed. Shows a small icon button.
 */
export const AnonymousCollapsed: Story = {
  args: {
    ...Anonymous.args,
    isCollapsed: true,
  },
};
