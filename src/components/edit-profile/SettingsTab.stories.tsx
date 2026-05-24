import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import SettingsTab from './SettingsTab';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

// Polyfill explicit browser environment globals missing inside clean environments
if (typeof window !== 'undefined' && !window.Notification) {
  window.Notification = {
    requestPermission: () => 'granted',
    permission: 'default',
  } as unknown as typeof Notification;
}

const handlers = [
  // Mock Firebase Messaging device token sync channel
  http.post('*/api/users/notifications/register', () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
  // Mock account lifecycle clean destruction api route
  http.delete('*/api/users/account', () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];

const meta: Meta<typeof SettingsTab> = {
  title: 'EditProfile/SettingsTab',
  component: SettingsTab,
  parameters: {
    layout: 'centered',
    msw: { handlers },
  },
  args: {
    onLogout: fn(),
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <div className="w-full max-w-2xl bg-slate-50 p-6 rounded-xl">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SettingsTab>;

/**
 * Standard configurations screen with active safe integrations panel and system logout utilities.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Main layout checkpoints
    await expect(canvas.getByText('Push Notifications')).toBeInTheDocument();
    await expect(canvas.getByText('Danger Zone')).toBeInTheDocument();
  },
};

/**
 * Validation tracking defensive safety confirmation popups before destructive API mutations occur.
 */
export const DeleteAccountWorkflow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Locate action trigger string inside red zone container card
    const deleteTriggerBtn = canvas.getByRole('button', { name: /Delete Account/i });
    await userEvent.click(deleteTriggerBtn);

    // Check if external package modal components render warning headers on the document base body
    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByRole('dialog')).toBeInTheDocument();
  },
};
