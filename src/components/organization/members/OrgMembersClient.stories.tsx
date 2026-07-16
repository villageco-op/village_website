import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, screen } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import OrgMembersClient from './OrgMembersClient';

import { Toaster } from '@/components/ui/sonner';
import { OrgRole } from '@/lib/api/generated/models';
import type { User, OrgMember } from '@/lib/api/generated/models';

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

let mockMembers: OrgMember[] = [
  {
    id: 'usr_admin',
    name: 'Admin User',
    email: 'admin@company.com',
    orgRole: OrgRole.admin,
  },
  {
    id: 'usr_1',
    name: 'Alice Freeman',
    email: 'alice@company.com',
    orgRole: OrgRole.admin,
  },
  {
    id: 'usr_2',
    name: 'Bob Vance',
    email: 'bob@vancerefrig.com',
    orgRole: OrgRole.member,
  },
];

const MOCK_ADMIN_USER: User = {
  id: 'usr_admin',
  name: 'Admin User',
  email: 'admin@company.com',
  organizationId: 'org_123',
  orgRole: OrgRole.admin,
  emailVerified: '2024-01-01T00:00:00Z',
  image: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  aboutMe: null,
  deliveryRangeMiles: '0',
  specialties: [],
  goal: '90',
  stripeOnboardingComplete: false,
  isOnboardingComplete: true,
  address: '123 Forest Ave',
  city: 'Madison',
  lat: 43.07,
  lng: -89.4,
  state: 'WI',
  country: 'United States',
  zip: '53703',
};

const meta: Meta<typeof OrgMembersClient> = {
  title: 'Org/Members/OrgMembersClient',
  component: OrgMembersClient,
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [
        // Default: Mock active admin session for useAuth()
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: MOCK_ADMIN_USER,
            expires: '9999-12-31T23:59:59.999Z',
          });
        }),

        http.get('*/api/organizations/:orgId/members', async ({ params, request }) => {
          const url = new URL(request.url);
          const search = url.searchParams.get('search')?.toLowerCase() || '';
          const role = url.searchParams.get('role');
          const page = parseInt(url.searchParams.get('page') || '1', 10);
          const limit = parseInt(url.searchParams.get('limit') || '10', 10);

          await delay(100);

          let filteredList = [...mockMembers];

          if (search) {
            filteredList = filteredList.filter(
              (m) =>
                m.name?.toLowerCase().includes(search) || m.email?.toLowerCase().includes(search),
            );
          }

          if (role && role !== 'all') {
            filteredList = filteredList.filter((m) => m.orgRole === role);
          }

          const paginatedList = filteredList.slice((page - 1) * limit, page * limit);

          return HttpResponse.json(
            {
              data: paginatedList,
              meta: {
                total: filteredList.length,
                totalPages: Math.ceil(filteredList.length / limit),
                page,
                limit,
              },
            },
            { status: 200 },
          );
        }),

        http.put('*/api/organizations/members/role', async ({ request }) => {
          const body = (await request.json()) as { userId?: string; role?: OrgRole };

          if (!body.userId || !body.role) {
            return HttpResponse.json({ error: 'Missing parameters' }, { status: 400 });
          }

          await delay(150);

          mockMembers = mockMembers.map((member) =>
            member.id === body.userId ? { ...member, orgRole: body.role! } : member,
          );

          return HttpResponse.json(
            { success: true, userId: body.userId, role: body.role },
            { status: 200 },
          );
        }),

        http.post('*/api/organizations/members/remove', async ({ request }) => {
          const body = (await request.json()) as { userId?: string };

          if (!body.userId) {
            return HttpResponse.json({ error: 'User ID is required' }, { status: 400 });
          }

          await delay(150);

          mockMembers = mockMembers.filter((member) => member.id !== body.userId);

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
type Story = StoryObj<typeof OrgMembersClient>;

/**
 * Standard administrative interface showing the active members dashboard table.
 */
export const Default: Story = {
  beforeEach: () => {
    mockMembers = [
      {
        id: 'usr_admin',
        name: 'Admin User',
        email: 'admin@company.com',
        orgRole: OrgRole.admin,
      },
      {
        id: 'usr_1',
        name: 'Alice Freeman',
        email: 'alice@company.com',
        orgRole: OrgRole.admin,
      },
      {
        id: 'usr_2',
        name: 'Bob Vance',
        email: 'bob@vancerefrig.com',
        orgRole: OrgRole.member,
      },
    ];
  },
};

/**
 * Ensures strict security checks render a full-screen block error
 * if a user attempts to view this panel without Admin privileges.
 */
export const AccessDenied: Story = {
  parameters: {
    msw: {
      handlers: [
        // Override session handler to return a normal member (not Admin)
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: {
              ...MOCK_ADMIN_USER,
              orgRole: OrgRole.member,
            },
            expires: '9999-12-31T23:59:59.999Z',
          });
        }),
      ],
    },
  },
};

/**
 * Renders an alternative error state if the user accounts exist
 * without an associated active workspace context.
 */
export const NoOrganizationFound: Story = {
  parameters: {
    msw: {
      handlers: [
        // Override session handler to return a user with no organization context
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: {
              ...MOCK_ADMIN_USER,
              organizationId: null,
            },
            expires: '9999-12-31T23:59:59.999Z',
          });
        }),
      ],
    },
  },
};

/**
 * Simulates a successful role modification event with mock network feedback.
 */
export const ChangeMemberRoleFlow: Story = {
  beforeEach: () => {
    mockMembers = [
      {
        id: 'usr_admin',
        name: 'Admin User',
        email: 'admin@company.com',
        orgRole: OrgRole.admin,
      },
      {
        id: 'usr_2',
        name: 'Bob Vance',
        email: 'bob@vancerefrig.com',
        orgRole: OrgRole.member,
      },
    ];
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // Wait for client to finish fetching active member lists
    await expect(await canvas.findByText('bob@vancerefrig.com')).toBeInTheDocument();

    await step('Click the change role action button for Bob', async () => {
      const changeRoleBtns = canvas.getAllByRole('button', { name: /Change Role/i });
      // Index 0 is the self-admin row (disabled), Index 1 targets Bob
      await userEvent.click(changeRoleBtns[1]);
    });

    // Access dialog content from Document body portal
    const body = within(canvasElement.ownerDocument.body);

    await step('Verify modal is open and choose Admin role option', async () => {
      const adminButton = body.getByRole('button', {
        name: /Administrator Full administrative access/i,
      });
      await userEvent.click(adminButton);
    });

    await step('Confirm role change submission', async () => {
      const submitBtn = body.getByRole('button', { name: /Apply Changes/i });
      await userEvent.click(submitBtn);
    });

    await step('Assert successful feedback Toast appears', async () => {
      await expect(await screen.findByText('Role updated successfully.')).toBeInTheDocument();
    });
  },
};

/**
 * Simulates removing a member from the workspace with network confirmation.
 */
export const RemoveMemberFlow: Story = {
  beforeEach: () => {
    mockMembers = [
      {
        id: 'usr_admin',
        name: 'Admin User',
        email: 'admin@company.com',
        orgRole: OrgRole.admin,
      },
      {
        id: 'usr_2',
        name: 'Bob Vance',
        email: 'bob@vancerefrig.com',
        orgRole: OrgRole.member,
      },
    ];
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // Wait for members list render
    await expect(await canvas.findByText('bob@vancerefrig.com')).toBeInTheDocument();

    await step('Click the remove member button for Bob', async () => {
      const removeButtons = canvas.getAllByRole('button', { name: /Remove/i });
      // Index 0 is self-admin (disabled/hidden), Index 1 targets Bob
      await userEvent.click(removeButtons[1]);
    });

    const body = within(canvasElement.ownerDocument.body);

    await step('Verify confirmation warning is displayed and submit removal', async () => {
      await expect(body.getByText(/immediately lose access/i)).toBeInTheDocument();
      const confirmButton = body.getByRole('button', { name: /Confirm Removal/i });
      await userEvent.click(confirmButton);
    });

    await expect(await screen.findByText('Member was removed.')).toBeInTheDocument();
  },
};
