import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import { Toaster } from '../../ui/sonner';

import AddNewListingClient from './AddNewListingClient';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof AddNewListingClient> = {
  title: 'Seller/NewListing/AddNewListingPage',
  component: AddNewListingClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
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
type Story = StoryObj<typeof AddNewListingClient>;

/**
 * The initial state of the creation page.
 */
export const Default: Story = {};

/**
 * A "Happy Path" story that simulates filling out every field and submitting.
 */
export const FullFormSubmission: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/produce', async () => {
          await delay(100);
          return HttpResponse.json({ status: 201 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const screen = within(canvasElement.ownerDocument.body);

    // 1. Basic Info
    await userEvent.type(canvas.getByLabelText(/Title/i), 'Gala Apples');

    const selectTrigger = canvas.getByLabelText(/Produce Type/i);
    await userEvent.click(selectTrigger);

    const option = (await screen.findAllByText('Stone Fruits'))[1];
    await userEvent.click(option);

    // 2. Pricing & Inventory
    await userEvent.type(canvas.getByLabelText(/Price per lb/i), '3.50');
    await userEvent.type(canvas.getByLabelText(/Total Inventory/i), '100');

    // 3. Harvest Details
    await userEvent.type(canvas.getByLabelText(/Available By/i), '2026-05-01T10:00');
    await userEvent.type(canvas.getByLabelText(/Season Start/i), '2026-05-01');
    await userEvent.type(canvas.getByLabelText(/Season End/i), '2026-09-01');

    // 4. Subscribable toggle (Checkbox)
    const checkbox = canvas.getByLabelText(/Allow customers to set up recurring orders/i);
    await userEvent.click(checkbox);

    // 5. Submit
    const submitBtn = canvas.getByRole('button', { name: /Publish Listing/i });
    await userEvent.click(submitBtn);

    // Verify loading state appears
    await expect(submitBtn).toBeDisabled();

    // Check for success toast (in body)
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText(/Listing created successfully/i)).toBeInTheDocument();
  },
};

/**
 * Demonstrates the error handling when the server fails to create the listing.
 */
export const SubmissionError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/produce', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill minimum required fields
    await userEvent.type(canvas.getByLabelText(/Title/i), 'Failing Listing');
    await userEvent.type(canvas.getByLabelText(/Price per lb/i), '3.50');
    await userEvent.type(canvas.getByLabelText(/Total Inventory/i), '100');
    await userEvent.type(canvas.getByLabelText(/Season Start/i), '2026-01-01');
    await userEvent.type(canvas.getByLabelText(/Season End/i), '2026-12-31');

    await userEvent.click(canvas.getByRole('button', { name: /Publish Listing/i }));

    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText(/Could not create listing/i)).toBeInTheDocument();
  },
};

/**
 * Shows the state of the form while submitting (buttons disabled, loader visible).
 */
export const SubmittingState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/produce', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(/Title/i), 'Infinite Loading Test');
    await userEvent.type(canvas.getByLabelText(/Season Start/i), '2026-01-01');
    await userEvent.type(canvas.getByLabelText(/Season End/i), '2026-12-31');
    await userEvent.click(canvas.getByRole('button', { name: /Publish Listing/i }));
  },
};
