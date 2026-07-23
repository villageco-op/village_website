'use client';

import {
  CircleQuestionMark,
  IdCardLanyard,
  MessageCircle,
  Settings,
  UserPlus,
  Users,
} from 'lucide-react';

import { Sidebar, type NavGroup } from '../layout/Sidebar';

import type { Organization } from '@/lib/api/generated/models/organization';
import type { User } from '@/lib/api/generated/models/user';

const DEFUALT_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Members',
    items: [
      {
        name: 'Members',
        sub: 'View and manage organization members.',
        icon: IdCardLanyard,
        href: '/org/members',
        protected: true,
      },
    ],
  },
  {
    label: 'Settings & Support',
    items: [
      { name: 'Settings', sub: '', icon: Settings, href: '/settings', protected: true },
      { name: 'Get Help', sub: '', icon: MessageCircle, href: '/org/help', protected: true },
      {
        name: 'Tutorials',
        sub: '',
        icon: CircleQuestionMark,
        href: '/org/tutorials',
        protected: true,
      },
    ],
  },
];

const PANTRY_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Client Management',
    items: [
      { name: 'Clients', sub: 'View Clients', icon: Users, href: '/org/clients', protected: true },
      {
        name: 'Add Client',
        sub: 'Add New Client',
        icon: UserPlus,
        href: '/org/new-client',
        protected: true,
      },
    ],
  },
];

const RESTAURANT_NAV_GROUPS: NavGroup[] = [];

interface OrgSidebarProps {
  user?: User;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  org?: Organization;
  isLoading: boolean;
  isError: boolean;
  onRefetch: () => void;
}

/**
 * The left aligned sidebar for navigating the org pages.
 * @param props - Props for the seller user object
 * @param props.user - The user object for the seller
 * @param props.status - The user authentication status
 * @param props.org - The organization
 * @param props.isLoading - Is the org data loading
 * @param props.isError - Did an error occur while fetching
 * @param props.onRefetch - When the retry button is clicked
 * @returns A sidebar component with navigation links
 */
export function OrgSidebar({ user, status, org, isLoading, isError, onRefetch }: OrgSidebarProps) {
  const { navGroups, roleLabel } = (() => {
    switch (org?.type || 'pantry') {
      case 'pantry':
        return { navGroups: PANTRY_NAV_GROUPS, roleLabel: 'Food Pantry' };
      case 'restaurant':
        return { navGroups: RESTAURANT_NAV_GROUPS, roleLabel: 'Restaurant' };
    }
  })();

  const computedStatus = (user && !user.organizationId) || isLoading ? 'loading' : status;
  const isOrgError = !isLoading && (isError || !org);

  return (
    <Sidebar
      user={user}
      status={computedStatus}
      roleLabel={roleLabel}
      fallbackName={org?.name ?? 'Organization'}
      settingsHref="/settings"
      publicProfileBaseUrl="/public-profile"
      navGroups={[...navGroups, ...DEFUALT_NAV_GROUPS]}
      isError={isOrgError}
      onRefetch={onRefetch}
      errorMessage="Failed to load organization."
    />
  );
}
