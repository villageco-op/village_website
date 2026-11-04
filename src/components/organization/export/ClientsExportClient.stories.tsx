import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within } from '@storybook/test';
import { http, HttpResponse } from 'msw';

import ClientsExportClient from './ClientsExportClient';

import { generateMockClients } from '@/lib/storybook/utils/clientMockGenerators';

const mockClients = generateMockClients(3);

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
