import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within, expect, waitFor } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import OrgDetailsStep from './OrgDetailsStep';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const meta: Meta<typeof OrgDetailsStep> = {
  title: 'Onboarding/Organization/OrgDetailsStep',
  component: OrgDetailsStep,
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        http.get('*/api/organizations/subdomain/check', async ({ request }) => {
          const url = new URL(request.url);
          const subdomain = url.searchParams.get('subdomain');

          await delay(200);

          if (subdomain === 'taken') {
            return HttpResponse.json(
              {
                available: false,
                suggestion: 'taken-1',
              },
              { status: 200 },
            );
          }

          return HttpResponse.json(
            {
              available: true,
            },
            { status: 200 },
          );
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={mockedQueryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  tags: ['autodocs'],
  args: {
    onSubmit: fn(),
    onBack: fn(),
    isPending: false,
  },
};

export default meta;
type Story = StoryObj<typeof OrgDetailsStep>;

/**
 * Initial empty state. The "Create Organization" button is disabled
 * until required fields are filled and the subdomain is verified.
 */
export const Default: Story = {};

/**
 * UI state during submission. The button shows a loading spinner
 * and the form action is locked.
 */
export const Loading: Story = {
  args: {
    isPending: true,
  },
};

/**
 * Simulates typing an available subdomain and verifying that the validation
 * passes and enables the submit button.
 */
export const ValidFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText(/Organization Name/i), 'Gary Green Network');
    await userEvent.type(canvas.getByLabelText(/Custom Subdomain/i), 'gary-green');
    await userEvent.type(canvas.getByLabelText(/Street Address/i), '101 Civic Center Plaza');
    await userEvent.type(canvas.getByLabelText(/ZIP Code/i), '46402');

    // Wait for MSW response to resolve and update local hook states
    await waitFor(async () => {
      const successText = await canvas.findByText(/Subdomain is available!/i);
      await expect(successText).toBeInTheDocument();
    });

    const submitBtn = canvas.getByRole('button', { name: /Create Organization/i });
    await expect(submitBtn).toBeEnabled();
  },
};

/**
 * Tests handling of an already taken domain name and utilizing the suggestion bypass click.
 */
export const DomainTakenFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText(/Custom Subdomain/i), 'taken');

    // Verify error UI and suggestion rendering
    await waitFor(async () => {
      const errorText = await canvas.findByText(/Taken\./i);
      await expect(errorText).toBeInTheDocument();
    });

    const suggestionBtn = await canvas.findByRole('button', { name: /Use suggest: “taken-1”/i });
    await userEvent.click(suggestionBtn);

    // Verify it updates and re-validates to a successful state
    await waitFor(async () => {
      const successText = await canvas.findByText(/Subdomain is available!/i);
      await expect(successText).toBeInTheDocument();
    });
  },
};

/**
 * Submits the completed data structure back up to the wrapper lifecycle hooks.
 */
export const FullInteractionTest: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText(/Organization Name/i), 'Village Harvest');
    await userEvent.type(canvas.getByLabelText(/Custom Subdomain/i), 'village-harvest');
    await userEvent.type(canvas.getByLabelText(/Street Address/i), '789 Sprout St');
    await userEvent.type(canvas.getByLabelText(/ZIP Code/i), '46403');

    await waitFor(async () => {
      const successText = await canvas.findByText(/Subdomain is available!/i);
      await expect(successText).toBeInTheDocument();
    });

    const submitBtn = canvas.getByRole('button', { name: /Create Organization/i });
    await userEvent.click(submitBtn);

    await waitFor(async () => {
      await expect(args.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Village Harvest',
          subdomain: 'village-harvest',
          address: '789 Sprout St',
          city: 'Gary',
          state: 'IN',
          zip: '46403',
          country: 'United States',
        }),
      );
    });
  },
};

/**
 * Mobile-responsive canvas wrapper.
 */
export const MobileView: Story = {
  decorators: [
    (Story) => (
      <div className="w-93.75 p-4 bg-slate-50 border rounded-xl overflow-hidden">
        <Story />
      </div>
    ),
  ],
};
