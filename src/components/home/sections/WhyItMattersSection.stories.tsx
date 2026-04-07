import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import WhyItMattersSection from './WhyItMattersSection';

const meta: Meta<typeof WhyItMattersSection> = {
  title: 'Sections/WhyItMattersSection',
  component: WhyItMattersSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof WhyItMattersSection>;

/**
 * The default light-themed section.
 * Features the multi-colored StatBlock column which highlights
 * specific data points for the Gary pilot program.
 */
export const Default: Story = {};

/**
 * Mobile view testing the vertical rhythm of the stats when
 * they collapse into a single column.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
};

/**
 * A preview showing how the section looks when placed immediately
 * after another section to test vertical spacing (py-25).
 */
export const StackedContext: Story = {
  render: () => (
    <div>
      <div className="h-20 bg-deep-forest flex items-center justify-center text-cream/20 italic">
        Previous Section
      </div>
      <WhyItMattersSection />
    </div>
  ),
};
