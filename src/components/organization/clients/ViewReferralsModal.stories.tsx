import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import { ViewReferralsModal } from './ViewReferralsModal';

import type { ClientResponse } from '@/lib/api/generated/models';

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

const mockClient: ClientResponse = {
  id: 'cli_123',
  name: 'Sarah Connor',
  email: 'sarah@skynet.com',
  phone: '(555) 123-4567',
  address: '123 Forest Ave',
  city: 'Madison',
  state: 'WI',
  country: 'USA',
  zip: '53703',
  organizationId: 'org-1',
  createdById: 'user-1',
  referredBy: null as any,
  active: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockReferralsList = [
  {
    id: 'ref_1',
    name: 'Kyle Reese',
    email: 'kyle.reese@resistance.org',
  },
  {
    id: 'ref_2',
    name: 'John Connor',
    email: 'john.connor@resistance.org',
  },
];

const meta: Meta<typeof ViewReferralsModal> = {
  title: 'Org/Clients/ViewReferralsModal',
  component: ViewReferralsModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    client: mockClient,
    maxReferrals: 4,
    onClose: fn(),
  },
  decorators: [
    (Story) => {
      const queryClient = createQueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ViewReferralsModal>;

/**
 * Partial referral allotment populated via MSW endpoint (2 out of 4 referrals claimed).
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/clients/cli_123/referrals', () => {
          return HttpResponse.json({
            data: mockReferralsList,
            meta: { total: 2 },
          });
        }),
      ],
    },
  },
};

/**
 * Infinite/Delayed response simulation demonstrating the inline skeleton spinner state.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/clients/cli_123/referrals', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Simulates a server error (500 internal server error) fetching client referrals.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/clients/cli_123/referrals', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    const errorBanner = await body.findByText('Failed to load referral list.');
    await expect(errorBanner).toBeInTheDocument();
  },
};

/**
 * State where the client hasn't referred anyone yet (0 of 4 used).
 */
export const EmptyReferrals: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/clients/cli_123/referrals', () => {
          return HttpResponse.json({
            data: [],
            meta: { total: 0 },
          });
        }),
      ],
    },
  },
};

/**
 * Maximum capacity state where all 4 referral slots are claimed and verified.
 */
export const MaxAllotmentReached: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/clients/cli_123/referrals', () => {
          return HttpResponse.json({
            data: [
              ...mockReferralsList,
              { id: 'ref_3', name: 'Miles Dyson', email: 'miles@cyberdyne.com' },
              { id: 'ref_4', name: 'Marcus Wright', email: 'marcus@projectangel.org' },
            ],
            meta: { total: 4 },
          });
        }),
      ],
    },
  },
};
