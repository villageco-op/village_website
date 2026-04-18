import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BillingHeader } from './BillingHeader';

const meta: Meta<typeof BillingHeader> = {
  title: 'Buyer/Billing/BillingHeader',
  component: BillingHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BillingHeader>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
