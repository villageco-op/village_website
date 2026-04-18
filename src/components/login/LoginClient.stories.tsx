import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { http, HttpResponse } from 'msw';
import { Suspense } from 'react';

import { Toaster } from '../ui/sonner';

import LoginClient from './LoginClient';

const meta: Meta<typeof LoginClient> = {
  title: 'Login/LoginPage',
  component: LoginClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/login',
      },
    },
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
  decorators: [
    (Story) => (
      <>
        <Suspense fallback={<div>Loading...</div>}>
          <Story />
        </Suspense>
        <Toaster></Toaster>
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LoginClient>;

/**
 * Default view on Desktop
 */
export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/login',
      },
    },
  },
};

/**
 * Triggered when a user is redirected back from a provider (like Google)
 * with an error in the URL.
 */
export const AuthErrorFromURL: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/login',
        query: {
          error: 'OAuthSignin',
        },
      },
    },
  },
};

/**
 * Mobile view to test responsiveness of the login card
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    nextjs: {
      navigation: {
        pathname: '/login',
      },
    },
  },
};

/**
 * API failure state - tests the toast trigger in the useEffect
 */
export const ApiError: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/login',
      },
    },
    msw: {
      handlers: [
        http.get('/api/auth/csrf', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
