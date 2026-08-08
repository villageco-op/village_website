import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import AddOrganizationClient from './AddOrganizationClient';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof AddOrganizationClient> = {
  title: 'Org/AddOrganization/AddOrganizationClient',
  component: AddOrganizationClient,
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
type Story = StoryObj<typeof AddOrganizationClient>;

/**
 * Unauthenticated View:
 * Prompts user to log in or sign up before creating an organization.
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

    // Verify heading and notice banner
    await expect(await canvas.findByText(/Register Your Organization/i)).toBeInTheDocument();
    await expect(
      await canvas.findByText(/Does your organization already exist on Village\?/i),
    ).toBeInTheDocument();

    // Verify main CTA for logged-out users
    await expect(
      await canvas.findByText(/Ready to setup your organization\?/i),
    ).toBeInTheDocument();

    // Check login button link with upgrade=org param
    const loginButton = await canvas.findByRole('link', { name: /Log in \/ Sign up to Start/i });
    await expect(loginButton).toHaveAttribute('href', '/login?returnTo=/onboarding?upgrade=org');
  },
};

/**
 * Authenticated User Without Organization:
 * User is logged in but has no existing organizationId. Offers onboarding entry.
 */
export const AuthenticatedWithoutOrg: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () =>
          HttpResponse.json({
            user: {
              name: 'Jane Doe',
              email: 'jane@example.com',
              organizationId: null,
            },
            expires: '9999-12-31T23:59:59.999Z',
          }),
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify CTA for user without an organization
    await expect(await canvas.findByText(/Start Organization Onboarding/i)).toBeInTheDocument();

    // Verify button links directly to org onboarding
    const onboardingButton = await canvas.findByRole('link', {
      name: /Continue to Org Onboarding/i,
    });
    await expect(onboardingButton).toHaveAttribute('href', '/onboarding?upgrade=org');
  },
};

/**
 * Authenticated Organization Member View:
 * The user already belongs to an organization. Prompts redirect to org dashboard.
 */
export const AuthenticatedWithOrg: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () =>
          HttpResponse.json({
            user: {
              name: 'Pantry Admin',
              email: 'admin@pantry.org',
              organizationId: 'org_123456',
            },
            expires: '9999-12-31T23:59:59.999Z',
          }),
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify detection of existing membership
    await expect(await canvas.findByText(/You belong to an organization!/i)).toBeInTheDocument();

    // Verify dashboard link
    const dashboardButton = await canvas.findByRole('link', { name: /Go to Org Dashboard/i });
    await expect(dashboardButton).toHaveAttribute('href', '/org/clients');
  },
};
