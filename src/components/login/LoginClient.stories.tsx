import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from '@storybook/test';
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
        <Toaster />
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

/**
 * "Check your email" success state triggered after a valid magic link submission.
 */
export const EmailSentState: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/login',
      },
    },
    msw: {
      handlers: [
        // Intercept the magic link POST request and return a success response
        http.post('/api/auth/signin/nodemailer', () => {
          return HttpResponse.json({ url: 'http://localhost:3000/api/auth/verify-request' });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Find the email input and type an address
    const emailInput = canvas.getByLabelText(/Email Address/i);
    await userEvent.type(emailInput, 'farmer@valley.com', { delay: 50 });

    // 2. Find the submit button and click it
    const submitBtn = canvas.getByRole('button', { name: /Email me a login link/i });
    await userEvent.click(submitBtn);

    // 3. Wait for the state to flip to the success view and assert it is visible
    const successHeading = await canvas.findByText('Check your email');
    await expect(successHeading).toBeInTheDocument();
  },
};
