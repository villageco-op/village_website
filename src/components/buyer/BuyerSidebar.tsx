'use client';

import { Package, Store, CreditCard, MessageCircle, Repeat } from 'lucide-react';

import { Sidebar, type NavGroup } from '../layout/Sidebar';

import type { User } from '@/lib/api/generated/models/user';

const BUYER_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Ordering',
    items: [
      {
        name: 'Order Dashboard',
        sub: 'Weekly summary',
        icon: Package,
        href: '/buyer',
        protected: true,
      },
      {
        name: 'Browse Produce',
        sub: 'Available this week',
        icon: Store,
        href: '/buyer/browse',
        protected: false,
      },
      {
        name: 'Subscriptions',
        sub: 'Recurring orders',
        icon: Repeat,
        href: '/buyer/subscriptions',
        protected: true,
      },
    ],
  },
  {
    label: 'Business',
    items: [
      {
        name: 'Billing',
        sub: 'Invoices & payments',
        icon: CreditCard,
        href: '/buyer/billing',
        protected: true,
      },
    ],
  },
  {
    label: 'Support',
    items: [{ name: 'Get Help', icon: MessageCircle, href: '/buyer/help', protected: false }],
  },
];

interface BuyerSidebarProps {
  user?: User;
}

/**
 * The left aligned sidebar for navigating the buyer pages.
 * @param props - Props for the buyer user object
 * @param props.user - The user object for the buyer
 * @returns A sidebar component with navigation links
 */
export function BuyerSidebar({ user }: BuyerSidebarProps) {
  return (
    <Sidebar
      user={user}
      roleLabel="Buyer"
      fallbackName="New Neighbor"
      settingsHref="/settings"
      publicProfileBaseUrl={undefined}
      navGroups={BUYER_NAV_GROUPS}
    />
  );
}
