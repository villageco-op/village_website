import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GrowersHeader } from './GrowersHeader';

const meta: Meta<typeof GrowersHeader> = {
  title: 'Buyer/Growers/GrowersHeader',
  component: GrowersHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GrowersHeader>;

export const Default: Story = {
  args: {
    activeCount: 12,
    cityText: 'within 25 miles of Austin, TX',
  },
};

export const SingleGrower: Story = {
  args: {
    activeCount: 1,
    cityText: 'near Seattle, WA',
  },
};

export const NoGrowers: Story = {
  args: {
    activeCount: 0,
    cityText: 'in your local area',
  },
};
