import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from '@storybook/test';
import { Home, Lock, Shield, Truck } from 'lucide-react';

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
  organizationId: 'org_123',
  orgRole: 'member',
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

const mockNavGroupsWithPermissions: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { name: 'Public Overview', icon: Home, href: '/overview', protected: false },
      {
        name: 'Protected Deliveries',
        sub: 'Active routes',
        icon: Truck,
        href: '/deliveries',
        protected: true,
      },
    ],
  },
  {
    label: 'Administration',
    items: [
      {
        name: 'User Management',
        icon: Shield,
        href: '/admin/users',
        protected: true,
        adminOnly: true,
      },
      { name: 'System Logs', icon: Lock, href: '/admin/logs', protected: true, adminOnly: true },
    ],
  },
];

/**
 * What the generic sidebar looks like when the user is logged out (undefined user).
 * Asserts that protected and admin-only items are filtered out.
 */
export const Anonymous: Story = {
  args: {
    user: undefined,
    status: 'unauthenticated',
    roleLabel: 'Guest',
    fallbackName: 'Guest User',
    navGroups: mockNavGroupsWithPermissions,
    settingsHref: '/login',
  },
  parameters: {
    nextjs: {
      navigation: { pathname: '/overview' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Unprotected items should be visible
    await expect(canvas.getByRole('link', { name: /Public Overview/i })).toBeInTheDocument();

    // Protected and admin items must be filtered out
    await expect(
      canvas.queryByRole('link', { name: /Protected Deliveries/i }),
    ).not.toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: /User Management/i })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: /System Logs/i })).not.toBeInTheDocument();
  },
};

/**
 * Authenticated non-admin member.
 * Asserts protected items are visible, but adminOnly items are hidden.
 */
export const AuthenticatedMember: Story = {
  args: {
    user: { ...mockUser, orgRole: 'member' },
    status: 'authenticated',
    roleLabel: 'Member',
    fallbackName: 'Member',
    navGroups: mockNavGroupsWithPermissions,
    settingsHref: '/settings',
  },
  parameters: {
    nextjs: {
      navigation: { pathname: '/deliveries' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Public and protected items should be visible
    await expect(canvas.getByRole('link', { name: /Public Overview/i })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /Protected Deliveries/i })).toBeInTheDocument();

    // Admin-only items must be filtered out for non-admin users
    await expect(canvas.queryByRole('link', { name: /User Management/i })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: /System Logs/i })).not.toBeInTheDocument();
  },
};

/**
 * Authenticated admin user.
 * Asserts that all items (public, protected, and adminOnly) are visible.
 */
export const AuthenticatedAdmin: Story = {
  args: {
    user: { ...mockUser, orgRole: 'admin' },
    status: 'authenticated',
    roleLabel: 'Admin',
    fallbackName: 'Admin',
    navGroups: mockNavGroupsWithPermissions,
    settingsHref: '/settings',
  },
  parameters: {
    nextjs: {
      navigation: { pathname: '/admin/users' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // All links (public, protected, and admin-only) should be rendered
    await expect(canvas.getByRole('link', { name: /Public Overview/i })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /Protected Deliveries/i })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /User Management/i })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /System Logs/i })).toBeInTheDocument();
  },
};

/**
 * When the user has no image, the avatar falls back to initials.
 */
export const InitialsFallback: Story = {
  args: {
    user: { ...mockUser, image: null, name: 'Warehouse Admin', orgRole: 'admin' },
    status: 'authenticated',
    roleLabel: 'Admin',
    fallbackName: 'Admin',
    navGroups: mockNavGroupsWithPermissions,
    settingsHref: '/settings',
  },
  parameters: {
    nextjs: {
      navigation: { pathname: '/overview' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Asserts fallback avatar renders initials
    await expect(canvas.getByText('WA')).toBeInTheDocument();
  },
};

/**
 * Sidebar in loading state displaying skeleton loader.
 */
export const Loading: Story = {
  args: {
    user: undefined,
    status: 'loading',
    roleLabel: 'Guest',
    fallbackName: 'Guest User',
    navGroups: mockNavGroupsWithPermissions,
    settingsHref: '/login',
  },
  parameters: {
    nextjs: {
      navigation: { pathname: '/overview' },
    },
  },
};

/**
 * Sidebar displaying inline error state when data loading fails.
 */
export const ErrorState: Story = {
  args: {
    user: mockUser,
    status: 'authenticated',
    roleLabel: 'Driver',
    fallbackName: 'Driver',
    navGroups: mockNavGroupsWithPermissions,
    settingsHref: '/settings',
    isError: true,
    errorMessage: 'Failed to load navigation.',
  },
  parameters: {
    nextjs: {
      navigation: { pathname: '/overview' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Assert error state content is visible
    await expect(canvas.getByText(/Failed to load navigation/i)).toBeInTheDocument();
  },
};
