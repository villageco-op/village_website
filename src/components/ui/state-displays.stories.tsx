import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PackageOpen, Home, WifiOff, ShieldAlert } from 'lucide-react';

import { 
    EmptyState, 
    InlineErrorState, 
    PageErrorState, 
    NotFoundState 
} from "./state-displays";

import { Button } from '@/components/ui/button';

const meta: Meta = {
  title: "UI/States",
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/current-page',
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

export const EmptyDefault: StoryObj<typeof EmptyState> = {
  render: (args) => <EmptyState {...args} />,
  args: {
    title: "No projects found",
    description: "You haven't created any projects yet. Click below to get started.",
    icon: PackageOpen,
    action: <Button>Create New Project</Button>,
  },
};

export const InlineError: StoryObj<typeof InlineErrorState> = {
  render: (args) => <InlineErrorState {...args} />,
  args: {
    title: "Feed could not be loaded",
    description: "There was a temporary issue fetching your latest updates.",
    onRetry: () => console.log("Retrying inline fetch..."),
  },
};

export const PageError: StoryObj<typeof PageErrorState> = {
  render: (args) => <PageErrorState {...args} />,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    title: "Critical System Error",
    description: "We are having trouble communicating with our servers. Please try refreshing the page.",
    icon: WifiOff,
    onRetry: () => window.location.reload(),
  },
};

export const NotFound: StoryObj<typeof NotFoundState> = {
  render: (args) => <NotFoundState {...args} />,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    title: "Document Missing",
    description: "The resource you're looking for might have been deleted or the link is broken.",
    showBackButton: true,
  },
};

export const NotFoundCustomAction: StoryObj<typeof NotFoundState> = {
  render: (args) => <NotFoundState {...args} />,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    title: "Access Denied",
    description: "You do not have permission to view this resource.",
    icon: ShieldAlert,
    showBackButton: false,
    action: (
      <Button variant="default" className="gap-2">
        <Home className="h-4 w-4" /> Go to Dashboard
      </Button>
    ),
  },
};
