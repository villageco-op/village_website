import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { StatBlock } from './StatBlock';

const meta: Meta<typeof StatBlock> = {
  title: 'Components/StatBlock',
  component: StatBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'sun', 'click-green', 'clay'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatBlock>;

export const Default: Story = {
  args: {
    variant: 'default',
    value: '14k+',
    description: 'Active producers growing fresh food for their local communities weekly.',
  },
};

export const SunVariant: Story = {
  args: {
    variant: 'sun',
    value: '92%',
    description: 'Reduction in food miles compared to traditional grocery supply chains.',
  },
};

export const ClickGreenVariant: Story = {
  args: {
    variant: 'click-green',
    value: '$2.4M',
    description: 'Total revenue distributed directly to small-scale urban farmers this year.',
  },
};

/**
 * A grid layout showing how these look when grouped together in a section.
 */
export const StatGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      <StatBlock
        variant="default"
        value="500+"
        description="Community gardens integrated into the local hub network."
      />
      <StatBlock
        variant="clay"
        value="120"
        description="Logistics partners ensuring zero-waste delivery routes."
      />
    </div>
  ),
};
