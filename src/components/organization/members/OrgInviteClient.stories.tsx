import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import OrgInviteClient from './OrgInviteClient';

import { Toaster } from '@/components/ui/sonner';
import { OrgRole } from '@/lib/api/generated/models';
import type { Invite } from '@/lib/api/generated/models';
import { BASE_MOCK_INVITE } from '@/lib/storybook/mocks/invite.mock';
import { MOCK_ORG_ADMIN_USER, MOCK_ORG_MEMBER_USER } from '@/lib/storybook/mocks/user.mock';
import { generateMockInvites } from '@/lib/storybook/utils/clientMockGenerators';

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

let mockInvites = generateMockInvites(1);

const meta: Meta<typeof OrgInviteClient> = {
  title: 'Org/Members/OrgInviteClient',
  component: OrgInviteClient,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: MOCK_ORG_ADMIN_USER,
            expires: '9999-12-31T23:59:59.999Z',
          });
        }),

        http.get('*/api/invites/list', async ({ request }) => {
          const url = new URL(request.url);
          const page = parseInt(url.searchParams.get('page') || '1', 10);
          const limit = parseInt(url.searchParams.get('limit') || '10', 10);

          await delay(100);

          const paginatedList = mockInvites.slice((page - 1) * limit, page * limit);

          return HttpResponse.json(
            {
              data: paginatedList,
              meta: {
                total: mockInvites.length,
                totalPages: Math.ceil(mockInvites.length / limit),
                page,
                limit,
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

          await delay(150);

          const newInvite: Invite = {
            id: `invite_${Math.random().toString(36).substring(2, 11)}`,
            email,
            orgId: 'org_123',
            code: 'xyz555',
            role,
            status: 'pending',
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
};

export default meta;
type Story = StoryObj<typeof OrgInviteClient>;

/**
 * Standard client dashboard showing the list of pending organization invites.
 */
export const Default: Story = {
  beforeEach: () => {
    mockInvites = [BASE_MOCK_INVITE];
  },
};

/**
 * Displays an Access Denied panel when a regular member attempts to reach this module.
 */
export const AccessDenied: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: MOCK_ORG_MEMBER_USER,
            expires: '9999-12-31T23:59:59.999Z',
          });
        }),
      ],
    },
  },
};

/**
 * Tests submitting the nested `InviteMembersForm` and seeing it append
 * to the local invites table upon a successful server reload.
 */
export const CreateAndRefetchInviteFlow: Story = {
  beforeEach: () => {
    mockInvites = [];
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Enter invitation details', async () => {
      const emailInput = await canvas.findByLabelText(/Member Email Address/i);
      await userEvent.type(emailInput, 'new.recruit@example.com');

      const roleDropdown = canvas.getByRole('combobox');
      await userEvent.click(roleDropdown);

      const body = within(document.body);
      const adminOption = await body.findByRole('option', { name: 'Admin' });
      await userEvent.click(adminOption);
    });

    await step('Submit and dispatch mock post request', async () => {
      const inviteBtn = canvas.getByRole('button', { name: /Invite/i });
      await userEvent.click(inviteBtn);
    });

    await step('Verify dynamic entry lists update inside tables', async () => {
      await expect(await canvas.findByText('new.recruit@example.com')).toBeInTheDocument();
      const body = within(document.body);
      await expect(
        body.getByText('Invitation sent to new.recruit@example.com'),
      ).toBeInTheDocument();
    });
  },
};

/**
 * Renders pagination UI controls when multiple pages of invitations exist.
 */
export const MultiPagePagination: Story = {
  beforeEach: () => {
    mockInvites = generateMockInvites(15);
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // Wait for page 1 load
    await expect(await canvas.findByText('pending.teammate1@example.com')).toBeInTheDocument();

    await step('Click next page pagination trigger', async () => {
      const nextBtn = canvas.getByRole('button', { name: /next/i });
      await userEvent.click(nextBtn);
    });

    await step('Verify next items render from query key change', async () => {
      await expect(await canvas.findByText('pending.teammate11@example.com')).toBeInTheDocument();
    });
  },
};
