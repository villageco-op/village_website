import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import EditListingClient from './EditListingClient';

import { Toaster } from '@/components/ui/sonner';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_ID = 'prod_123';

const meta: Meta<typeof EditListingClient> = {
  title: 'Seller/EditListing/EditListingPage',
  component: EditListingClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    id: MOCK_ID,
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <Toaster />
          <div className="bg-off-white min-h-screen">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof EditListingClient>;

/**
 * Successful data fetch and display.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/produce/${MOCK_ID}`, () => {
          return HttpResponse.json({
            status: 200,
            data: {
              title: 'Organic Strawberries',
              produceType: 'Fruit',
              pricePerOz: 0.5, // $8.00/lb
              totalOzInventory: 160, // 10 lbs
              availableBy: '2026-06-01T12:00:00Z',
              seasonStart: '2026-05-01',
              seasonEnd: '2026-08-01',
              status: 'active',
              images: [],
            },
          });
        }),
      ],
    },
  },
};

/**
 * Tests the update flow (Submit changes).
 */
export const UpdateSuccess: Story = {
  parameters: {
    msw: {
      handlers: [
        ...Default.parameters!.msw.handlers,
        http.put(`*/api/produce/${MOCK_ID}`, async () => {
          await delay(800);
          return HttpResponse.json({ status: 200 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const titleInput = await canvas.findByLabelText(/Title/i);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Premium Strawberries');

    const saveBtn = canvas.getByRole('button', { name: /Save Changes/i });
    await userEvent.click(saveBtn);

    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText(/Listing updated successfully/i)).toBeInTheDocument();
  },
};

/**
 * Shows the state when the ID is invalid or the API returns 404.
 */
export const NotFound: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/produce/${MOCK_ID}`, () => {
          return new HttpResponse(null, { status: 404 });
        }),
      ],
    },
  },
};

/**
 * Tests the "Danger Zone" toggle (Pause/Resume).
 */
export const ToggleStatus: Story = {
  parameters: {
    msw: {
      handlers: [
        ...Default.parameters!.msw.handlers,
        http.put(`*/api/produce/${MOCK_ID}`, () => {
          return HttpResponse.json({ status: 200 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pauseBtn = await canvas.findByRole('button', { name: /Pause Listing/i });
    await userEvent.click(pauseBtn);

    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText(/Pausing listing.../i)).toBeInTheDocument();
    await expect(await body.findByText(/Listing paused successfully/i)).toBeInTheDocument();
  },
};
