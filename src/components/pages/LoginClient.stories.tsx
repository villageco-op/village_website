import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { http, HttpResponse } from 'msw';

import LoginClient from './LoginClient';

const meta: Meta<typeof LoginClient> = {
  title: 'Pages/Login',
  component: LoginClient,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        http.get('/api/auth/csrf', () => {
          return HttpResponse.json({
            csrfToken: 'mocked-csrf-token-123',
          });
        }),
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoginClient>;

/**
 * Default view on Desktop
 */
export const Default: Story = {};

/**
 * Mobile view to test responsiveness of the login card
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Example of how the page looks if the API fails
 * (Useful for testing error boundaries or fallback states)
 */
export const ApiError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/auth/csrf', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
