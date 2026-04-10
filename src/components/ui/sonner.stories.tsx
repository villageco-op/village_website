import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

import { Toaster } from "./sonner";

import { Button } from "@/components/ui/button";

/*
 * Storybook Wrapper for the Branded Sonner Toaster.
 * We render the Toaster with your designer's specific CSS translated to Tailwind classes,
 * mapping exactly to your global CSS variables.
 */
const ToastDemo = ({
  message,
  actionLabel,
  autoTrigger = false,
}: {
  message: string;
  actionLabel?: string;
  autoTrigger?: boolean;
}) => {
  const triggerToast = useCallback(() => {
    toast(message, {
      action: actionLabel
        ? {
            label: actionLabel,
            onClick: () => console.log("Action clicked"),
          }
        : undefined,
    });
  }, [message, actionLabel]);

  // Automatically show the toast on load for Storybook viewing convenience
  useEffect(() => {
    if (autoTrigger) {
      const timer = setTimeout(() => triggerToast(), 150);
      return () => clearTimeout(timer);
    }
  }, [autoTrigger, triggerToast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-100 w-full relative">
      <Button
        onClick={triggerToast}
        className="bg-lime text-forest-dark font-heading font-bold transition-transform hover:bg-lime-light hover:-translate-y-px"
      >
        Trigger Toast
      </Button>

      <Toaster />
    </div>
  );
};

const meta: Meta<typeof ToastDemo> = {
  title: "Components/CartToast",
  component: ToastDemo,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "off-white",
      values: [
        { name: "off-white", value: "#faf7ef" },
        { name: "deep-forest", value: "#2a4b28" },
        { name: "cream", value: "#f5edd8" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    message: { control: "text" },
    actionLabel: { control: "text" },
    autoTrigger: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ToastDemo>;

/**
 * The standard "Add to cart" toast.
 * Displayed against the default light off-white background.
 */
export const Default: Story = {
  args: {
    message: "✅ Item added to your cart",
    autoTrigger: true,
  },
};

/**
 * Testing the component against the dark Deep Forest background.
 * This is crucial to ensure the shadow-[0_8px_32px_rgba(0,0,0,0.2)]
 * is enough to separate the dark-green toast from the dark-green background.
 */
export const OnDarkBackground: Story = {
  args: {
    message: "🔄 Subscription updated successfully",
    autoTrigger: true,
  },
  parameters: {
    backgrounds: {
      default: "deep-forest",
    },
  },
};

/**
 * Demonstrates a longer message to test the whitespace-nowrap and flex behavior
 * within the pill-shaped container.
 */
export const LongText: Story = {
  args: {
    message: "✅ You've added 3 items from the Gary Community Farm to your cart",
    autoTrigger: true,
  },
};

/**
 * Tests the Sonner action button integration (e.g. an "Undo" button).
 * The action button uses the brand's Lime color to stand out against the deep-forest background.
 */
export const WithActionLabel: Story = {
  args: {
    message: "Removed 1 item from cart",
    actionLabel: "Undo",
    autoTrigger: true,
  },
};
