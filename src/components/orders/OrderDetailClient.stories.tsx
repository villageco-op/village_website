import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import OrderDetailClient from './OrderDetailClient';

import { Toaster } from '@/components/ui/sonner';
import { OrderBuyerReport, OrderStatusProperty } from '@/lib/api/generated/models';
import { createMockOrderDetail } from '@/lib/storybook/utils/mockGenerators';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_ORDER_ID = 'order_abc123';
const MOCK_ORDER_DATA = createMockOrderDetail({ id: MOCK_ORDER_ID });

const nowMS = Date.now();

const meta: Meta<typeof OrderDetailClient> = {
  title: 'Orders/OrderDetails/OrderDetailPage',
  component: OrderDetailClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    order: MOCK_ORDER_DATA,
    isSeller: false,
    nowMs: nowMS,
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <Toaster />
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof OrderDetailClient>;

/**
 * Successful loading state with pending order (actions visible)
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/orders/${MOCK_ORDER_ID}`, () => {
          return HttpResponse.json(MOCK_ORDER_DATA);
        }),
      ],
    },
  },
};

/**
 * Demonstrates the Skeleton loading state
 */
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

/**
 * Error state (Order Not Found)
 */
export const NotFound: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/orders/${MOCK_ORDER_ID}`, () => {
          return HttpResponse.json(null, { status: 404 });
        }),
      ],
    },
  },
};

/**
 * Completed order state displaying "Order Again" and "Leave Review" actions.
 */
export const CompletedOrder: Story = {
  args: {
    order: createMockOrderDetail({
      id: MOCK_ORDER_ID,
      status: OrderStatusProperty.completed,
    }),
    isSeller: false,
  },
};

/**
 * Completed order state where the buyer has already submitted a review.
 */
export const CompletedOrderWithReview: Story = {
  args: {
    order: createMockOrderDetail({
      id: MOCK_ORDER_ID,
      status: OrderStatusProperty.completed,
      review: {
        id: 'rev_123',
        rating: 5,
        comment: 'Fantastic experience, will definitely order again!',
        createdAt: '2026-05-15T16:00:00Z',
      },
    }),
    isSeller: false,
  },
};

/**
 * Status Report & Actions: Paid order within 24 hours of scheduled time (Buyer view).
 * Shows "Report Received" and "Report Not Received" buttons, and card showing "Pending confirmation".
 */
export const StatusReportWithin24HoursBuyer: Story = {
  args: {
    order: createMockOrderDetail({
      id: MOCK_ORDER_ID,
      status: 'paid',
      scheduledTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    }),
    isSeller: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByRole('button', { name: /Report Received/i })).toBeEnabled();
    await expect(await canvas.findByRole('button', { name: /Report Not Received/i })).toBeEnabled();
  },
};

/**
 * Status Report & Actions: Paid order within 48 hours (Seller view).
 * Shows "Report Fulfilled" button for seller.
 */
export const StatusReportWithin48HoursSeller: Story = {
  args: {
    order: createMockOrderDetail({
      id: MOCK_ORDER_ID,
      status: 'paid',
      scheduledTime: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // 30 hours ago
    }),
    isSeller: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByRole('button', { name: /Report Fulfilled/i })).toBeEnabled();
  },
};

/**
 * Status Report & Dispute: Paid order where the other user reported status and within 48 hours.
 * Shows "Dispute Order" button and displays the report details on the card.
 */
export const DisputeActionAvailable: Story = {
  args: {
    order: createMockOrderDetail({
      id: MOCK_ORDER_ID,
      status: 'paid',
      scheduledTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      buyerReport: OrderBuyerReport.received,
      buyerReportedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    }),
    isSeller: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByRole('button', { name: /Dispute/i })).toBeEnabled();
  },
};

/**
 * Tests the full leave review flow on a completed order.
 */
export const LeaveReviewFlow: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/reviews', async () => {
          await delay(600);
          return HttpResponse.json({ id: 'review_123' }, { status: 201 });
        }),
      ],
    },
  },
  args: {
    order: createMockOrderDetail({
      id: MOCK_ORDER_ID,
      status: OrderStatusProperty.completed,
    }),
    isSeller: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const reviewBtn = await canvas.findByRole('button', { name: /Review/i });
    await userEvent.click(reviewBtn);

    const body = within(canvasElement.ownerDocument.body);

    const starBtn = await body.findByRole('button', { name: /Rate 5 stars/i });
    await userEvent.click(starBtn);

    const textarea = body.getByPlaceholderText(/Tell others about the quality/i);
    await userEvent.type(textarea, 'Amazing quality microgreens! Super quick pickup.');

    const submitBtn = body.getByRole('button', { name: /Submit/i });
    await userEvent.click(submitBtn);

    await expect(
      await body.findByText(/Review submitted successfully/i, {}, { timeout: 5000 }),
    ).toBeInTheDocument();
  },
};

/**
 * Tests the full cancellation flow
 */
export const CancelFlow: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/orders/${MOCK_ORDER_ID}`, () => {
          return HttpResponse.json(MOCK_ORDER_DATA);
        }),
        http.put(`*/api/orders/${MOCK_ORDER_ID}/cancel`, async () => {
          await delay(800);
          return HttpResponse.json(null, { status: 200 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const cancelBtn = await canvas.findByRole('button', { name: /Cancel Order/i });
    await userEvent.click(cancelBtn);

    const body = within(canvasElement.ownerDocument.body);
    const textarea = body.getByPlaceholderText(/E.g., Out of stock/i);
    await userEvent.type(textarea, 'I accidentally ordered too many carrots.');

    const confirmBtn = body.getByRole('button', { name: /Confirm Cancellation/i });
    await userEvent.click(confirmBtn);

    await expect(
      await body.findByText(/Order has been canceled/i, {}, { timeout: 5000 }),
    ).toBeInTheDocument();
  },
};

/**
 * Tests the rescheduling flow
 */
export const RescheduleFlow: Story = {
  parameters: {
    msw: {
      handlers: [
        ...Default.parameters!.msw.handlers,
        http.put(`*/api/orders/${MOCK_ORDER_ID}/schedule`, async () => {
          await delay(800);
          return HttpResponse.json(null, { status: 200 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rescheduleBtn = await canvas.findByRole('button', { name: /Reschedule/i });
    await userEvent.click(rescheduleBtn);

    const body = within(canvasElement.ownerDocument.body);

    const dateInput = await body.findByLabelText(/New Date & Time/i);

    if (!(dateInput as HTMLInputElement).value) {
      await userEvent.type(dateInput, '2026-05-20T10:00');
    }

    const confirmBtn = await body.findByRole('button', { name: /Propose New Time/i });

    await expect(confirmBtn).toBeEnabled();
    await userEvent.click(confirmBtn);

    await expect(
      await body.findByText(/Reschedule request sent successfully/i, {}, { timeout: 5000 }),
    ).toBeInTheDocument();
  },
};
