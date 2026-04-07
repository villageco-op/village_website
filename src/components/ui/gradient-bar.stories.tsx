import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GradientBar } from "./gradient-bar";

const meta: Meta<typeof GradientBar> = {
  title: "UI/GradientBar",
  component: GradientBar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="relative h-20 w-full bg-forest-dark">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GradientBar>;

export const Default: Story = {};
