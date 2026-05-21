import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import BecomeSellerClient from './BecomeSellerClient';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof BecomeSellerClient> = {
  title: 'Seller/BecomeSeller/BecomeSellerClient',
  component: BecomeSellerClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BecomeSellerClient>;

/**
 * Unauthenticated View:
 * Shows the generic prompt to log in or sign up.
 */
export const Unauthenticated: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => {
          return HttpResponse.json(null); // No user logged in
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify main CTA for logged-out users
    await expect(await canvas.findByText(/Ready to start selling\?/i)).toBeInTheDocument();

    // Check if the login link is present with the correct returnTo redirect
    const loginButton = await canvas.findByRole('link', { name: /Log in \/ Sign up to Start/i });
    await expect(loginButton).toHaveAttribute('href', '/login?returnTo=/onboarding?upgrade=seller');
  },
};

/**
 * Authenticated Buyer View:
 * The user is logged in, but is not a seller yet. Shows the upgrade steps.
 */
export const AuthenticatedBuyer: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () =>
          HttpResponse.json({
            user: {
              name: 'Buyer Bob',
              email: 'bob@example.com',
              stripeOnboardingComplete: false,
            },
            expires: '9999-12-31T23:59:59.999Z',
          }),
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify the instructions for a logged-in buyer to become a seller
    await expect(await canvas.findByText(/Steps to Become a Seller/i)).toBeInTheDocument();

    // Ensure the CTA links directly to the onboarding upgrade path
    const upgradeButton = await canvas.findByRole('link', { name: /Complete Seller Onboarding/i });
    await expect(upgradeButton).toHaveAttribute('href', '/onboarding?upgrade=seller');
  },
};

/**
 * Authenticated Seller View:
 * The user is logged in and already a seller. Shows a redirect to their dashboard.
 */
export const AuthenticatedSeller: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () =>
          HttpResponse.json({
            user: {
              name: 'Farmer John',
              email: 'john@farm.com',
              stripeOnboardingComplete: true,
            },
            expires: '9999-12-31T23:59:59.999Z',
          }),
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify it detects them as a seller
    await expect(await canvas.findByText(/You're already a seller!/i)).toBeInTheDocument();

    // Verify the dashboard link
    const dashboardButton = await canvas.findByRole('link', { name: /Go to Dashboard/i });
    await expect(dashboardButton).toHaveAttribute('href', '/producer');
  },
};
