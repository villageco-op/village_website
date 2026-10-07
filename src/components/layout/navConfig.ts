/**
 * A navigation group item.
 */
export interface NavGroupItem {
  name: string;
  href: string;
  protected?: boolean;
  adminOnly?: boolean;
}

/**
 * A navigation group.
 */
export interface NavGroup {
  label: string;
  items: NavGroupItem[];
}

/**
 * Navigation groups for the buyer dashboard.
 */
export const BUYER_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Dashboard',
    items: [{ name: 'Dashboard', href: '/buyer', protected: true }],
  },
  {
    label: 'Orders',
    items: [
      { name: 'Browse', href: '/buyer/browse', protected: false },
      { name: 'Orders', href: '/buyer/orders', protected: true },
      { name: 'Subscriptions', href: '/buyer/subscriptions', protected: true },
      { name: 'Billing', href: '/buyer/billing', protected: true },
    ],
  },
  {
    label: 'Support',
    items: [
      { name: 'Help', href: '/buyer/help', protected: false },
      { name: 'Tutorials', href: '/buyer/tutorials', protected: true },
    ],
  },
];

/**
 * Navigation groups for the seller dashboard.
 */
export const SELLER_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Dashboard',
    items: [{ name: 'Dashboard', href: '/seller', protected: true }],
  },
  {
    label: 'Sales',
    items: [
      { name: 'Listings', href: '/seller/listings', protected: true },
      { name: 'Earnings', href: '/seller/earnings', protected: true },
      { name: 'Orders', href: '/seller/orders', protected: true },
      { name: 'Subscriptions', href: '/seller/subscriptions', protected: true },
    ],
  },
  {
    label: 'Support',
    items: [
      { name: 'Help', href: '/seller/help', protected: true },
      { name: 'Tutorials', href: '/seller/tutorials', protected: true },
    ],
  },
];

/**
 * Navigation groups for the org dashboard.
 */
export const DEFAULT_ORG_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Members',
    items: [
      { name: 'Members', href: '/org/members', protected: true, adminOnly: true },
      { name: 'Invite', href: '/org/invite', protected: true, adminOnly: true },
    ],
  },
  {
    label: 'Support',
    items: [
      { name: 'Help', href: '/org/help', protected: true },
      { name: 'Tutorials', href: '/org/tutorials', protected: true },
    ],
  },
];

/**
 * Navigation groups for the food pantry dashboard.
 */
export const PANTRY_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Clients',
    items: [
      { name: 'Clients', href: '/org/clients', protected: true },
      { name: 'Add', href: '/org/new-client', protected: true },
      { name: 'Export', href: '/org/export', protected: true },
    ],
  },
];

/**
 * A primary nav item.
 */
export interface NavItem {
  name: string;
  href: string;
  unAuthOnly?: boolean;
  orgOnly?: boolean;
}

/**
 * The nav items.
 */
export const navItems: NavItem[] = [
  { name: 'Home', href: '/', unAuthOnly: true },
  { name: 'Shop', href: '/buyer/browse' },
  { name: 'Sell', href: '/seller' },
  { name: 'Org', href: '/org/clients', orgOnly: true },
];

/**
 * Secondary nav items for internal page navigation.
 */
export interface SecondaryNavItem {
  name: string;
  href: string;
  protected: boolean;
  adminOnly?: boolean;
}

/**
 * Get secondary nav items based on the pages path.
 * @param path - The url pathname
 * @returns A secondary nav item array
 */
export const getSecondaryNavItems = (path: string): SecondaryNavItem[] => {
  if (path === '/') {
    return [{ name: 'Food Pantries', href: '#referral-management', protected: false }];
  }
  return [];
};

/**
 * Right nav items for marketing pages.
 */
export const rightNavItems: NavItem[] = [
  { name: 'The Problem', href: '/problem' },
  { name: 'Our Mission', href: '/mission' },
];
