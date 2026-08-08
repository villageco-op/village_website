import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, screen } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import { InviteMembersForm } from './InviteMembersForm';

import { Toaster } from '@/components/ui/sonner';
import { OrgRole } from '@/lib/api/generated/models';
import type { Invite } from '@/lib/api/generated/models';

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

let mockInvitedMembers: Invite[] = [];

const meta: Meta<typeof InviteMembersForm> = {
  title: 'Org/Members/InviteMembersForm',
  component: InviteMembersForm,
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        http.post('*/api/invites/invite', async ({ request }) => {
          const body = (await request.json()) as { email?: string; role?: OrgRole };
          const email = body.email;
          const role = body.role || OrgRole.member;

          if (!email) {
            return HttpResponse.json({ error: 'Email is required' }, { status: 400 });
          }

          if (email === 'fail-on-server@example.com') {
            return HttpResponse.json({ error: 'This domain is restricted.' }, { status: 400 });
          }

          await delay(200);

          const newInvite: Invite = {
            id: `invite_${Math.random().toString(36).substring(2, 11)}`,
            email,
            orgId: 'org_123',
            code: 'abc123',
            role,
            status: 'pending',
            expiresAt: new Date(Date.now() + 86400000).toISOString(),
            createdAt: new Date().toISOString(),
          };

          mockInvitedMembers.push(newInvite);

          return HttpResponse.json({ success: true }, { status: 200 });
        }),
      ],
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const queryClient = createQueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <div className="w-162.5 max-w-full p-4 bg-slate-50 rounded-2xl">
            <Story />
          </div>
          <Toaster />
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof InviteMembersForm>;

/**
 * Empty state showing the pristine form before any invites exist.
 */
export const Empty: Story = {
  args: {
    invitedMembers: [],
    isLoading: false,
    isError: false,
    onSuccessMutation: () => {},
    onRetryFetch: () => {},
  },
};

/**
 * Initial state rendering existing invitations.
 */
export const DefaultWithInvites: Story = {
  beforeEach: () => {
    mockInvitedMembers = [
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
      {
        id: 'invite_2',
        email: 'administrator@example.com',
        orgId: 'org_123',
        code: 'xyz123',
        role: OrgRole.admin,
        status: 'pending',
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];
  },
  args: {
    invitedMembers: [
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
      {
        id: 'invite_2',
        email: 'administrator@example.com',
        orgId: 'org_123',
        code: 'xyz123',
        role: OrgRole.admin,
        status: 'pending',
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString(),
      },
    ],
    isLoading: false,
    isError: false,
    onSuccessMutation: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('existing.member@example.com')).toBeInTheDocument();
    await expect(await canvas.findByText('administrator@example.com')).toBeInTheDocument();
  },
};

/**
 * Simulates entering an email, picking a permission level,
 * and performing a successful network submission.
 */
export const SendingInvitationFlow: Story = {
  beforeEach: () => {
    mockInvitedMembers = [];
  },
  args: {
    invitedMembers: mockInvitedMembers,
    isLoading: false,
    isError: false,
    onSuccessMutation: () => {},
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Enter email address', async () => {
      const emailInput = await canvas.findByLabelText(/Member Email Address/i);
      await userEvent.type(emailInput, 'new.designer@example.com');
    });

    await step('Select Admin role', async () => {
      const roleDropdown = canvas.getByRole('combobox');
      await userEvent.click(roleDropdown);
      const adminOption = await screen.findByRole('option', { name: 'Admin' });
      await userEvent.click(adminOption);
    });

    await step('Submit invitation form', async () => {
      const inviteBtn = canvas.getByRole('button', { name: /Invite/i });
      await userEvent.click(inviteBtn);
    });

    await step('Verify toast alerts success', async () => {
      await expect(
        await screen.findByText('Invitation sent to new.designer@example.com'),
      ).toBeInTheDocument();
    });
  },
};

/**
 * Tests submitting an email that has already been invited.
 */
export const DuplicateInvitationErrorFlow: Story = {
  beforeEach: () => {
    mockInvitedMembers = [
      {
        id: 'invite_1',
        email: 'already.invited@example.com',
        orgId: 'org_123',
        code: 'xyz789',
        role: OrgRole.member,
        status: 'pending',
        expiresAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];
  },
  args: {
    invitedMembers: [
      {
        id: 'invite_1',
        email: 'already.invited@example.com',
        orgId: 'org_123',
        code: 'xyz789',
        role: OrgRole.member,
        status: 'pending',
        expiresAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ],
    isLoading: false,
    isError: false,
    onSuccessMutation: () => {},
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Type duplicate email address', async () => {
      const emailInput = await canvas.findByLabelText(/Member Email Address/i);
      await userEvent.type(emailInput, 'already.invited@example.com');
    });

    await step('Attempt duplicate submission', async () => {
      const inviteBtn = canvas.getByRole('button', { name: /Invite/i });
      await userEvent.click(inviteBtn);

      await expect(
        screen.getByText('An invitation has already been sent to this email address.'),
      ).toBeInTheDocument();
    });
  },
};

/**
 * Renders the skeleton loader state when loading invitations.
 */
export const LoadingInvitesList: Story = {
  args: {
    invitedMembers: [],
    isLoading: true,
    isError: false,
    onSuccessMutation: () => {},
  },
};

/**
 * Renders the custom error boundary block with active retry controls.
 */
export const ErrorLoadingInvitesList: Story = {
  args: {
    invitedMembers: [],
    isLoading: false,
    isError: true,
    onSuccessMutation: () => {},
    onRetryFetch: () => alert('Retrying fetch!'),
  },
};
