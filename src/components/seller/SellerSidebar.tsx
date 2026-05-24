'use client';

import { LayoutDashboard, Sprout, CircleDollarSign, Package, MessageCircle } from 'lucide-react';

import { type NavGroup, Sidebar } from '../layout/Sidebar';

import type { User } from '@/lib/api/generated/models/user';

const SELLER_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        name: 'Dashboard',
        sub: 'This week at a glance',
        icon: LayoutDashboard,
        href: '/seller',
        protected: true,
      },
      {
        name: 'My Listings',
        sub: 'Active produce for sale',
        icon: Sprout,
        href: '/seller/listings',
        badge: 3,
        protected: true,
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
        protected: true,
      },
      {
        name: 'Orders',
        sub: 'Incoming & fulfilled',
        icon: Package,
        href: '/seller/orders',
        badge: 2,
        badgeVariant: 'sun',
        protected: true,
      },
    ],
  },
  {
    label: 'Support',
    items: [
      { name: 'Get Help', sub: '', icon: MessageCircle, href: '/seller/help', protected: true },
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
      fallbackName="New Neighbor"
      settingsHref="/settings"
      publicProfileBaseUrl="/public-profile"
      navGroups={SELLER_NAV_GROUPS}
    />
  );
}
