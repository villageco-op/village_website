import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Home, Package, Truck } from 'lucide-react';

import SidebarNavItem from './SidebarNavItem';

const meta: Meta<typeof SidebarNavItem> = {
  title: 'Layout/Sidebar/SidebarNavItem',
  component: SidebarNavItem,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story, context) => {
      // Mimic the sidebar wrapper width and background
      const isCollapsed = context.args.isCollapsed;
      return (
        <div
          className={`bg-forest-dark py-4 transition-all duration-300 ease-in-out ${
            isCollapsed ? 'w-16' : 'w-58'
          }`}
        >
          <Story />
        </div>
      );
    },
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SidebarNavItem>;

/**
 * A standard, inactive navigation item.
 */
export const Default: Story = {
  args: {
    item: {
      name: 'Dashboard',
      icon: Home,
      href: '/dashboard',
    },
    isActive: false,
    isCollapsed: false,
  },
};

/**
 * Navigation item indicating the user's current route.
 */
export const Active: Story = {
  args: {
    ...Default.args,
    isActive: true,
  },
};

/**
 * Navigation item that includes secondary helper text.
 */
export const WithSubtext: Story = {
  args: {
    item: {
      name: 'Deliveries',
      sub: 'Active routes',
      icon: Truck,
      href: '/deliveries',
    },
    isActive: false,
    isCollapsed: false,
  },
};

/**
 * Navigation item with a standard numerical badge.
 */
export const WithBadgeDefault: Story = {
  args: {
    item: {
      name: 'Deliveries',
      icon: Truck,
      href: '/deliveries',
      badge: 5,
    },
    isActive: false,
    isCollapsed: false,
  },
};

/**
 * Navigation item utilizing the 'sun' badge variant to grab attention.
 */
export const WithBadgeSun: Story = {
  args: {
    item: {
      name: 'Inventory',
      icon: Package,
      href: '/inventory',
      badge: 'New',
      badgeVariant: 'sun',
    },
    isActive: false,
    isCollapsed: false,
  },
};

/**
 * How the navigation item looks when the entire sidebar is collapsed.
 */
export const Collapsed: Story = {
  args: {
    ...Default.args,
    isCollapsed: true,
  },
};

/**
 * How the active navigation item looks when the sidebar is collapsed.
 */
export const CollapsedActive: Story = {
  args: {
    ...Active.args,
    isCollapsed: true,
  },
};
