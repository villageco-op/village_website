import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { EarningsHeader } from './EarningsHeader';

const meta: Meta<typeof EarningsHeader> = {
  title: 'Seller/Earnings/EarningsHeader',
  component: EarningsHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-5xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EarningsHeader>;

/**
 * The default view of the earnings header,
 * displaying the current month and year.
 */
export const Default: Story = {};

/**
 * Mobile view to ensure the typography and spacing
 * remains legible on small screens.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
