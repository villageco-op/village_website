'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, type ComponentType } from 'react';

import SidebarNavItem from './sidebar/SidebarNavItem';
import SidebarProfile from './sidebar/SidebarProfile';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { User } from '@/lib/api/generated/models/user';
import { cn } from '@/lib/utils';

/**
 * Navigation item structure.
 */
export interface NavItem {
  name: string;
  sub?: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
  badge?: number | string;
  badgeVariant?: 'default' | 'sun';
  protected?: boolean;
}

/**
 * Navigation group structure.
 */
export interface NavGroup {
  label: string;
  items: NavItem[];
}

/**
 * Props for the shared Sidebar.
 */
export interface SidebarProps {
  user?: User;
  roleLabel: string;
  navGroups: NavGroup[];
  settingsHref: string;
  publicProfileBaseUrl?: string; // e.g., '/producer' or '/buyer'. If omitted, external link is hidden.
  fallbackName?: string;
}

/**
 * A shared, deep-forest themed sidebar for navigating role-specific pages.
 * @param props - Customizations for the different pages
 * @param props.user - The user object
 * @param props.roleLabel - The users role (e.g., buyer, seller, delivery)
 * @param props.navGroups - Array defining the sections and nav items
 * @param props.settingsHref - The path to the settings page
 * @param props.publicProfileBaseUrl - The base for the public profile page (e.g., /buyer, /seller)
 * @param props.fallbackName - The display name when user.name is missing
 * @returns A side nav bar
 */
export function Sidebar({
  user,
  roleLabel,
  navGroups,
  settingsHref,
  publicProfileBaseUrl,
  fallbackName = 'User',
}: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const visibleNavGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.protected || (user !== null && user !== undefined)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div
      className={cn(
        'sticky top-16 self-start flex flex-col h-[calc(100vh-64px)] bg-forest-dark transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-58',
        !isCollapsed && 'w-full md:w-58 md:h-[calc(100vh-64px)] shadow-2xl md:shadow-none',
      )}
    >
      {/* Scrollable Main Section */}
      <ScrollArea className="flex-1 overflow-hidden [&>div>div]:block!">
        <div className="flex flex-col">
          <SidebarProfile
            user={user}
            roleLabel={roleLabel}
            settingsHref={settingsHref}
            publicProfileBaseUrl={publicProfileBaseUrl}
            fallbackName={fallbackName}
            isCollapsed={isCollapsed}
          />

          {/* Navigation Groups */}
          <div className="flex-1 py-4.5">
            {visibleNavGroups.map((group, groupIndex) => (
              <div key={group.label} className="pb-1">
                {!isCollapsed && (
                  <div className="flex items-center gap-1.5 px-4.5 pb-2 font-heading text-[0.58rem] font-extrabold uppercase tracking-[0.14em] text-lime/50 before:block before:h-px before:w-3.5 before:bg-lime/30">
                    {group.label}
                  </div>
                )}

                {/* Items */}
                <div className="flex flex-col">
                  {group.items.map((item) => (
                    <SidebarNavItem
                      key={item.name}
                      item={item}
                      isActive={pathname === item.href}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </div>

                {/* Divider */}
                {groupIndex < navGroups.length - 1 && (
                  <Separator className="mx-4.5 my-1.5 w-auto bg-white/5" />
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Fixed Bottom Collapse Section */}
      <div className="w-full shrink-0 pb-4 pt-2">
        <Separator className="mx-4.5 mb-4 w-auto bg-white/5" />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'flex w-full items-center gap-2.5 px-4.5 py-2.25 text-cream/75 transition-colors hover:bg-lime/5 hover:text-lime-light',
            isCollapsed && 'justify-center px-0',
          )}
        >
          <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-white/5">
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </div>
          {!isCollapsed && (
            <span className="font-heading text-[0.78rem] font-semibold leading-[1.2]">
              Collapse Sidebar
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
