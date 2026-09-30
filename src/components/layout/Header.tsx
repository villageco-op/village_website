'use client';

import { LogIn, Settings, ExternalLink, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ReservationBanner } from '../cart/ReservationBanner';

import {
  BUYER_NAV_GROUPS,
  SELLER_NAV_GROUPS,
  PANTRY_NAV_GROUPS,
  DEFAULT_ORG_NAV_GROUPS,
  getSecondaryNavItems,
  navItems,
  rightNavItems,
  type NavGroup,
} from './navConfig';
import { NavDropdown } from './NavDropdown';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useGetOrganization } from '@/lib/api/generated/organizations/organizations';
import { getInitials } from '@/lib/user-utils';
import { cn, getAssetPath } from '@/lib/utils';

/**
 * The persistent site header. Includes the page navigation links and user profile dropdown.
 * @returns The component html
 */
export function Header() {
  const pathname = usePathname();
  const { user, status, logout } = useAuth();

  const isHome = pathname === '/';

  const orgId = user?.organizationId;
  const orgUser = !!orgId;
  const adminUser = user?.orgRole === 'admin';

  const { data: orgResult } = useGetOrganization(orgId ?? '', {
    query: {
      enabled: !!orgId,
    },
  });

  const orgError = !orgResult || orgResult?.status !== 200 || !orgResult.data;
  const org = !orgError ? orgResult.data : undefined;

  const getNavGroups = (): NavGroup[] => {
    if (pathname.startsWith('/buyer')) {
      return BUYER_NAV_GROUPS;
    }
    if (pathname.startsWith('/seller')) {
      return SELLER_NAV_GROUPS;
    }
    if (pathname.startsWith('/org')) {
      const orgGroups =
        org?.type === 'pantry'
          ? [...PANTRY_NAV_GROUPS, ...DEFAULT_ORG_NAV_GROUPS]
          : DEFAULT_ORG_NAV_GROUPS;
      return orgGroups;
    }
    return [];
  };

  const navGroups = getNavGroups();

  const secondaryNavItems = getSecondaryNavItems(pathname).filter(
    (item) => (!item.protected || status === 'authenticated') && (!item.adminOnly || adminUser),
  );

  const filteredNavItems = navItems.filter(
    (item) => (!item.unAuthOnly || status === 'unauthenticated') && (!item.orgOnly || orgUser),
  );

  const isLoading = status === 'loading';
  const userName = user?.name || 'User';

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-16 bg-primary border-b border-border/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center shrink-0">
            {isHome ? (
              <>
                <Image
                  src={getAssetPath('/icons/logo-horizontal.png')}
                  alt="Village Logo"
                  width={100}
                  height={34}
                  className="hidden lg:block h-8 w-auto"
                  priority
                />
                <Image
                  src={getAssetPath('/icons/logo.png')}
                  alt="Village Icon"
                  width={34}
                  height={34}
                  className="block lg:hidden h-8 w-auto"
                  priority
                />
              </>
            ) : (
              <Image
                src={getAssetPath('/icons/logo.png')}
                alt="Village Icon"
                width={64}
                height={64}
                className="h-12 w-auto"
                priority
              />
            )}
          </Link>

          {/* Primary Nav Items */}
          <nav className="flex items-center gap-1" aria-label="Main Navigation">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'font-heading text-xs font-bold uppercase tracking-wider',
                    isActive
                      ? 'text-lime bg-lime/10 hover:bg-lime/10 hover:text-lime'
                      : 'text-cream/40 hover:bg-white/5 hover:text-cream/80',
                  )}
                >
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              );
            })}
          </nav>

          {secondaryNavItems.length > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="hidden sm:block h-6 bg-cream/10 mx-4 my-auto"
              />
              <nav className="flex items-center gap-1" aria-label="Secondary Navigation">
                {secondaryNavItems.map((item) => (
                  <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    size="sm"
                    className="font-heading text-xs font-semibold text-cream/50 hover:bg-white/5 hover:text-cream"
                  >
                    <Link href={item.href}>{item.name}</Link>
                  </Button>
                ))}
              </nav>
            </>
          )}

          {(() => {
            const filteredGroups = navGroups
              .map((group) => ({
                ...group,
                items: group.items.filter(
                  (item) =>
                    (!item.protected || status === 'authenticated') &&
                    (!item.adminOnly || adminUser),
                ),
              }))
              .filter((group) => group.items.length > 0);

            if (filteredGroups.length === 0) return null;

            return (
              <>
                <Separator
                  orientation="vertical"
                  className="hidden sm:block h-6 bg-cream/10 mx-4 my-auto"
                />

                <nav
                  className="flex md:hidden items-center"
                  aria-label="Category Navigation Mobile"
                >
                  <NavDropdown label="Menu" groups={filteredGroups} />
                </nav>

                <nav
                  className="hidden md:flex items-center gap-2"
                  aria-label="Category Navigation Desktop"
                >
                  {filteredGroups.map((group) => {
                    if (group.items.length === 1) {
                      const item = group.items[0];
                      return (
                        <Button
                          key={item.href}
                          asChild
                          variant="ghost"
                          size="sm"
                          className="font-heading text-xs font-semibold text-cream/50 hover:bg-white/5 hover:text-cream"
                        >
                          <Link href={item.href}>{item.name}</Link>
                        </Button>
                      );
                    }

                    return <NavDropdown key={group.label} label={group.label} groups={[group]} />;
                  })}
                </nav>
              </>
            );
          })()}

          {status === 'unauthenticated' && (
            <nav
              className="ml-auto flex items-center gap-1 mr-3"
              aria-label="Additional Navigation"
            >
              {rightNavItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'font-heading text-xs font-bold uppercase tracking-wider',
                      isActive
                        ? 'text-lime bg-lime/10 hover:bg-lime/10 hover:text-lime'
                        : 'text-cream/40 hover:bg-white/5 hover:text-cream/80',
                    )}
                  >
                    <Link href={item.href}>{item.name}</Link>
                  </Button>
                );
              })}
            </nav>
          )}

          <div className={cn('flex items-center gap-2', status !== 'unauthenticated' && 'ml-auto')}>
            {!user && !isLoading && (
              <Button
                size="sm"
                asChild
                className="bg-lime text-forest-dark font-heading text-xs font-bold transition-transform hover:bg-lime-light hover:-translate-y-px"
              >
                <Link href="/login">
                  <span className="hidden md:inline">Login/Sign Up &rarr;</span>
                  <LogIn className="md:hidden h-4 w-4" />
                </Link>
              </Button>
            )}

            {user && (
              <div className="group/user relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                      <Avatar className="h-9 w-9 bg-lime">
                        {user.image && (
                          <AvatarImage src={user.image} alt={userName} className="object-cover" />
                        )}
                        <AvatarFallback className="bg-lime font-heading text-xs font-extrabold text-deep-forest">
                          {getInitials(userName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent variant="forest" align="end" className="w-56 mt-2">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none">{userName}</p>
                        {user.email && (
                          <p className="text-xs leading-none text-cream/60 truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>

                    {user.id && (
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/public-profile/${user.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>Public Profile</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => void logout?.()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </header>
      <ReservationBanner />
    </>
  );
}
