import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import { NotificationControls } from './NotificationControls';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
    mutations: { retry: false },
  },
});

const meta: Meta<typeof NotificationControls> = {
  title: 'EditProfile/NotificationControls',
  component: NotificationControls,
  decorators: [
    (Story) => {
      queryClient.clear();
      return (
        <QueryClientProvider client={queryClient}>
          <div className="max-w-2xl m-8">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof NotificationControls>;

const setNotificationPermission = (permission: NotificationPermission) => {
  Object.defineProperty(window, 'Notification', {
    writable: true,
    configurable: true,
    value: {
      permission,
      requestPermission: () => permission,
    },
  });
};

export const DisabledState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/users/fcm-status', () => {
          return HttpResponse.json({ status: false }, { status: 200 });
        }),
      ],
    },
  },
  beforeEach: () => {
    setNotificationPermission('default');
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const actionButton = await canvas.findByText('Enable');
    await expect(actionButton).toBeInTheDocument();
  },
};

export const EnabledState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/users/fcm-status', () => {
          return HttpResponse.json({ status: true }, { status: 200 });
        }),
      ],
    },
  },
  beforeEach: () => {
    setNotificationPermission('granted');
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const actionButton = await canvas.findByText('Disable');
    await expect(actionButton).toBeInTheDocument();
  },
};

export const ToggleToEnableWorkflow: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/users/fcm-status', () => {
          return HttpResponse.json({ status: false }, { status: 200 });
        }),
        http.post('*/api/users/fcm-token', () => {
          return HttpResponse.json({ success: true }, { status: 200 });
        }),
      ],
    },
  },
  beforeEach: () => {
    // Force a mock permission prompt that yields 'granted' on interaction
    Object.defineProperty(window, 'Notification', {
      writable: true,
      configurable: true,
      value: {
        permission: 'default',
        requestPermission: () => 'granted',
      },
    });
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const actionButton = await canvas.findByRole('button', { name: /Enable/i });

    await userEvent.click(actionButton);
  },
};

export const ToggleToDisableWorkflow: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/users/fcm-status', () => {
          return HttpResponse.json({ status: true }, { status: 200 });
        }),
        http.delete('*/api/users/fcm-token', () => {
          return HttpResponse.json({ success: true }, { status: 200 });
        }),
      ],
    },
  },
  beforeEach: () => {
    setNotificationPermission('granted');
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const actionButton = await canvas.findByRole('button', { name: /Disable/i });

    await userEvent.click(actionButton);
  },
};
