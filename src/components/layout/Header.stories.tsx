'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import { Header } from './Header';

import { CartProvider } from '@/hooks/useCartUI';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
  },
});

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <CartProvider>
            <Story />
          </CartProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

const mockSession = (userPayload: object | null) => [
  http.get('*/api/auth/session', () => {
    if (!userPayload) return HttpResponse.json({});
    return HttpResponse.json({
      user: userPayload,
      expires: '9999-12-31T23:59:59.999Z',
    });
  }),
];

/**
 * Guest user on the homepage.
 * Shows 'Home' link, 'Get involved' CTA, and public anchor links.
 */
export const GuestHome: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/' } },
    msw: { handlers: mockSession(null) },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Unauthenticated primary links should be present
    await expect(await canvas.findByRole('link', { name: /Home/i })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /Sell/i })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /Shop/i })).toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: /Org/i })).not.toBeInTheDocument();

    // Homepage secondary links should be visible
    await expect(canvas.getByRole('link', { name: /Food Pantries/i })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /Resturants & Markets/i })).toBeInTheDocument();

    // Login CTA should be present for guest users
    await expect(canvas.getByRole('link', { name: /Get involved/i })).toBeInTheDocument();
  },
};

/**
 * Guest user on a sub-path (/buyer/browse).
 * Shows public links ('Browse') but hides protected links ('Dashboard', 'Subscriptions').
 */
export const GuestBuyerBrowse: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/buyer/browse' } },
    msw: { handlers: mockSession(null) },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Unprotected secondary link is visible
    await expect(await canvas.findByRole('link', { name: /Browse/i })).toBeInTheDocument();

    // Protected secondary links must be filtered out
    await expect(canvas.queryByRole('link', { name: /Dashboard/i })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: /Subscriptions/i })).not.toBeInTheDocument();
  },
};

/**
 * Standard authenticated user on homepage.
 * 'Home' link is hidden (unAuthOnly), CTA button is hidden.
 */
export const AuthenticatedHome: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/' } },
    msw: {
      handlers: mockSession({
        id: '1',
        name: 'Jane Doe',
        email: 'jane@example.com',
      }),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByRole('link', { name: /Sell/i })).toBeInTheDocument();

    // 'Home' is unAuthOnly and should be hidden
    await expect(canvas.queryByRole('link', { name: /Home/i })).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /Shop/i })).toBeInTheDocument();

    // CTA should be hidden when authenticated
    await expect(canvas.queryByRole('link', { name: /Get involved/i })).not.toBeInTheDocument();
  },
};

/**
 * Standard authenticated user on Buyer path.
 * Shows 'Dashboard', 'Browse', and 'Subscriptions'. Hides 'Org' primary nav.
 */
export const AuthenticatedBuyerDashboard: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/buyer' } },
    msw: {
      handlers: mockSession({
        id: '1',
        name: 'Jane Doe',
        email: 'jane@example.com',
      }),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Protected buyer sub-nav items should now be visible
    await expect(await canvas.findByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /Browse/i })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /Subscriptions/i })).toBeInTheDocument();

    // Non-org user should not see 'Org' link
    await expect(canvas.queryByRole('link', { name: /Org/i })).not.toBeInTheDocument();
  },
};

/**
 * Standard authenticated user on Seller path.
 * Shows Seller sub-navigation.
 */
export const AuthenticatedSellerDashboard: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/seller' } },
    msw: {
      handlers: mockSession({
        id: '1',
        name: 'Jane Doe',
        email: 'jane@example.com',
      }),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /Orders/i })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /Subscriptions/i })).toBeInTheDocument();
  },
};

/**
 * Organization Member (non-admin) on /org/clients.
 * Displays 'Org' link in primary nav (orgOnly) and 'Clients' secondary nav item.
 * Hides 'Members' link (adminOnly).
 */
export const OrgMemberDashboard: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/org/clients' } },
    msw: {
      handlers: mockSession({
        id: '2',
        name: 'Org Member',
        email: 'member@org.com',
        organizationId: 'org-123',
        orgRole: 'member',
      }),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Primary nav link for org users must be visible
    await expect(await canvas.findByRole('link', { name: /Org/i })).toBeInTheDocument();

    // Non-admin org link visible, admin link hidden
    await expect(canvas.getByRole('link', { name: /Clients/i })).toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: /Members/i })).not.toBeInTheDocument();
  },
};

/**
 * Organization Admin on /org/clients.
 * Displays 'Org' primary link and both 'Clients' and 'Members' (adminOnly) secondary links.
 */
export const OrgAdminDashboard: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/org/clients' } },
    msw: {
      handlers: mockSession({
        id: '3',
        name: 'Org Admin',
        email: 'admin@org.com',
        organizationId: 'org-123',
        orgRole: 'admin',
      }),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByRole('link', { name: /Org/i })).toBeInTheDocument();

    // Both org secondary items should be visible for admins
    await expect(canvas.getByRole('link', { name: /Clients/i })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /Members/i })).toBeInTheDocument();
  },
};
