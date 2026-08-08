import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, screen, waitFor } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import OrgInviteStep from './OrgInviteStep';

import { Toaster } from '@/components/ui/sonner';
import { type Invite, OrgInviteStatus } from '@/lib/api/generated/models';
import { OrgRole } from '@/lib/api/generated/models/orgRole';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

let mockInvites: Invite[] = [
  {
    id: 'invite_1',
    email: 'existing.member@example.com',
    orgId: 'org_123',
    code: 'xyz789',
    role: OrgRole.member,
    status: 'pending',
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
  },
];

const meta: Meta<typeof OrgInviteStep> = {
  title: 'Onboarding/Organization/OrgInviteStep',
  component: OrgInviteStep,
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        http.get('*/api/invites/list', async ({ request }) => {
          const url = new URL(request.url);
          const page = parseInt(url.searchParams.get('page') || '1', 10);
          const limit = parseInt(url.searchParams.get('limit') || '10', 10);

          await delay(150);

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
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const queryClient = createQueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
          <Toaster />
        </QueryClientProvider>
      );
    },
  ],
  args: {
    onInvite: async () => {
      await delay(100);
      return true;
    },
    onFinish: () => {},
    onBack: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof OrgInviteStep>;

/**
 * Initial state showing existing team invitations.
 */
export const Default: Story = {
  beforeEach: () => {
    mockInvites = [
      {
        id: 'invite_1',
        email: 'existing.member@example.com',
        orgId: 'org_123',
        code: 'xyz789',
        role: OrgRole.member,
        status: 'pending',
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => {
      await expect(canvas.getByText('existing.member@example.com')).toBeInTheDocument();
    });
  },
};

/**
 * Simulates entering an email, picking a non-default permission level,
 * and performing the network submission and list refetch cycle.
 */
export const SendingInvitationFlow: Story = {
  beforeEach: () => {
    mockInvites = [];
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emailInput = canvas.getByLabelText(/Member Email Address/i);
    await userEvent.type(emailInput, 'admin.team@example.com');

    // Open permissions select dropdown card
    const roleDropdown = canvas.getByRole('combobox');
    await userEvent.click(roleDropdown);

    // Pick Admin option from Radix portal overlay context
    const adminOption = await screen.findByRole('option', { name: 'Admin' });
    await userEvent.click(adminOption);

    // Click trigger action button
    const inviteBtn = canvas.getByRole('button', { name: /Invite/i });
    await waitFor(() => expect(inviteBtn).toBeEnabled());
    await userEvent.click(inviteBtn);

    await expect(await canvas.findByText('admin.team@example.com')).toBeInTheDocument();
  },
};

/**
 * Tests form behaviors when dealing with invalid user strings.
 */
export const FormValidationErrorFlow: Story = {
  beforeEach: () => {
    mockInvites = [];
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emailInput = canvas.getByLabelText(/Member Email Address/i);
    await userEvent.type(emailInput, 'not-a-valid-email');

    const inviteBtn = canvas.getByRole('button', { name: /Invite/i });
    await userEvent.click(inviteBtn);

    // Check that the table remains empty since the request was blocked on validation
    await expect(canvas.queryByRole('table')).not.toBeInTheDocument();
  },
};
