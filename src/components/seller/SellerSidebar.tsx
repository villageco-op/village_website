'use client';

import {
  LayoutDashboard,
  Sprout,
  CircleDollarSign,
  Package,
  MessageCircle,
  CircleQuestionMark,
  Repeat,
} from 'lucide-react';

import { type NavGroup, Sidebar } from '../layout/Sidebar';

import type { User } from '@/lib/api/generated/models/user';

const SELLER_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        name: 'Dashboard',
        sub: '',
        icon: LayoutDashboard,
        href: '/seller',
        protected: true,
      },
      {
        name: 'My Listings',
        sub: '',
        icon: Sprout,
        href: '/seller/listings',
        protected: true,
      },
    ],
  },
  {
    label: 'Sales',
    items: [
      {
        name: 'Earnings',
        sub: '',
        icon: CircleDollarSign,
        href: '/seller/earnings',
        protected: true,
      },
      {
        name: 'Orders',
        sub: '',
        icon: Package,
        href: '/seller/orders',
        badgeVariant: 'sun',
        protected: true,
      },
      {
        name: 'Subscriptions',
        sub: '',
        icon: Repeat,
        href: '/seller/subscriptions',
        badgeVariant: 'sun',
        protected: true,
      },
    ],
  },
  {
    label: 'Support',
    items: [
      { name: 'Get Help', sub: '', icon: MessageCircle, href: '/seller/help', protected: true },
      {
        name: 'Tutorials',
        sub: '',
        icon: CircleQuestionMark,
        href: '/seller/tutorials',
        protected: true,
      },
    ],
  },
];

/**
 * Props for the seller sidebar.
 */
interface SellerSidebarProps {
  user?: User;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

/**
 * The left aligned sidebar for navigating the seller pages.
 * @param props - Props for the seller user object
 * @param props.user - The user object for the seller
 * @param props.status - The user authentication status
 * @returns A sidebar component with navigation links
 */
export function SellerSidebar({ user, status }: SellerSidebarProps) {
  if (user && !user.stripeOnboardingComplete) {
    // AuthGaurd will redirect so hide nav items
    status = 'loading';
  }

  return (
    <Sidebar
      user={user}
      status={status}
      roleLabel="Grower & Seller"
      fallbackName="New Neighbor"
      settingsHref="/settings"
      publicProfileBaseUrl="/public-profile"
      navGroups={SELLER_NAV_GROUPS}
    />
  );
}
