import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SectionHeader } from "./section-header";

const meta: Meta<typeof SectionHeader> = {
  title: "Components/SectionHeader",
  component: SectionHeader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "radio",
      options: ["left", "center"],
    },
    variant: {
      control: "select",
      options: ["default", "inverted"],
    },
    hasAfterLine: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

/**
 * The standard left-aligned section header with the default leading line.
 */
export const Default: Story = {
  args: {
    eyebrow: "Our Process",
    title: "How we deliver excellence",
    description:
      "We combine years of industry expertise with modern technology to ensure your project is completed on time and above expectations.",
    align: "left",
    variant: "default",
    hasAfterLine: false,
  },
};

/**
 * Centered alignment with the double-line decorative eyebrow. 
 * This often looks best when centered to create symmetry.
 */
export const CenteredWithLines: Story = {
  args: {
    ...Default.args,
    align: "center",
    hasAfterLine: true,
    eyebrow: "Contact Us",
    title: "Let's build something together",
  },
};

/**
 * The inverted variant using the specific lime-light and cream color palette
 * designed for dark backgrounds.
 */
export const Inverted: Story = {
  args: {
    ...Default.args,
    variant: "inverted",
    hasAfterLine: true,
    eyebrow: "Premium Features",
    title: "A tailored experience for pros",
  },
  parameters: {
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#1a1a1a" }],
    },
  },
};

/**
 * Demonstrates the component without an eyebrow, showing the layout
 * remains clean and the typography carries the section.
 */
export const NoEyebrow: Story = {
  args: {
    title: "Simple title without the extra fluff",
    description: "Sometimes you just need a clean header to start a section.",
  },
};

/**
 * Using JSX in the title to test the clamp fluid typography and font weights.
 */
export const RichFormatting: Story = {
  args: {
    eyebrow: "The Future",
    hasAfterLine: true,
    title: (
      <>
        Built for <span className="text-lime italic">Scalability</span>
      </>
    ),
    description:
      "Our infrastructure grows with you. No matter the load, we stay responsive.",
  },
};
