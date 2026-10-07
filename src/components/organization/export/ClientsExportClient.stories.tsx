import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within } from '@storybook/test';
import { http, HttpResponse } from 'msw';

import ClientsExportClient from './ClientsExportClient';

import type { ClientResponse } from '@/lib/api/generated/models';

const mockClients: ClientResponse[] = [
  {
    id: 'client-1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 (555) 019-2834',
    address: '123 Forest Ave',
    city: 'Madison',
    state: 'WI',
    country: 'USA',
    zip: '53703',
    organizationId: 'org-1',
    createdById: 'user-1',
    referredBy: null as any,
    active: true,
    updatedAt: '2024-01-15T00:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'client-2',
    name: 'Starlight Media',
    email: 'info@starlight.io',
    phone: '+1 (555) 012-9842',
    address: '123 Forest Ave',
    city: 'Madison',
    state: 'WI',
    country: 'USA',
    zip: '53703',
    organizationId: 'org-1',
    createdById: 'user-1',
    referredBy: null as any,
    active: true,
    updatedAt: '2024-01-15T00:00:00Z',
    createdAt: '2024-02-01T14:30:00Z',
  },
  {
    id: 'client-3',
    name: 'Apex Global Logistics',
    email: 'support@apexglobal.com',
    phone: '+1 (555) 017-3311',
    address: '123 Forest Ave',
    city: 'Madison',
    state: 'WI',
    country: 'USA',
    zip: '53703',
    organizationId: 'org-1',
    createdById: 'user-1',
    referredBy: null as any,
    active: true,
    updatedAt: '2024-01-15T00:00:00Z',
    createdAt: '2024-02-20T09:15:00Z',
  },
  {
    id: 'client-4',
    name: 'Nexus Dynamics',
    email: 'hello@nexusdyn.com',
    phone: '+1 (555) 014-7788',
    address: '123 Forest Ave',
    city: 'Madison',
    state: 'WI',
    country: 'USA',
    zip: '53703',
    organizationId: 'org-1',
    createdById: 'user-1',
    referredBy: null as any,
    active: true,
    updatedAt: '2024-01-15T00:00:00Z',
    createdAt: '2024-03-05T11:45:00Z',
  },
  {
    id: 'client-5',
    name: 'Vanguard Systems',
    email: 'contact@vanguard.org',
    phone: '+1 (555) 018-9922',
    address: '123 Forest Ave',
    city: 'Madison',
    state: 'WI',
    country: 'USA',
    zip: '53703',
    organizationId: 'org-1',
    createdById: 'user-1',
    referredBy: null as any,
    active: true,
    updatedAt: '2024-01-15T00:00:00Z',
    createdAt: '2024-03-12T16:20:00Z',
  },
];

const meta: Meta<typeof ClientsExportClient> = {
  title: 'Org/Export/ClientsExportClient',
  component: ClientsExportClient,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Parent client export page component that handles lazy multi-page client fetching, progress dialog feedback, and preview formatting prior to export/print operations.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ClientsExportClient>;

/**
 * Initial idle view prior to triggering any export or print action. Zero data is fetched on mount.
 */
export const IdleInitialState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/clients*', () => {
          return HttpResponse.json({
            data: mockClients,
            meta: {
              page: 1,
              limit: 50,
              total: mockClients.length,
              totalPages: 1,
            },
          });
        }),
      ],
    },
  },
};

/**
 * Story demonstrating completed fetch cycle after clicking print.
 */
export const LoadedWithData: Story = {
  ...IdleInitialState,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const actionButton = canvas.getByRole('button', { name: /print/i });
    await userEvent.click(actionButton);
  },
};

/**
 * Active modal state showing loading progress and progress indicators while data is dynamically fetched.
 */
export const FetchingModalProgress: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/clients*', async () => {
          // Delay indefinitely to freeze state in active loading dialog view
          await new Promise(() => {});
          return HttpResponse.json({});
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const actionButton = canvas.getByRole('button', { name: /print/i });
    await userEvent.click(actionButton);
  },
};

/**
 * Empty state displayed inside the export summary table when no client records exist.
 */
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/clients*', () => {
          return HttpResponse.json({
            data: [],
            meta: {
              page: 1,
              limit: 50,
              total: 0,
              totalPages: 1,
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const actionButton = canvas.getByRole('button', { name: /print/i });
    await userEvent.click(actionButton);
  },
};

/**
 * Error state rendered inside the modal dialog when an API fetch failure occurs.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/clients*', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const actionButton = canvas.getByRole('button', { name: /print/i });
    await userEvent.click(actionButton);
  },
};

/**
 * Multi-page state displaying sequential batch pagination loading inside the progress modal.
 */
export const MultiPagePagination: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/clients*', ({ request }) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page') || '1');

          if (page === 1) {
            return HttpResponse.json({
              data: mockClients.slice(0, 3),
              meta: {
                page: 1,
                limit: 3,
                total: mockClients.length,
                totalPages: 2,
              },
            });
          }

          return HttpResponse.json({
            data: mockClients.slice(3),
            meta: {
              page: 2,
              limit: 3,
              total: mockClients.length,
              totalPages: 2,
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const actionButton = canvas.getByRole('button', { name: /print/i });
    await userEvent.click(actionButton);
  },
};
