import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect, waitFor } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import OrganizationOnboardingFlow from './OrganizationOnboardingFlow';

import { TutorialProvider } from '@/components/providers/TutorialProvider';
import { Toaster } from '@/components/ui/sonner';
import { type Invite, OrgInviteStatus, OrgRole } from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

let mockInvites: Array<Invite> = [];

const meta: Meta<typeof OrganizationOnboardingFlow> = {
  title: 'Onboarding/Organization/OnboardingFlow',
  component: OrganizationOnboardingFlow,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/onboarding',
      },
    },
    msw: {
      handlers: [
        http.get('*/api/organizations/subdomain/check', async ({ request }) => {
          const url = new URL(request.url);
          const subdomain = url.searchParams.get('subdomain');
          await delay(100);
          return HttpResponse.json({
            available: subdomain !== 'taken',
            suggestion: 'suggested-hub',
          });
        }),

        http.post('*/api/upload', async () => {
          await delay(200);
          return HttpResponse.json({ url: 'https://example.com/logo.jpg' });
        }),

        http.post('*/api/location/geocode', async () => {
          await delay(150);
          return HttpResponse.json({ lat: 41.5934, lng: -87.3464 });
        }),

        http.post('*/api/organizations', async () => {
          await delay(300);
          return HttpResponse.json({ id: 'org_123', success: true }, { status: 201 });
        }),

        http.get('*/api/invites/list', async ({ request }) => {
          const url = new URL(request.url);
          const page = parseInt(url.searchParams.get('page') || '1', 10);
          const limit = parseInt(url.searchParams.get('limit') || '10', 10);

          await delay(100);

          return HttpResponse.json(
            {
              data: mockInvites,
              meta: {
                total: mockInvites.length,
                page,
                limit,
                totalPages: Math.ceil(mockInvites.length / limit),
              },
            },
            { status: 200 },
          );
        }),

        http.post('*/api/invites/invite', async ({ request }) => {
          const body = (await request.json()) as { email?: string; role?: OrgRole };
          const email = body.email;
          const role = body.role || OrgRole.member;

          if (!email) {
            return HttpResponse.json({ error: 'Email is required' }, { status: 400 });
          }

          await delay(200);

          const newInvite = {
            id: `invite_${Math.random().toString(36).substring(2, 11)}`,
            email,
            orgId: 'org_123',
            code: 'abc123',
            role,
            status: OrgInviteStatus.pending,
            expiresAt: new Date(Date.now() + 86400000).toISOString(),
            createdAt: new Date().toISOString(),
          };
          mockInvites.push(newInvite);

          return HttpResponse.json({ success: true }, { status: 200 });
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={mockedQueryClient}>
        <TutorialProvider>
          <Story />
          <Toaster />
        </TutorialProvider>
      </QueryClientProvider>
    ),
  ],
  tags: ['autodocs'],
  args: {
    onBack: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrganizationOnboardingFlow>;

/**
 * The initial landing step of the orchestration flow.
 * Requests selection of organization type.
 */
export const InitialState: Story = {};

/**
 * End-to-end user flow executing all steps sequentially:
 * Org Type Selection -> Profile Configuration Form -> Network registration -> Team Invitations.
 */
export const CompleteOnboardingJourney: Story = {
  beforeEach: () => {
    mockInvites = [];
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // --- STEP 1: Select Organization Type ---
    const pantryBtn = await canvas.findByRole('button', { name: /Food Pantry/i });
    await userEvent.click(pantryBtn);

    // --- STEP 2: Fill Organization Details ---
    const orgNameInput = await canvas.findByLabelText(/Organization Name/i);
    await userEvent.type(orgNameInput, 'Gary Food Network');

    const subdomainInput = canvas.getByLabelText(/Custom Subdomain/i);
    await userEvent.type(subdomainInput, 'gary-network');

    const addressInput = canvas.getByLabelText(/Street Address/i);
    await userEvent.type(addressInput, '401 Broadway');

    const zipInput = canvas.getByLabelText(/ZIP Code/i);
    await userEvent.type(zipInput, '46402');

    // Wait for async MSW subdomain check message to surface and clear the dynamic button locking
    await waitFor(async () => {
      const availableIndicator = await canvas.findByText(/Subdomain is available!/i);
      await expect(availableIndicator).toBeInTheDocument();
    });

    const step2SubmitBtn = canvas.getByRole('button', { name: /Create Organization/i });
    await userEvent.click(step2SubmitBtn);

    // --- STEP 3: Team Invitations Panel ---
    const inviteEmailInput = await canvas.findByLabelText(/Member Email Address/i);
    await userEvent.type(inviteEmailInput, 'partner@garyfood.org');

    const inviteBtn = await canvas.findByRole('button', { name: /Invite/i });
    await waitFor(() => expect(inviteBtn).toBeEnabled());
    await userEvent.click(inviteBtn);

    // Verify row item append inside list array layout table
    await waitFor(async () => {
      const tableRecord = await canvas.findByText('partner@garyfood.org');
      await expect(tableRecord).toBeInTheDocument();
    });

    // Complete the flow orchestrator redirect sequences
    const finishBtn = canvas.getByRole('button', { name: /Finish & Go to Dashboard/i });
    await userEvent.click(finishBtn);
  },
};

/**
 * Simulates a server failure during organization creation to ensure
 * error messages display correctly and the app stays on the current step.
 */
export const ServerErrorJourney: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/organizations', async () => {
          await delay(200);
          return HttpResponse.json({ error: 'Database transaction failure.' }, { status: 400 });
        }),
        http.get('*/api/organizations/subdomain/check', async () => {
          await delay(100);
          return HttpResponse.json({
            available: true,
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Transition straight into Details form configuration
    await userEvent.click(await canvas.findByRole('button', { name: /Food Pantry/i }));

    await userEvent.type(await canvas.findByLabelText(/Organization Name/i), 'Fail Hub');
    await userEvent.type(canvas.getByLabelText(/Custom Subdomain/i), 'fail-hub');
    await userEvent.type(canvas.getByLabelText(/Street Address/i), '999 Broken Way');
    await userEvent.type(canvas.getByLabelText(/ZIP Code/i), '46404');

    await expect(await canvas.findByText(/Subdomain is available!/i)).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: /Create Organization/i }));

    // Confirm wizard layout flow state doesn't transition into step 3 (invite screen)
    await waitFor(async () => {
      const formHeading = canvas.getByRole('heading', { name: /Organization Profile/i });
      await expect(formHeading).toBeInTheDocument();
    });
  },
};
