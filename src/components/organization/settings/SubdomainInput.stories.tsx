import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { fn } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import { SubdomainInput } from './SubdomainInput';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
  },
});

const handlers = [
  http.get('*/api/organizations/subdomain/check', ({ request }) => {
    const url = new URL(request.url);
    const subdomain = url.searchParams.get('subdomain') || '';

    if (subdomain === 'taken') {
      return HttpResponse.json({
        available: false,
        suggestion: 'taken-1',
      });
    }

    return HttpResponse.json({
      available: true,
    });
  }),
];

const meta: Meta<typeof SubdomainInput> = {
  title: 'Org/SubdomainInput',
  component: SubdomainInput,
  parameters: {
    layout: 'centered',
    msw: { handlers },
  },
  args: {
    onChange: fn(),
    onValidityChange: fn(),
  },
  decorators: [
    (Story) => {
      queryClient.clear();
      return (
        <QueryClientProvider client={queryClient}>
          <div className="w-full min-w-90 max-w-md bg-slate-50 p-6 rounded-xl border border-slate-200">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SubdomainInput>;

/**
 * Minimal character error layout when content length falls below the api criteria.
 */
export const CharacterLengthError: Story = {
  args: {
    value: 'ga',
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Subdomain must be at least 3 characters.')).toBeInTheDocument();
  },
};

/**
 * Successful state rendering when the validation query confirms availability.
 */
export const AvailableSubdomain: Story = {
  args: {
    value: 'fresh-farm',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Subdomain is available!')).toBeInTheDocument();
  },
};

/**
 * Taken domain fallback highlighting alternative automatic suggestions.
 */
export const TakenWithSuggestion: Story = {
  args: {
    value: 'taken',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Taken.')).toBeInTheDocument();
    await expect(
      await canvas.findByRole('button', { name: /“taken-1” is available./i }),
    ).toBeInTheDocument();
  },
};

/**
 * Verification state bypass triggered if the modified string matches original database properties.
 */
export const OriginalValueBypass: Story = {
  args: {
    value: 'original-shop',
    originalValue: 'original-shop',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Bypass validation entirely and evaluate to current domain
    await expect(canvas.getByText('Current Subdomain')).toBeInTheDocument();
  },
};

/**
 * Dynamic input sanitizer testing to block invalid URL symbols and upper case layouts.
 */
export const InputSanitization: Story = {
  args: {
    value: '',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/Custom Subdomain/i);

    // Enter mixed symbols, uppercase letters, and duplicate dashes: 'My__Awesome!!--Pantry'
    await userEvent.click(input);
    await userEvent.paste('My__Awesome!!--Pantry');

    // Confirm regex filters out invalid symbols and normalizes structure
    await expect(args.onChange).toHaveBeenCalledWith(expect.stringMatching('myawesome-pantry'));
  },
};
