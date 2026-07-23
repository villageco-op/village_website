import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, screen } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import ClientsPageClient from './ClientsPageClient';

import { Toaster } from '@/components/ui/sonner';
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

const INITIAL_CLIENTS: ClientResponse[] = [
  {
    id: 'cli_1',
    name: 'Acme Corp',
    email: 'contact@acme.com',
    phone: '0001231234',
    address: '123 Forest Ave',
    city: 'Madison',
    state: 'WI',
    country: 'USA',
    zip: '53703',
    organizationId: 'org-1',
    createdById: 'user-1',
    referredBy: null,
    active: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'cli_2',
    name: 'Stark Industries',
    email: 'info@stark.com',
    phone: '0001231234',
    address: '200 Park Ave',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    zip: '10166',
    organizationId: 'org-1',
    createdById: 'user-1',
    referredBy: null,
    active: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'cli_3',
    name: 'Wayne Enterprises',
    email: 'bruce@wayne.com',
    phone: '0001231234',
    address: null,
    city: null,
    state: null,
    country: null,
    zip: null,
    organizationId: 'org-1',
    createdById: 'user-1',
    referredBy: null,
    active: false,
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
];

let mockClients: ClientResponse[] = [...INITIAL_CLIENTS];

const meta: Meta<typeof ClientsPageClient> = {
  title: 'Org/Clients/ClientsPageClient',
  component: ClientsPageClient,
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [
        http.get('*/clients', async ({ request }) => {
          const url = new URL(request.url);
          const search = url.searchParams.get('search')?.toLowerCase() || '';
          const active = url.searchParams.get('active');
          const page = parseInt(url.searchParams.get('page') || '1', 10);
          const limit = parseInt(url.searchParams.get('limit') || '10', 10);

          await delay(100);

          let filtered = [...mockClients];

          if (search) {
            filtered = filtered.filter(
              (c) =>
                c.name?.toLowerCase().includes(search) || c.email?.toLowerCase().includes(search),
            );
          }

          if (active !== null && active !== undefined) {
            const isActive = active === 'true';
            filtered = filtered.filter((c) => c.active === isActive);
          }

          const paginated = filtered.slice((page - 1) * limit, page * limit);

          return HttpResponse.json(
            {
              data: paginated,
              meta: {
                total: filtered.length,
                totalPages: Math.ceil(filtered.length / limit) || 1,
                page,
                limit,
              },
            },
            { status: 200 },
          );
        }),

        http.put('*/clients/:id', async ({ params, request }) => {
          const { id } = params;
          const body = (await request.json()) as Partial<ClientResponse>;

          await delay(150);

          mockClients = mockClients.map((client) =>
            client.id === id ? { ...client, ...body } : client,
          );

          return HttpResponse.json({ success: true }, { status: 200 });
        }),

        http.patch('*/clients/:id/deactivate', async ({ params }) => {
          const { id } = params;
          await delay(150);

          mockClients = mockClients.map((client) =>
            client.id === id ? { ...client, active: false, status: 'inactive' } : client,
          );

          return HttpResponse.json({ success: true }, { status: 200 });
        }),

        http.delete('*/clients/:id', async ({ params }) => {
          const { id } = params;
          await delay(150);

          mockClients = mockClients.filter((client) => client.id !== id);

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
type Story = StoryObj<typeof ClientsPageClient>;

/**
 * Standard view with loaded client data.
 */
export const Default: Story = {
  beforeEach: () => {
    mockClients = [...INITIAL_CLIENTS];
  },
};

/**
 * State displayed when no client records exist.
 */
export const Empty: Story = {
  beforeEach: () => {
    mockClients = [];
  },
};

/**
 * Handles API server error responses gracefully.
 */
export const FetchError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/clients', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};

/**
 * Tests client selection and permanent deletion flow.
 */
export const DeleteClientFlow: Story = {
  beforeEach: () => {
    mockClients = [...INITIAL_CLIENTS];
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText('Acme Corp')).toBeInTheDocument();

    await step('Select client row to enable actions', async () => {
      const clientRow = await canvas.findByText('Acme Corp');
      await userEvent.click(clientRow);
    });

    await step('Click top action bar delete button', async () => {
      const deleteBtn = await canvas.findByRole('button', { name: /delete/i });
      await expect(deleteBtn).toBeEnabled();
      await userEvent.click(deleteBtn);
    });

    const body = within(canvasElement.ownerDocument.body);

    await step('Confirm record removal in modal', async () => {
      const confirmBtn = body.getByRole('button', { name: /Confirm Deletion/i });
      await userEvent.click(confirmBtn);
    });

    await step('Assert deletion toast notification', async () => {
      await expect(
        await screen.findByText('Client record removed permanently.'),
      ).toBeInTheDocument();
    });
  },
};
