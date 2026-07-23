import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect, screen } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import NewClientPageClient from './NewClientPageClient';

import { Toaster } from '@/components/ui/sonner';
import type { CreateClientPayload } from '@/lib/api/generated/models';

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

const meta: Meta<typeof NewClientPageClient> = {
  title: 'Org/NewClient/NewClientPageClient',
  component: NewClientPageClient,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
    msw: {
      handlers: [
        http.get('*/clients/search-referrer', async ({ request }) => {
          const url = new URL(request.url);
          const q = url.searchParams.get('q')?.toLowerCase() || '';

          await delay(100);

          if (q === 'jane') {
            return HttpResponse.json(
              {
                exactMatch: true,
                results: [
                  {
                    id: 'ref_jane',
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    phone: '555-1234',
                  },
                ],
              },
              { status: 200 },
            );
          }

          return HttpResponse.json({ exactMatch: false, results: [] });
        }),

        http.post('*/clients', async ({ request }) => {
          const payload = (await request.json()) as CreateClientPayload;
          await delay(150);
          return HttpResponse.json(
            {
              id: 'new_cli_99',
              ...payload,
              active: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { status: 201 },
          );
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
type Story = StoryObj<typeof NewClientPageClient>;

export const Default: Story = {};

/**
 * Fill out registration details, include a referrer, and submit the client form.
 */
export const CompleteFormSubmission: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Fill out primary client details', async () => {
      await userEvent.type(canvas.getByPlaceholderText('Enter full name'), 'Peter Parker');
      await userEvent.type(canvas.getByPlaceholderText('name@domain.com'), 'peter@dailybugle.com');
      await userEvent.type(canvas.getByPlaceholderText('(555) 000-0000'), '555-1962');
    });

    await step('Fill out address details', async () => {
      await userEvent.type(canvas.getByLabelText(/Street Address/i), '20 Ingram St');

      const cityInput = canvas.getByLabelText(/City/i);
      await userEvent.clear(cityInput);
      await userEvent.type(cityInput, 'Forest Hills');

      const stateDropdown = canvas.getByRole('combobox');
      await userEvent.click(stateDropdown);

      const txOption = await screen.findByRole('option', { name: 'New York' });
      await userEvent.click(txOption);

      await userEvent.type(canvas.getByLabelText(/ZIP Code/i), '11375');
    });

    await step('Search and assign a referrer', async () => {
      const searchInput = canvas.getByPlaceholderText(/search by name, email, or phone/i);
      const searchBtn = canvas.getByRole('button', { name: /search/i });

      await userEvent.type(searchInput, 'jane');
      await userEvent.click(searchBtn);

      await expect(await canvas.findByText('Jane Smith')).toBeInTheDocument();
    });

    await step('Submit client registry payload', async () => {
      const submitBtn = canvas.getByRole('button', { name: /add client/i });
      await userEvent.click(submitBtn);
    });

    await step('Assert successful registration feedback', async () => {
      await expect(await screen.findByText('Client registered successfully.')).toBeInTheDocument();
    });
  },
};
