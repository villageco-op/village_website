import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import NotificationsStep from './NotificationStep';

const meta: Meta<typeof NotificationsStep> = {
  title: 'Onboarding/NotificationsStep',
  component: NotificationsStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    role: {
      control: 'radio',
      options: ['buyer', 'seller'],
      description: 'Determines the copy text shown to the user.',
    },
  },
  args: {
    onEnable: fn(),
    onSkip: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof NotificationsStep>;

/**
 * The view presented to customers. Focuses on product availability
 * and speed to prevent "sold out" frustration.
 */
export const Buyer: Story = {
  args: {
    role: 'buyer',
  },
};

/**
 * The view presented to producers/farmers. Focuses on utility,
 * order management, and direct communication.
 */
export const Seller: Story = {
  args: {
    role: 'seller',
  },
};

/**
 * Shows how the component looks when nested in a typical mobile-width container,
 * which is common for onboarding flows.
 */
export const MobileConstrained: Story = {
  args: {
    role: 'buyer',
  },
  decorators: [
    (Story) => (
      <div className="w-93.75 border border-stone-200 p-6 rounded-3xl bg-white shadow-xl">
        <Story />
      </div>
    ),
  ],
};

/**
 * A side-by-side comparison of the two role states to verify
 * layout consistency despite varying text lengths.
 */
export const RoleComparison: Story = {
  render: (args) => (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="p-4 border rounded-xl bg-white">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-ink-3 border-b pb-2">
          Buyer Role
        </h4>
        <NotificationsStep {...args} role="buyer" />
      </div>
      <div className="p-4 border rounded-xl bg-white">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-ink-3 border-b pb-2">
          Seller Role
        </h4>
        <NotificationsStep {...args} role="seller" />
      </div>
    </div>
  ),
};
