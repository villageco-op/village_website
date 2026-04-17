'use client';

import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

function getInitials(name?: string) {
  if (!name) return '??';
  const parts = name.split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
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

  const userImage = user?.image;
  const userName = user?.name || fallbackName;

  return (
    <ScrollArea className="sticky top-16 h-[calc(100vh-64px)] w-58 shrink-0 bg-forest-dark [&>div>div]:block!">
      <div className="flex flex-col">
        {/* Profile Section */}
        <div className="group relative flex items-center gap-2.75 border-b border-white/5 p-[20px_18px_16px] transition-colors hover:bg-white/5">
          <Link href={settingsHref} className="absolute inset-0 z-0" aria-label="Edit Profile" />

          <div className="z-10 flex flex-1 items-center gap-2.75 pointer-events-none">
            <Avatar className="h-9 w-9 bg-lime">
              {userImage && <AvatarImage src={userImage} alt={userName} className="object-cover" />}
              <AvatarFallback className="bg-transparent font-heading text-xs font-extrabold text-deep-forest">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 overflow-hidden">
              <div className="truncate font-heading text-[0.8rem] font-bold leading-[1.2] text-cream">
                {userName}
              </div>
              <div className="truncate font-sans text-[0.68rem] text-lime-light/70">
                {roleLabel}
              </div>
            </div>
          </div>

          {user?.id && publicProfileBaseUrl && (
            <Button
              asChild
              variant="ghost"
              size="icon"
              title="View Public Profile"
              className="relative z-20 h-6 w-6 shrink-0 rounded-md text-lime-light/40 hover:bg-lime/20 hover:text-lime-light"
            >
              <Link
                href={`${publicProfileBaseUrl}/${user.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="sr-only">View Public Profile</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 py-4.5">
          {navGroups.map((group, groupIndex) => (
            <div key={group.label} className="pb-1">
              {/* Group Label */}
              <div className="flex items-center gap-1.5 px-4.5 pb-2 font-heading text-[0.58rem] font-extrabold uppercase tracking-[0.14em] text-lime/50 before:block before:h-px before:w-3.5 before:bg-lime/30">
                {group.label}
              </div>

              {/* Items */}
              <div className="flex flex-col">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group relative flex w-full cursor-pointer items-center gap-2.5 bg-transparent px-4.5 py-2.25 text-left transition-colors hover:bg-lime/5',
                        isActive && 'bg-lime/10 hover:bg-lime/10',
                      )}
                    >
                      {/* Active Indicator Line */}
                      {isActive && (
                        <div className="absolute bottom-1 left-0 top-1 w-0.75 rounded-r-[3px] bg-lime" />
                      )}

                      {/* Icon */}
                      <div
                        className={cn(
                          'flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-white/5 transition-all group-hover:scale-105 group-hover:bg-lime/20',
                          isActive && 'bg-lime/25 group-hover:bg-lime/25',
                        )}
                      >
                        <item.icon
                          className={cn('h-4 w-4 text-cream/75', isActive && 'text-lime-light')}
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                      </div>

                      {/* Text */}
                      <div className="flex flex-1 flex-col">
                        <span
                          className={cn(
                            'font-heading text-[0.78rem] font-semibold leading-[1.2] text-cream/75 group-hover:text-cream',
                            isActive && 'font-bold text-lime-light',
                          )}
                        >
                          {item.name}
                        </span>
                        {item.sub && (
                          <span className="mt-px block font-sans text-[0.62rem] text-cream/60">
                            {item.sub}
                          </span>
                        )}
                      </div>

                      {/* Badge */}
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            'ml-auto shrink-0 border-0 rounded-full px-1.5 py-0.5 font-heading text-[0.58rem] font-extrabold leading-[1.4]',
                            item.badgeVariant === 'sun'
                              ? 'bg-sun text-black hover:bg-sun hover:text-black'
                              : 'bg-lime text-deep-forest hover:bg-lime hover:text-deep-forest',
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
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
  );
}
