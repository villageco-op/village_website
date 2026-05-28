import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import { ReorderForm } from './ReorderForm';

import { Toaster } from '@/components/ui/sonner';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_ORDER_ID = 'order_123';

// Helper for dates in 2026 (per system time)
const IN_SEASON_START = '2026-01-01T00:00:00Z';
const IN_SEASON_END = '2026-12-31T23:59:59Z';
const OUT_OF_SEASON = '2025-01-01T00:00:00Z';
const FUTURE_DATE = '2026-06-01T00:00:00Z';
const PAST_DATE = '2026-01-01T00:00:00Z';

const meta: Meta<typeof ReorderForm> = {
  title: 'Buyer/NewOrder/ReorderForm',
  component: ReorderForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    orderId: MOCK_ORDER_ID,
    onClose: () => console.log('Modal closed'),
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <Toaster />
          <div className="p-4">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ReorderForm>;

const MOCK_ORDER_DATA = {
  id: MOCK_ORDER_ID,
  items: [
    {
      id: 'item_1',
      productId: 'prod_apple',
      productName: 'Honeycrisp Apples',
      quantityOz: '32',
      maxOrderQuantityOz: '64',
      isProduceSubscribable: true,
      produceStatus: 'active',
      produceTotalOzInventory: '100',
      produceAvailableBy: PAST_DATE,
      produceSeasonStart: IN_SEASON_START,
      produceSeasonEnd: IN_SEASON_END,
      pricePerOz: '0.30',
    },
    {
      id: 'item_2',
      productId: 'prod_kale',
      productName: 'Organic Kale',
      quantityOz: '16',
      maxOrderQuantityOz: null,
      isProduceSubscribable: true,
      produceStatus: 'active',
      produceTotalOzInventory: '32',
      produceAvailableBy: PAST_DATE,
      produceSeasonStart: IN_SEASON_START,
      produceSeasonEnd: IN_SEASON_END,
      pricePerOz: '0.65',
    },
  ],
};

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/orders/${MOCK_ORDER_ID}`, () => HttpResponse.json(MOCK_ORDER_DATA)),
      ],
    },
  },
};

/**
 * Verifies that items out of season or inactive are disabled.
 */
export const MixedAvailability: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/orders/${MOCK_ORDER_ID}`, () =>
          HttpResponse.json({
            id: MOCK_ORDER_ID,
            items: [
              {
                ...MOCK_ORDER_DATA.items[0],
                productName: 'Out of Season Berries',
                produceSeasonStart: OUT_OF_SEASON,
                produceSeasonEnd: OUT_OF_SEASON,
              },
              {
                ...MOCK_ORDER_DATA.items[1],
                productName: 'Inactive Spinach',
                produceStatus: 'archived',
              },
              {
                ...MOCK_ORDER_DATA.items[0],
                id: 'item_3',
                productId: 'prod_future',
                productName: 'Future Garlic',
                produceAvailableBy: FUTURE_DATE,
              },
            ],
          }),
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText(/Out of Season/i);
    const checkboxes = canvas.getAllByRole('checkbox');
    // First two should be disabled
    await expect(checkboxes[0]).toBeDisabled();
    await expect(checkboxes[1]).toBeDisabled();
    // Future item is orderable but should show the date badge
    await expect(checkboxes[2]).not.toBeDisabled();
    await canvas.findByText(`Available ${new Date(FUTURE_DATE).toLocaleDateString()}`);
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/orders/${MOCK_ORDER_ID}`, async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

export const LoadError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/orders/${MOCK_ORDER_ID}`, () => new HttpResponse(null, { status: 500 })),
      ],
    },
  },
};

export const PartialReorderSuccess: Story = {
  parameters: {
    msw: {
      handlers: [
        ...Default.parameters!.msw.handlers,
        http.post('*/api/cart/add', async () => {
          await delay(400);
          return HttpResponse.json({ success: true });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Honeycrisp Apples');

    const checkboxes = canvas.getAllByRole('checkbox');
    // Deselect one
    await userEvent.click(checkboxes[1]);

    const submitBtn = canvas.getByRole('button', { name: /Add 1 items to Cart/i });
    await userEvent.click(submitBtn);

    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText(/Items added to cart!/i)).toBeInTheDocument();
  },
};

export const NoItemsSelected: Story = {
  parameters: {
    msw: {
      handlers: [...Default.parameters!.msw.handlers],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Honeycrisp Apples');

    const checkboxes = await canvas.findAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);
    await userEvent.click(checkboxes[1]);

    const submitBtn = canvas.getByRole('button', { name: /Add 0 items to Cart/i });
    await expect(submitBtn).toBeDisabled();
  },
};
