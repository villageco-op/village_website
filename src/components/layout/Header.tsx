'use client';

import { LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ReservationBanner } from '../cart/ReservationBanner';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { cn, getAssetPath } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  unAuthOnly?: boolean;
  orgOnly?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/', unAuthOnly: true },
  { name: 'Sell', href: '/seller' },
  { name: 'Shop', href: '/buyer/browse' },
  { name: 'Org', href: '/org/clients', orgOnly: true },
];

interface SecondaryNavItem {
  name: string;
  href: string;
  protected: boolean;
  adminOnly?: boolean;
}

const getSecondaryNavItems = (path: string): SecondaryNavItem[] => {
  if (path.startsWith('/buyer')) {
    return [
      { name: 'Dashboard', href: '/buyer', protected: true },
      { name: 'Browse', href: '/buyer/browse', protected: false },
      { name: 'Subscriptions', href: '/buyer/subscriptions', protected: true },
    ];
  }
  if (path.startsWith('/seller')) {
    return [
      { name: 'Dashboard', href: '/seller', protected: true },
      { name: 'Orders', href: '/seller/orders', protected: true },
      { name: 'Subscriptions', href: '/seller/subscriptions', protected: true },
    ];
  }
  if (path === '/') {
    return [
      { name: 'Food Pantries', href: '#referral-management', protected: false },
      { name: 'Resturants & Markets', href: '#demand-prediction-research', protected: false },
    ];
  }
  if (path.startsWith('/org')) {
    return [
      { name: 'Clients', href: '/org/clients', protected: true, adminOnly: false },
      { name: 'Members', href: '/org/members', protected: true, adminOnly: true },
      { name: 'Learn', href: '/org/tutorials', protected: true, adminOnly: false },
    ];
  }
  return [];
};

/**
 * The persistent site header. Includes the page navigation links.
 * @returns The component html
 */
export function Header() {
  const pathname = usePathname();
  const { user, status } = useAuth();

  const orgUser = !!user?.organizationId;
  const adminUser = user?.orgRole === 'admin';

  const secondaryNavItems = getSecondaryNavItems(pathname).filter(
    (item) => (!item.protected || status == 'authenticated') && (!item.adminOnly || adminUser),
  );
  const filteredNavItems = navItems.filter(
    (item) => (!item.unAuthOnly || status == 'unauthenticated') && (!item.orgOnly || orgUser),
  );

  const isLoading = status === 'loading';

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-16 bg-primary border-b border-border/10">
        <div className="container-custom flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center shrink-0">
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
          </Link>

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
              <nav className="flex items-start gap-1" aria-label="Secondary Navigation">
                <div className="hidden sm:flex items-start gap-1">
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
                </div>
              </nav>
            </>
          )}

          {!user && !isLoading && (
            <Button
              size="sm"
              className="ml-auto bg-lime text-forest-dark font-heading text-xs font-bold transition-transform hover:bg-lime-light hover:-translate-y-px"
            >
              <Link href="/login" className="hidden md:block">
                Get involved &rarr;
              </Link>
              <Link href="/login" className="block md:hidden">
                <LogIn />
              </Link>
            </Button>
          )}
        </div>
      </header>
      <ReservationBanner />
    </>
  );
}
