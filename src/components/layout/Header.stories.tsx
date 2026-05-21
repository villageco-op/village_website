'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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

/**
 * Guest user on the homepage.
 * Shows the "Home" link, the "Get involved" CTA, and anchor landing page links.
 */
export const GuestHome: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: '/' },
    },
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => {
          // Auth.js returns an empty object when no session exists
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Guest user on a sub-path.
 * Unauthenticated nav links remain visible, protected links are filtered out.
 */
export const GuestBuyerBrowse: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: '/buyer/browse' },
    },
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Logged-in user on the homepage.
 * The "Home" link disappears (unAuthOnly: true) and the CTA button is hidden.
 */
export const AuthenticatedHome: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: '/' },
    },
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: { id: '1', name: 'Jane Doe', email: 'jane@example.com' },
            expires: '9999-12-31T23:59:59.999Z',
          });
        }),
      ],
    },
  },
};

/**
 * Logged-in user on the Buyer Dashboard.
 * Displays protected links like "Dashboard" and "Subscriptions".
 */
export const AuthenticatedBuyerDashboard: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: '/buyer' },
    },
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: { id: '1', name: 'Jane Doe', email: 'jane@example.com' },
            expires: '9999-12-31T23:59:59.999Z',
          });
        }),
      ],
    },
  },
};

/**
 * Logged-in user on the Seller Dashboard.
 * Displays the Seller secondary sub-navigation elements.
 */
export const AuthenticatedSellerDashboard: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: '/seller' },
    },
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: { id: '1', name: 'Jane Doe', email: 'jane@example.com' },
            expires: '9999-12-31T23:59:59.999Z',
          });
        }),
      ],
    },
  },
};
