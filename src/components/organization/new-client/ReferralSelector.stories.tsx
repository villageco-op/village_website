import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';
import { useState } from 'react';

import { ReferralSelector } from './ReferralSelector';

import { Toaster } from '@/components/ui/sonner';
import type { Referrer } from '@/lib/api/generated/models';

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

const MOCK_REFERRERS: Referrer[] = [
  {
    id: 'ref_1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-0100',
  },
  {
    id: 'ref_2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-0200',
  },
  {
    id: 'ref_3',
    name: 'John Wayne',
    email: 'bruce@wayne.com',
    phone: '555-0300',
  },
];

/**
 * Interactive wrapper to let Storybook capture state updates correctly.
 */
function ReferralSelectorStoryWrapper() {
  const [selected, setSelected] = useState<Referrer | null>(null);

  return (
    <div className="mx-auto max-w-md rounded-xl border border-border bg-white p-6 shadow-sm">
      <ReferralSelector selectedReferrer={selected} onSelect={setSelected} />
    </div>
  );
}

const meta: Meta<typeof ReferralSelectorStoryWrapper> = {
  title: 'Org/NewClient/ReferralSelector',
  component: ReferralSelectorStoryWrapper,
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [
        http.get('*/clients/search-referrer', async ({ request }) => {
          const url = new URL(request.url);
          const q = url.searchParams.get('q')?.toLowerCase() || '';

          await delay(150);

          if (!q) {
            return HttpResponse.json({ exactMatch: false, results: [] });
          }

          const filtered = MOCK_REFERRERS.filter(
            (r) =>
              r.name.toLowerCase().includes(q) || (r.email && r.email.toLowerCase().includes(q)),
          );

          return HttpResponse.json(
            {
              exactMatch: filtered.length === 1,
              results: filtered,
            },
            { status: 200 },
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
type Story = StoryObj<typeof ReferralSelectorStoryWrapper>;

export const Default: Story = {};

/**
 * Verifies that searching for a broad query returns a list of candidates
 * and prompts manual selection.
 */
export const ManualSelectionOnMultipleMatches: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const searchInput = canvas.getByPlaceholderText(/search by name, email, or phone/i);
    const searchBtn = canvas.getByRole('button', { name: /search/i });

    await step('Input term matching multiple candidates', async () => {
      await userEvent.type(searchInput, 'John');
      await userEvent.click(searchBtn);
    });

    await step('Verify selection list contains both candidates', async () => {
      await expect(await canvas.findByText('John Doe')).toBeInTheDocument();
      await expect(await canvas.findByText('John Wayne')).toBeInTheDocument();
    });

    await step('Manually select Bruce Wayne candidate', async () => {
      const resultsContainer = canvas.getByText('John Wayne').closest('div')?.parentElement;
      const selectBtn = within(resultsContainer!).getByRole('button', { name: /select/i });
      await userEvent.click(selectBtn);
    });
  },
};

/**
 * Verifies that clicking "Cancel" within a multiple matches container resets the view.
 */
export const CancelMultipleSelection: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const searchInput = canvas.getByPlaceholderText(/search by name, email, or phone/i);
    const searchBtn = canvas.getByRole('button', { name: /search/i });

    await step('Perform search', async () => {
      await userEvent.type(searchInput, 'John');
      await userEvent.click(searchBtn);
    });

    await step('Click cancel', async () => {
      await expect(
        await canvas.findByRole('button', { name: /cancel search/i }),
      ).toBeInTheDocument();
      await userEvent.click(canvas.getByRole('button', { name: /cancel search/i }));
    });

    await step('Verify view is reset', async () => {
      await expect(canvas.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
    });
  },
};
