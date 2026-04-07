import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { HubLogoPulse } from './HubLogoPulse';

const meta: Meta<typeof HubLogoPulse> = {
  title: 'Components/HubLogoPulse',
  component: HubLogoPulse,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    pulseDuration: {
      control: 'text',
      description: 'The duration of the pulse animation (e.g., "2s", "500ms")',
    },
  },
};

export default meta;
type Story = StoryObj<typeof HubLogoPulse>;

/**
 * The standard hub logo with the designer's specific 0-70-100% pulse.
 */
export const Default: Story = {
  args: {
    className: 'w-20 h-20',
    pulseDuration: '3s',
  },
};

/**
 * A faster pulse duration to show the high-energy state.
 */
export const FastPulse: Story = {
  args: {
    className: 'w-20 h-20',
    pulseDuration: '1.5s',
    imgSrc: '/icons/logo.png',
  },
};

/**
 * Demonstrates a larger container and image size.
 */
export const Large: Story = {
  args: {
    className: 'w-32 h-32',
    imgWidth: 60,
    imgHeight: 60,
    pulseDuration: '4s',
  },
};

/**
 * Demonstrates the component using children (e.g., text or an icon)
 * instead of the default Next Image.
 */
export const WithChildren: Story = {
  render: (args) => (
    <HubLogoPulse {...args} className="w-16 h-16">
      <span className="text-white font-bold text-xl">H</span>
    </HubLogoPulse>
  ),
};

/**
 * Placed on a darker background to see how the lime green transparency
 * interacts with different surface colors.
 */
export const DarkBackground: Story = {
  render: (args) => (
    <div className="p-20 bg-slate-900 flex justify-center items-center">
      <HubLogoPulse {...args} className="w-20 h-20" />
    </div>
  ),
};
