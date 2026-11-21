'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const QUICK_LINKS = [
  {
    title: 'Browse Marketplace',
    href: '/shop/browse',
  },
  {
    title: 'My Orders',
    href: '/shop/orders',
  },
  {
    title: 'Subscriptions',
    href: '/shop/subscriptions',
  },
  {
    title: 'Billing',
    href: '/shop/billing',
  },
  {
    title: 'Tutorials',
    href: '/shop/tutorials',
  },
  {
    title: 'Get Help',
    href: '/shop/help',
  },
  {
    title: 'Manage Account',
    href: '/settings',
  },
];

/**
 * List of quick links to buyer pages and actions
 * @returns A card containing the links
 */
export function BuyerQuickLinksCard() {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col">
        <div className="mb-4">
          <h2 className="font-heading font-bold text-ink">Navigation</h2>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {QUICK_LINKS.map((link) => (
            <Button
              asChild
              variant="link"
              key={link.href}
              size="lg"
              className="items-start justify-start"
            >
              <Link key={link.href} href={link.href}>
                {link.title}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
