'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn, getAssetPath } from '@/lib/utils';

/**
 * The persistent site header. Includes the page navigation links.
 * @returns The component html
 */
export function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Producer', href: '/producer' },
    { name: 'Buyer', href: '/buyer' },
    { name: 'Want to deliver?', href: '/deliver' },
  ];

  const secondaryNavItems = [
    { name: 'What it is', href: '#what-it-is' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Why it matters', href: '#why-it-matters' },
    { name: 'Community', href: '#community' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-primary border-b border-border/10">
      <div className="container-custom flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center">
          <Image
            src={getAssetPath('/icons/logo-horizontal.png')}
            alt="Village Logo"
            width={100}
            height={34}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav className="flex items-center gap-1" aria-label="Main Navigation">
          {navItems.map((item) => {
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

        <Separator orientation="vertical" className="h-6 bg-cream/10 mx-4 my-auto" />

        <nav className="flex items-center gap-1 ml-auto" aria-label="Secondary Navigation">
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

          <Button
            asChild
            size="sm"
            className="ml-2 bg-lime text-forest-dark font-heading text-xs font-bold transition-transform hover:bg-lime-light hover:-translate-y-px"
          >
            <Link href="/login">Get involved &rarr;</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
