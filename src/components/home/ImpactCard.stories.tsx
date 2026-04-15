import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ImpactCard } from './ImpactCard';

const meta: Meta<typeof ImpactCard> = {
  title: 'Home/Components/ImpactCard',
  component: ImpactCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0a0a0a' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
      description: 'Emoji or SVG element for the card header.',
    },
    text: {
      control: 'text',
      description: 'The description text for the impact metric.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImpactCard>;

/**
 * The standard impact card showing a single metric or feature.
 */
export const Default: Story = {
  args: {
    icon: '🌍',
    text: 'Reducing food miles by sourcing 100% of produce within a 50-mile radius of the hub.',
  },
};

/**
 * Demonstrates how the cards look when organized in a grid,
 * which is the most common use case for this component.
 */
export const GridPreview: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl">
      <ImpactCard
        icon="⚡"
        text="Real-time demand forecasting to eliminate over-production at the source."
      />
      <ImpactCard
        icon="📦"
        text="Plastic-free packaging loop for all dry goods and bulk pantry items."
      />
      <ImpactCard
        icon="🤝"
        text="Guaranteed fair-trade pricing that pays 3x the industry average to farmers."
      />
    </div>
  ),
};

/**
 * Tests the layout with a shorter, more punchy text description.
 */
export const Minimal: Story = {
  args: {
    icon: '📈',
    text: 'Scalable local infrastructure.',
  },
};

/**
 * Demonstrates the hover state effect (translate-y and background shift).
 */
export const HoverEffect: Story = {
  args: {
    ...Default.args,
    className: 'bg-white/10 -translate-y-0.75',
  },
};
