import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import { AnalyticsSidebar } from './AnalyticsSidebar';

import type { ProduceType } from '@/lib/api/generated/models';

/**
 * The AnalyticsSidebar provides a visual summary of the user's supply chain impact,
 * including economic injection, food miles saved, and produce distribution.
 */
const meta: Meta<typeof AnalyticsSidebar> = {
  title: 'Buyer/SourceMap/AnalyticsSidebar',
  component: AnalyticsSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative h-200 w-full bg-slate-200 p-8">
        <Story />
      </div>
    ),
  ],
  args: {
    setProduceType: fn(),
    setSeason: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AnalyticsSidebar>;

const mockAnalytics = {
  totalSpend: 1250.5,
  totalVolumeOz: 4500,
  uniqueGrowers: 12,
  foodMilesSaved: 3420,
  produceBreakdown: [
    { produceType: 'nightshades' as ProduceType, volumeOz: 1200, percentage: 45 },
    { produceType: 'leafy_greens' as ProduceType, volumeOz: 800, percentage: 30 },
    { produceType: 'root_vegetables' as ProduceType, volumeOz: 400, percentage: 15 },
    { produceType: 'raw_honey' as ProduceType, volumeOz: 200, percentage: 10 },
  ],
};

const mockUser = {
  id: 'user-1',
  name: 'Jane Doe',
  city: 'Madison',
  email: 'jane@example.com',
  specialties: {},
} as any;

export const Default: Story = {
  args: {
    produceType: undefined,
    season: 'all',
    analyticsLoading: false,
    nodesLoading: false,
    analytics: mockAnalytics,
    user: mockUser,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    analyticsLoading: true,
    nodesLoading: true,
  },
};

/**
 * State when the user has no city set in their profile,
 * falling back to "local" in the economic impact description.
 */
export const NoUserCity: Story = {
  args: {
    ...Default.args,
    user: { ...mockUser, city: null },
  },
};

/**
 * State when filters return no specific breakdown data.
 */
export const NoBreakdownData: Story = {
  args: {
    ...Default.args,
    analytics: {
      ...mockAnalytics,
      produceBreakdown: [],
    },
  },
};

/**
 * Error state when the analytics API fails to return data.
 */
export const ErrorState: Story = {
  args: {
    ...Default.args,
    analytics: undefined as any,
  },
};

/**
 * Mobile view simulation (the component uses md: breakpoints for positioning).
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    ...Default.args,
  },
};
