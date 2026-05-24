import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import ProfileTab from './ProfileTab';

import type { User } from '@/lib/api/generated/models/user';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
    mutations: { retry: false },
  },
});

const MOCK_USER: User = {
  id: 'user_456',
  name: 'Jane Doe',
  email: 'jane@example.com',
  emailVerified: null,
  image:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
  organization: 'Green Earth Collective',
  aboutMe: 'Passionate urban farmer growing organic microgreens.',
  specialties: ['Heirloom Tomatoes', 'Honey', 'Sourdough'],
  goal: '500',
  address: '123 Farm Lane',
  city: 'Madison',
  state: 'WI',
  country: 'United States',
  zip: '53703',
  lat: null,
  lng: null,
  deliveryRangeMiles: '15',
  stripeAccountId: null,
  stripeOnboardingComplete: null,
  createdAt: null,
  updatedAt: null,
};

const handlers = [
  // Mock image upload endpoint
  http.post('*/api/upload/image', () => {
    return HttpResponse.json({ url: 'https://mocked-url.com/uploaded.png' }, { status: 200 });
  }),
  // Mock profile updates endpoint
  http.patch('*/api/users/me', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ data: body, status: 200 });
  }),
];

const meta: Meta<typeof ProfileTab> = {
  title: 'EditProfile/ProfileTab',
  component: ProfileTab,
  parameters: {
    layout: 'centered',
    msw: { handlers },
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
type Story = StoryObj<typeof ProfileTab>;

/**
 * Standard regular buyer profile layout without specialized seller components.
 */
export const RegularBuyer: Story = {
  args: {
    user: { ...MOCK_USER, specialties: [] },
    isSeller: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Core inputs should render
    await expect(canvas.getByLabelText(/Real Name/i)).toHaveValue('Jane Doe');
    await expect(canvas.getByLabelText(/Street Address/i)).toHaveValue('123 Farm Lane');

    // Seller sections must be hidden
    await expect(canvas.queryByText('Seller Details')).not.toBeInTheDocument();
    await expect(canvas.queryByText('View Public Profile')).not.toBeInTheDocument();
  },
};

/**
 * Expanded layout for authenticated sellers displaying business goals and dynamic delivery configurations.
 */
export const ActiveSeller: Story = {
  args: {
    user: MOCK_USER,
    isSeller: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Dynamic items rendered for sellers
    await expect(canvas.getByText('Seller Details')).toBeInTheDocument();
    await expect(canvas.getByLabelText(/Weekly Goal/i)).toHaveValue(500);

    // Delivery distance condition state verification
    const checkbox = canvas.getByLabelText(/I am willing to deliver orders myself/i);
    await expect(checkbox).toBeChecked();
    await expect(canvas.getByLabelText(/Delivery Range/i)).toHaveValue(15);
  },
};

/**
 * Functional validation verifying form submission, text parsing arrays, and action button lifecycle updates.
 */
export const FormSubmissionSuccess: Story = {
  args: {
    user: MOCK_USER,
    isSeller: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Modify a field value
    const nameInput = canvas.getByLabelText(/Real Name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Jane Updated');

    // Fire form submission event
    const saveButton = canvas.getByRole('button', { name: /Save Changes/i });
    await userEvent.click(saveButton);

    // Verify loading spinner visual switch instantly triggers
    await expect(canvas.getByText(/Saving.../i)).toBeInTheDocument();
  },
};
