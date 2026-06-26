import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, waitFor } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import AcceptInviteClient from '@/app/verify-invite/page';
import { Toaster } from '@/components/ui/sonner';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
    mutations: { retry: false },
  },
});

const meta: Meta<typeof AcceptInviteClient> = {
  title: 'Onboarding/Organization/AcceptInvite',
  component: AcceptInviteClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/verify-invite',
        query: {
          org: 'org_123',
          code: 'INVITE_CODE_XYZ',
          email: 'invited-member@example.com',
        },
      },
    },
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: { id: 'usr_999', name: 'John Doe', email: 'invited-member@example.com' },
            expires: '9999-12-31T23:59:59.999Z',
          });
        }),

        http.get('*/api/organizations/org_123', async () => {
          await delay(200);
          return HttpResponse.json({
            id: 'org_123',
            name: 'Gary Food Network',
            image:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
          });
        }),

        http.post('*/api/invites/accept', async () => {
          await delay(300);
          return HttpResponse.json({
            success: true,
          });
        }),
      ],
    },
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <Story />
          <Toaster />
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof AcceptInviteClient>;

/**
 * Authenticated user happy path.
 * Loads the organization details and allows them to submit the form immediately.
 */
export const AuthenticatedAcceptJourney: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Ensure organization details populated
    const headerTitle = await canvas.findByRole('heading', { name: /Join Gary Food Network/i });
    await expect(headerTitle).toBeInTheDocument();

    // Verify fields pre-populated from search params
    const emailInput = canvas.getByLabelText(/Email Address/i);
    await expect(emailInput).toHaveValue('invited-member@example.com');
    await expect(emailInput).toBeDisabled(); // Pre-filled from search parameter

    const codeInput = canvas.getByLabelText(/Invitation Code/i);
    await expect(codeInput).toHaveValue('INVITE_CODE_XYZ');

    // Submit the acceptance form
    const acceptBtn = canvas.getByRole('button', { name: /Accept Invitation/i });
    await userEvent.click(acceptBtn);

    // Confirm loading feedback displays
    await waitFor(async () => {
      await expect(canvas.getByText(/Accepting.../i)).toBeInTheDocument();
    });
  },
};

/**
 * Unauthenticated guest path.
 * Hides the input form and presents a descriptive call-to-action button to log in.
 */
export const UnauthenticatedState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({});
        }),
        http.get('*/api/organizations/org_123', () => {
          return HttpResponse.json({
            id: 'org_123',
            name: 'Gary Food Network',
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check that we see the organization context but not the entry form
    await expect(await canvas.findByText('Join Gary Food Network')).toBeInTheDocument();
    await expect(canvas.queryByLabelText(/Invitation Code/i)).not.toBeInTheDocument();

    // Verify presence of redirect login button
    const loginButton = canvas.getByRole('button', { name: /Sign In to Accept Invite/i });
    await expect(loginButton).toBeInTheDocument();
  },
};

/**
 * Loading state showing the custom skeleton loader structure while organization queries remain pending.
 */
export const OrganizationLoading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/organizations/org_123', async () => {
          // Infinite delay to demonstrate skeleton components
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Simulates a faulty request context where the organization query returns missing or bad values.
 */
export const InvalidInvitationState: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/verify-invite',
        query: {
          org: 'non_existent_id',
          code: '',
          email: '',
        },
      },
    },
    msw: {
      handlers: [
        http.get('*/api/organizations/non_existent_id', () => {
          return HttpResponse.json({ error: 'Organization not found' }, { status: 404 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const errorHeading = await canvas.findByRole('heading', { name: /Invalid Invitation/i });
    await expect(errorHeading).toBeInTheDocument();

    const homeButton = canvas.getByRole('button', { name: /Return Home/i });
    await expect(homeButton).toBeInTheDocument();
  },
};
