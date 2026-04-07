import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PlatformDiagram } from './PlatformDiagram';

const meta: Meta<typeof PlatformDiagram> = {
  title: 'Components/PlatformDiagram',
  component: PlatformDiagram,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for the section.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlatformDiagram>;

/**
 * The standard desktop view.
 * Note the dashed SVG lines flowing toward/away from the Hub.
 * These animations are powered by the internal `<style>` block.
 */
export const Desktop: Story = {
  args: {
    className: '',
  },
};

/**
 * A preview of how the diagram collapses into a vertical timeline for mobile devices.
 * In this view, the SVG paths are hidden and replaced by a central vertical dashed line.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
};

/**
 * Shows the component inside a constrained container to test
 * the 'overflow-hidden' and responsive behavior.
 */
export const InContainer: Story = {
  render: (args) => (
    <div className="max-w-5xl mx-auto border-x border-dashed border-slate-200">
      <PlatformDiagram {...args} />
    </div>
  ),
};

/**
 * A "Dark Mode" contextual story. Since the component has a 'bg-cream'
 * background, this shows how it contrasts against a dark site-wide background.
 */
export const DarkContext: Story = {
  args: {
    className: 'bg-stone-900', // Overriding the default cream for demo purposes
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};
