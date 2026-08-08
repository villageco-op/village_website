'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import { ContactFormFields } from './ContactFormFields';

import { Toaster } from '@/components/ui/sonner';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof ContactFormFields> = {
  title: 'Contact/ContactFormFields',
  component: ContactFormFields,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            <Story />
            <Toaster />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ContactFormFields>;

/**
 * Standard unauthenticated view.
 * Tests form interaction, loading state, and submission payload handling.
 */
export const DefaultUnauthenticated: Story = {
  args: {
    subjectPrefix: '[GENERAL INQUIRY]',
    buttonText: 'Send Message',
    buttonVariant: 'forest',
    labels: {
      name: 'Full Name',
      email: 'Email Address',
      company: 'Organization (Optional)',
      message: 'Message',
    },
    placeholders: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      company: 'e.g. City Food Bank / Neighborhood Grocer',
      message: 'How can we help you?',
    },
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => HttpResponse.json({})),
        http.post('*/api/contact', async () => {
          await delay(500);
          return HttpResponse.json({ status: 200, data: { success: true } });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

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
    await expect(canvas.getByText(/Submitting.../i)).toBeInTheDocument();

    // Verify toast notification for successful submission
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText(/Inquiry submitted successfully!/i)).toBeInTheDocument();
  },
};

/**
 * Authenticated view.
 * Verifies that the form correctly pulls in user context data into input defaults.
 */
export const AuthenticatedAutofill: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () =>
          HttpResponse.json({
            user: { name: 'Alice Farmer', email: 'alice@village.com' },
            expires: '9999-12-31T23:59:59.999Z',
          }),
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nameInput = await canvas.findByDisplayValue('Alice Farmer');
    const emailInput = await canvas.findByDisplayValue('alice@village.com');

    await expect(nameInput).toBeInTheDocument();
    await expect(emailInput).toBeInTheDocument();
  },
};

/**
 * Error state handling.
 * Verifies that a failed API request properly displays a error toast notification.
 */
export const ErrorSubmission: Story = {
  args: {
    buttonText: 'Send Message',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => HttpResponse.json({})),
        http.post('*/api/contact', async () => {
          await delay(300);
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nameInput = await canvas.findByLabelText(/Contact Name \*/i);
    const emailInput = await canvas.findByLabelText(/Email Address \*/i);
    const messageInput = await canvas.findByLabelText(/How can we help\? \*/i);

    await userEvent.type(nameInput, 'Bob');
    await userEvent.type(emailInput, 'bob@example.com');
    await userEvent.type(messageInput, 'This message will fail.');

    const submitButton = canvas.getByRole('button', { name: /Send Message/i });
    await userEvent.click(submitButton);

    const body = within(canvasElement.ownerDocument.body);
    await expect(
      await body.findByText(/Failed to send inquiry\. Please try again later\./i),
    ).toBeInTheDocument();
  },
};
