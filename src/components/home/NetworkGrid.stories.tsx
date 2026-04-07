import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { NetworkGrid } from './NetworkGrid';

const meta: Meta<typeof NetworkGrid> = {
  title: 'Components/NetworkGrid',
  component: NetworkGrid,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NetworkGrid>;

/**
 * The standard network grid.
 * Note the 'animate-pulse' on the central hub and the hover
 * transitions on the individual category nodes.
 */
export const Default: Story = {
  render: (args) => (
    <div className="max-w-md">
      <NetworkGrid {...args} />
    </div>
  ),
};

/**
 * Demonstrates the component's shadow and border-light effect
 * when placed on a slightly darker background.
 */
export const OnMutedBackground: Story = {
  render: (args) => (
    <div className="p-20 bg-slate-50">
      <div className="max-w-md mx-auto">
        <NetworkGrid {...args} />
      </div>
    </div>
  ),
};
