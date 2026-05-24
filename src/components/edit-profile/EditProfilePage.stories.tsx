import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import EditProfilePage from './EditProfilePage';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
    mutations: { retry: false },
  },
});

const MOCK_USER_DATA = {
  id: 'usr_789',
  name: 'Alex Rivera',
  email: 'alex@village.com',
  emailVerified: null,
  image: null,
  organization: 'Rivera Backyard Gardens',
  aboutMe: 'Growing micro greens and crisp radishes in raised garden beds.',
  specialties: ['Radishes', 'Microgreens'],
  goal: '250',
  address: '742 Evergreen Terrace',
  city: 'Springfield',
  state: 'IL',
  country: 'United States',
  zip: '62701',
  lat: null,
  lng: null,
  deliveryRangeMiles: '10',
  stripeAccountId: 'acct_123',
  stripeOnboardingComplete: false, // Default context is non-seller/buyer
  createdAt: null,
  updatedAt: null,
};

// Standard CRUD handlers used across the rendering subcomponents
const childComponentHandlers = [
  http.post('*/api/upload/image', () => {
    return HttpResponse.json({ url: 'https://mocked-url.com/avatar.png' }, { status: 200 });
  }),
  http.patch('*/api/users/me', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ data: body, status: 200 });
  }),
  http.post('*/api/users/notifications/register', () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
  http.delete('*/api/users/account', () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];

const meta: Meta<typeof EditProfilePage> = {
  title: 'EditProfile/EditProfilePage',
  component: EditProfilePage,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof EditProfilePage>;

/**
 * Loading state showing the centralized spin layout.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', async () => {
          await delay('infinite');
          return HttpResponse.json(null);
        }),
      ],
    },
  },
};

/**
 * Unauthenticated error fallback state enforcing user route guarding.
 */
export const Unauthenticated: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/auth/session', () => {
          return HttpResponse.json(null);
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fallbackText = await canvas.findByText(/Please log in to edit your profile\./i);
    await expect(fallbackText).toBeInTheDocument();
  },
};

/**
 * Authenticated Standard Buyer context. Toggles off the seller custom forms.
 */
export const AuthenticatedBuyer: Story = {
  parameters: {
    msw: {
      handlers: [
        ...childComponentHandlers,
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: { ...MOCK_USER_DATA, stripeOnboardingComplete: false },
            expires: '9999-12-31T23:59:59.999Z',
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify root layout header and first tab rendering
    await expect(
      await canvas.findByRole('heading', { name: 'Edit Profile', level: 1 }),
    ).toBeInTheDocument();
    await expect(canvas.getByLabelText(/Real Name/i)).toHaveValue('Alex Rivera');

    // Confirm seller details section stays contextually closed
    await expect(canvas.queryByText('Seller Details')).not.toBeInTheDocument();
  },
};

/**
 * Authenticated Active Seller context. Unlocks specialized selling metric settings.
 */
export const AuthenticatedSeller: Story = {
  parameters: {
    msw: {
      handlers: [
        ...childComponentHandlers,
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: { ...MOCK_USER_DATA, stripeOnboardingComplete: true },
            expires: '9999-12-31T23:59:59.999Z',
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify subform injection blocks are active
    await expect(await canvas.findByText('Seller Details')).toBeInTheDocument();
    await expect(canvas.getByLabelText(/Weekly Goal \(\$\)/i)).toHaveValue(250);
  },
};

/**
 * Tab Navigation lifecycle proving view switcher interactions render separate components.
 */
export const TabSwitchingWorkflow: Story = {
  parameters: { ...AuthenticatedSeller.parameters },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for baseline page layer render confirmation
    await canvas.findByRole('heading', { name: 'Edit Profile', level: 1 });

    // Target the account settings layout controller button
    const settingsTabButton = canvas.getByRole('button', { name: /Account Settings/i });
    await userEvent.click(settingsTabButton);

    // Affirm targeted subcomponents refresh on the DOM layout grid
    await expect(canvas.getByText('Push Notifications')).toBeInTheDocument();
    await expect(canvas.getByText('Danger Zone')).toBeInTheDocument();

    // Confirm data-isolated forms on original tabs unmount completely
    await expect(canvas.queryByText('Basic Information')).not.toBeInTheDocument();
  },
};
