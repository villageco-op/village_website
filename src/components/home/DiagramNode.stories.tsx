import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DiagramNode } from './DiagramNode';

const meta: Meta<typeof DiagramNode> = {
  title: 'Components/DiagramNode',
  component: DiagramNode,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'radio',
      options: ['left', 'right', 'center'],
      description: 'Determines the direction of the flex layout and text alignment.',
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DiagramNode>;

/**
 * The standard left-aligned node used in most diagram layouts.
 */
export const Default: Story = {
  args: {
    align: 'left',
    data: {
      icon: '🌱',
      title: 'Organic Producer',
      role: 'Primary Supplier',
      bgClass: 'bg-lime-pale',
    },
  },
};

/**
 * A right-aligned variant, typically used on the opposite side of a central diagram spine.
 * Notice the icon and text swap positions.
 */
export const RightAligned: Story = {
  args: {
    ...Default.args,
    align: 'right',
    data: {
      icon: '🚛',
      title: 'Logistics Partner',
      role: 'Distribution & Freight',
      bgClass: 'bg-cream',
    },
  },
};

/**
 * Demonstrates a node with a different background color for the icon container.
 */
export const CustomColor: Story = {
  args: {
    align: 'left',
    data: {
      icon: '⚖️',
      title: 'Quality Control',
      role: 'Compliance Officer',
      bgClass: 'bg-orange-100',
    },
  },
};

/**
 * A preview of how multiple nodes look together, useful for checking
 * consistent spacing and shadow depth.
 */
export const NodeList: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <DiagramNode {...args} />
      <DiagramNode
        {...args}
        data={{
          icon: '🏘️',
          title: 'Local Market',
          role: 'Retail Point',
          bgClass: 'bg-blue-100',
        }}
      />
      <DiagramNode
        {...args}
        data={{
          icon: '👨‍🍳',
          title: 'Executive Chef',
          role: 'End User',
          bgClass: 'bg-slate-100',
        }}
      />
    </div>
  ),
  args: {
    ...Default.args,
  },
};
