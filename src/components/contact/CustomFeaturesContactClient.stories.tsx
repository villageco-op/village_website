'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import CustomFeaturesContactClient from './CustomFeaturesContactClient';

import { Toaster } from '@/components/ui/sonner';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof CustomFeaturesContactClient> = {
  title: 'Contact/CustomFeaturesContactPage',
  component: CustomFeaturesContactClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    msw: {
      handlers: [http.get('*/api/auth/session', () => HttpResponse.json({}))],
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
type Story = StoryObj<typeof CustomFeaturesContactClient>;

/**
 * Standard view of the contact page.
 */
export const Default: Story = {};

/**
 * Contact page rendering with pre-populated session data.
 */
export const Authenticated: Story = {
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
};
