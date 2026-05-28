import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import BrowseProduceClient from './BrowseProduceClient';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof BrowseProduceClient> = {
  title: 'Buyer/BrowseProduce/BrowseProducePage',
  component: BrowseProduceClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    msw: {
      handlers: [
        http.get('*/api/produce/list', () => {
          return HttpResponse.json({
            data: [
              {
                id: '1',
                name: 'List View Item',
                sellerName: 'Farmer Joe',
                price: '0.10',
                amount: '100',
              },
            ],
            meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
          });
        }),
        http.get('*/api/produce/map', () => {
          return HttpResponse.json([
            {
              sellerId: 'seller-1',
              lat: 41.602,
              lng: -87.3371,
              produce: [
                { id: 'p1', name: 'Map View Item', price: '0.15', availableInventory: '160' },
              ],
            },
          ]);
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={mockedQueryClient}>
        <div className="bg-slate-50 flex flex-col h-screen w-full">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BrowseProduceClient>;

/**
 * Verifies that the component starts in List view and can switch to Map view.
 */
export const ToggleViewFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Check if we start in List View
    await expect(await canvas.findByText('List View Item')).toBeInTheDocument();

    // 2. Find and click the Map toggle button
    const mapButton = canvas.getByRole('button', { name: /map/i });
    await userEvent.click(mapButton);

    // 3. Verify Map view elements appear
    await expect(await canvas.findByText(/Active Sellers/i)).toBeInTheDocument();

    // 4. Switch back to List View
    const listButton = canvas.getByRole('button', { name: /list/i });
    await userEvent.click(listButton);

    await expect(await canvas.findByText('List View Item')).toBeInTheDocument();
  },
};

/**
 * Useful for checking the layout and padding of the shell
 * when the children are in a loading state.
 */
export const ShellLoading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/list', () => new Promise(() => {})), // Never resolves
        http.get('*/api/produce/map', () => new Promise(() => {})),
      ],
    },
  },
};
