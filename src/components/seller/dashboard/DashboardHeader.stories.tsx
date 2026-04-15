import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DashboardHeader } from './DashboardHeader';

const meta: Meta<typeof DashboardHeader> = {
  title: 'Seller/Dashboard/DashboardHeader',
  component: DashboardHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto bg-cream/10 p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DashboardHeader>;

/**
 * Standard logged-in state with a specific plot location.
 */
export const Default: Story = {
  args: {
    location: {
      address: 'Plot 12-B, Green Meadows',
      lat: 45.523062,
      lng: -122.676482,
    },
  },
};

/**
 * State when the user has not yet registered or assigned a plot to their dashboard.
 */
export const NoLocation: Story = {
  args: {
    location: undefined,
  },
};

/**
 * Testing the fallback "Seller" name (triggered if user.name is null/undefined in the hook).
 * Note: To test this effectively, you would usually mock the 'useAuth' hook return value.
 */
export const UnnamedUser: Story = {
  args: {
    location: {
      address: 'Community Garden North',
      lat: 45.523062,
      lng: -122.676482,
    },
  },
};

/**
 * Mobile view to ensure the header text and "Week of" subline wrap gracefully.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    location: {
      address: '742 Evergreen Terrace, Springfield Plot',
      lat: 45.523062,
      lng: -122.676482,
    },
  },
};
