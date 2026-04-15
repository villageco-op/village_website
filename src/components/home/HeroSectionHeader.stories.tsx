import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { HeroSectionHeader } from './HeroSectionHeader';

const meta: Meta<typeof HeroSectionHeader> = {
  title: 'Home/Components/HeroSectionHeader',
  component: HeroSectionHeader,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0a0a0a' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    eyebrow: { control: 'text' },
    description: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof HeroSectionHeader>;

/**
 * The default hero state featuring the lime-green animated ping indicator
 * and high-contrast cream typography.
 */
export const Default: Story = {
  args: {
    eyebrow: 'Next-Gen Solutions',
    title: 'Engineering the digital landscape of tomorrow',
    description:
      'We build robust, scalable architectures designed to handle the most demanding workloads with modern precision.',
  },
};

/**
 * Demonstrates the fluid H1 typography with rich JSX formatting.
 * This is useful for emphasizing specific keywords within a hero.
 */
export const RichTitle: Story = {
  args: {
    eyebrow: 'New Update',
    title: (
      <>
        Ship faster with <span className="text-lime">intelligent</span> automation.
      </>
    ),
    description: 'Automate your CI/CD pipeline and focus on what matters most—writing code.',
  },
};

/**
 * A minimal version of the hero header without an eyebrow,
 * useful for secondary pages or internal sections.
 */
export const Minimal: Story = {
  args: {
    title: 'Documentation & Resources',
    description: 'Everything you need to get started with our framework and API.',
  },
};

/**
 * Shows how the header behaves when only a title is provided.
 * Note the fluid 'clamp' sizing on the typography.
 */
export const TitleOnly: Story = {
  args: {
    title: 'The power of simplicity.',
  },
};

/**
 * Example of a constrained layout to test how the description
 * handles line breaks and the max-width utility.
 */
export const LongDescription: Story = {
  args: {
    eyebrow: 'Deep Dive',
    title: 'Unmatched Performance',
    description:
      'Our infrastructure is globally distributed across 25+ regions, ensuring that your users experience sub-100ms latency no matter where they are located. We leverage edge computing to bring your logic closer to your customers, reducing overhead and increasing throughput significantly.',
  },
};
