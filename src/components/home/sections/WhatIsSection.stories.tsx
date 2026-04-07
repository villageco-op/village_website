import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import WhatIsSection from './WhatIsSection';

const meta: Meta<typeof WhatIsSection> = {
  title: 'Sections/WhatIsSection',
  component: WhatIsSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof WhatIsSection>;

/**
 * The standard "About" section.
 * Showcases the decorative top-right circle and the alignment
 * between the narrative text and the network visualization.
 */
export const Default: Story = {};

/**
 * Mobile view showing the transition where the NetworkGrid
 * stacks underneath the section header.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
};

/**
 * Demonstrates the section as it would appear in a long-scroll
 * landing page, sandwiched between other content.
 */
export const PageContext: Story = {
  render: () => (
    <>
      <div className="h-40 bg-deep-forest flex items-center justify-center text-cream/20">
        Hero / Previous Section
      </div>
      <WhatIsSection />
      <div className="h-40 bg-off-white flex items-center justify-center text-ink-3">
        Next Section
      </div>
    </>
  ),
};
