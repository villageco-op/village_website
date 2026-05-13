import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ProduceListingSkeleton from './ProduceListingSkeleton';

const meta: Meta<typeof ProduceListingSkeleton> = {
  title: 'Buyer/ProduceDetails/ProduceListingSkeleton',
  component: ProduceListingSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ProduceListingSkeleton>;

export const Default: Story = {};
