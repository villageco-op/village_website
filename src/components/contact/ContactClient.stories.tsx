'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import ContactClient from './ContactClient';

import { Toaster } from '@/components/ui/sonner';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof ContactClient> = {
  title: 'Contact/ContactPage',
  component: ContactClient,
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
          <div className="min-h-screen bg-slate-50">
            <Story />
            <Toaster />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ContactClient>;

/**
 * Standard unauthenticated view.
 * Tests the entire form submission flow from typing to the success screen.
 */
export const DefaultUnauthenticated: Story = {
  parameters: {
    msw: {
      handlers: [
        // Mock unauthenticated session
        http.get('*/api/auth/session', () => HttpResponse.json({})),
        // Mock successful form submission
        http.post('*/api/contact', async () => {
          await delay(500); // Simulate network latency
          return HttpResponse.json({ status: 200, data: { success: true } });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the form to be ready
    const nameInput = await canvas.findByLabelText(/Full Name \*/i);
    const emailInput = await canvas.findByLabelText(/Email Address \*/i);
    const messageInput = await canvas.findByLabelText(/Message \*/i);

    // Verify fields start empty
    await expect(nameInput).toHaveValue('');
    await expect(emailInput).toHaveValue('');

    // Fill out the form
    await userEvent.type(nameInput, 'Jane Doe');
    await userEvent.type(emailInput, 'jane@example.com');
    await userEvent.type(messageInput, 'Hello, I have a question about the marketplace.');

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /Send Message/i });
    await userEvent.click(submitButton);

    // Verify loading state appears
    await expect(canvas.getByText(/Sending.../i)).toBeInTheDocument();

    // Verify success screen replaces the form
    await expect(await canvas.findByText(/Message Sent!/i)).toBeInTheDocument();
    await expect(canvas.getByText(/jane@example.com/i)).toBeInTheDocument();

    // Verify we can reset the form
    const resetButton = canvas.getByRole('button', { name: /Send another message/i });
    await userEvent.click(resetButton);

    // Form should reappear with name/email kept, but message cleared
    await expect(await canvas.findByLabelText(/Message \*/i)).toHaveValue('');
    await expect(canvas.getByLabelText(/Full Name \*/i)).toHaveValue('Jane Doe');
  },
};

/**
 * Authenticated view.
 * Verifies that the form correctly pulls in the user's name and email.
 */
export const AuthenticatedAutofill: Story = {
  parameters: {
    msw: {
      handlers: [
        // Mock authenticated session
        http.get('*/api/auth/session', () =>
          HttpResponse.json({
            user: { name: 'Alice Farmer', organization: 'Green Farms', email: 'alice@village.com' },
            expires: '9999-12-31T23:59:59.999Z',
          }),
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the hook to finish loading and populate the inputs
    const nameInput = await canvas.findByDisplayValue('Alice Farmer');
    const emailInput = await canvas.findByDisplayValue('alice@village.com');
    const orgInput = await canvas.findByDisplayValue('Green Farms');

    await expect(nameInput).toBeInTheDocument();
    await expect(emailInput).toBeInTheDocument();
    await expect(orgInput).toBeInTheDocument();
  },
};

/**
 * Error state handling.
 * Verifies that a failed API request properly displays a toast error.
 */
export const ErrorSubmission: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => HttpResponse.json({})),
        // Mock failed form submission
        http.post('*/api/contact', async () => {
          await delay(300);
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nameInput = await canvas.findByLabelText(/Full Name \*/i);
    const emailInput = await canvas.findByLabelText(/Email Address \*/i);
    const messageInput = await canvas.findByLabelText(/Message \*/i);

    // Fill minimum requirements
    await userEvent.type(nameInput, 'Bob');
    await userEvent.type(emailInput, 'bob@example.com');
    await userEvent.type(messageInput, 'This message will fail.');

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /Send Message/i });
    await userEvent.click(submitButton);

    // The toaster is rendered in the decorator, so we look for the error text in the body
    const body = within(canvasElement.ownerDocument.body);
    await expect(
      await body.findByText(/Failed to send message\. Please try again later\./i),
    ).toBeInTheDocument();
  },
};
