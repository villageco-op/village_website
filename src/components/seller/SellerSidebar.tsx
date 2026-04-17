'use client';

import {
  LayoutDashboard,
  Sprout,
  CircleDollarSign,
  Package,
  HeartHandshake,
  MessageCircle,
  Settings,
} from 'lucide-react';
import type { ComponentType } from 'react';

import { Sidebar } from '../layout/Sidebar';

import type { User } from '@/lib/api/generated/models/user';

/**
 * A navigation item in the side bar.
 */
export interface NavItem {
  name: string;
  sub: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
  badge?: number | string;
  badgeVariant?: 'default' | 'sun';
}

/**
 * A group of navigation items with a label.
 */
export interface NavGroup {
  label: string;
  items: NavItem[];
}

const SELLER_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', sub: 'This week at a glance', icon: LayoutDashboard, href: '/seller' },
      {
        name: 'My Listings',
        sub: 'Active produce for sale',
        icon: Sprout,
        href: '/seller/listings',
        badge: 3,
      },
    ],
  },
  {
    label: 'Sales',
    items: [
      {
        name: 'Earnings',
        sub: 'Revenue & payouts',
        icon: CircleDollarSign,
        href: '/seller/earnings',
      },
      {
        name: 'Orders',
        sub: 'Incoming & fulfilled',
        icon: Package,
        href: '/seller/orders',
        badge: 2,
        badgeVariant: 'sun',
      },
    ],
  },
  {
    label: 'Resources',
    items: [
      {
        name: 'Community Fund',
        sub: 'Grants & support',
        icon: HeartHandshake,
        href: '/seller/fund',
      },
    ],
  },
  {
    label: 'Support',
    items: [
      { name: 'Get Help', sub: '', icon: MessageCircle, href: '/seller/help' },
      { name: 'Settings', sub: '', icon: Settings, href: '/seller/settings' },
    ],
  },
];

/**
 * Props for the seller sidebar.
 */
interface SellerSidebarProps {
  user?: User;
}

/**
 * The left aligned sidebar for navigating the seller pages.
 * @param props - Props for the seller user object
 * @param props.user - The user object for the seller
 * @returns A sidebar component with navigation links
 */
export function SellerSidebar({ user }: SellerSidebarProps) {
  return (
    <Sidebar
      user={user}
      roleLabel="Producer"
      fallbackName="Producer"
      settingsHref="/seller/settings"
      publicProfileBaseUrl="/producer"
      navGroups={SELLER_NAV_GROUPS}
    />
  );
}
