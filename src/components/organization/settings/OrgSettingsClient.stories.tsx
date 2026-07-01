import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import OrgTab from './OrgSettingsClient';

import type { User, Organization } from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
    mutations: { retry: false },
  },
});

const MOCK_USER_WITH_ORG: User = {
  id: 'user_123',
  name: 'Alex Smith',
  email: 'alex@example.com',
  emailVerified: null,
  image: null,
  organizationId: 'org_abc123',
  orgRole: 'admin',
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
  stripeOnboardingComplete: null,
  isOnboardingComplete: false,
  createdAt: null,
  updatedAt: null,
};

const MOCK_USER_WITHOUT_ORG: User = {
  ...MOCK_USER_WITH_ORG,
  organizationId: null,
  orgRole: null,
};

const MOCK_ORGANIZATION: Organization = {
  id: 'org_abc123',
  type: 'pantry',
  name: 'Gary Food Pantry Network',
  subdomain: 'gary-pantry',
  email: 'contact@garypantry.org',
  website: 'https://garypantry.org',
  phone: '219-555-0199',
  image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150',
  address: '401 Broadway',
  city: 'Gary',
  state: 'IN',
  country: 'United States',
  zip: '46402',
  lat: 41.5934,
  lng: -87.3464,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const handlers = [
  // Mock Get Organization endpoint
  http.get('*/api/organizations/org_abc123', () => {
    return HttpResponse.json({ ...MOCK_ORGANIZATION });
  }),
  // Mock Update Organization endpoint
  http.put('*/api/organizations/org_abc123', async ({ request }) => {
    const body = (await request.json()) as Organization;
    return HttpResponse.json({ ...MOCK_ORGANIZATION, ...body });
  }),
  // Mock Delete Organization endpoint
  http.delete('*/api/organizations/org_abc123', () => {
    return HttpResponse.json({ success: true });
  }),
  // Mock Upload Image endpoint
  http.post('*/api/upload', () => {
    return HttpResponse.json({ url: 'https://mocked-url.com/org-avatar.png' });
  }),
  // Mock Geocode Location endpoint
  http.post('*/api/location/geocode', () => {
    return HttpResponse.json({ lat: 41.5934, lng: -87.3464 });
  }),
];

const meta: Meta<typeof OrgTab> = {
  title: 'EditProfile/OrgTab',
  component: OrgTab,
  parameters: {
    layout: 'centered',
    msw: { handlers },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <div className="w-full max-w-2xl bg-white border border-slate-100 p-6 rounded-xl shadow-sm">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof OrgTab>;

/**
 * Default view demonstrating a fully populated, successfully loaded organization record.
 */
export const DefaultConfigured: Story = {
  args: {
    user: MOCK_USER_WITH_ORG,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify loading transitions cleanly and matches mock records
    await expect(await canvas.findByLabelText(/Organization Name/i)).toHaveValue(
      'Gary Food Pantry Network',
    );
    await expect(canvas.getByLabelText(/Contact Email/i)).toHaveValue('contact@garypantry.org');
    await expect(canvas.getByLabelText(/Website/i)).toHaveValue('https://garypantry.org');
    await expect(canvas.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  },
};

/**
 * Fallback visual state when the user payload contains no organization contextual relationship.
 */
export const NoOrganizationAssociated: Story = {
  args: {
    user: MOCK_USER_WITHOUT_ORG,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('No Organization Associated')).toBeInTheDocument();
    await expect(canvas.queryByLabelText(/Organization Name/i)).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: /Save Changes/i })).not.toBeInTheDocument();
  },
};

/**
 * Evaluates the updating mutation lifecycle and user feedback notifications upon processing updates.
 */
export const FormSubmissionSuccess: Story = {
  args: {
    user: MOCK_USER_WITH_ORG,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const saveButton = await canvas.findByRole('button', { name: /Save Changes/i });
    await userEvent.click(saveButton);

    // Instant switch to pending asynchronous operation state
    await expect(await canvas.findByText(/Saving Changes.../i)).toBeInTheDocument();
  },
};

/**
 * Simulates triggering the absolute delete flow sequence inside the safety verification sub-dialog context.
 */
export const DangerZoneDeletionFlow: Story = {
  args: {
    user: MOCK_USER_WITH_ORG,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Await core component initialization
    await canvas.findByLabelText(/Organization Name/i);

    const deleteButton = canvas.getByRole('button', { name: /Delete Organization/i });
    await userEvent.click(deleteButton);

    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByText('Danger Zone')).toBeInTheDocument();
  },
};
