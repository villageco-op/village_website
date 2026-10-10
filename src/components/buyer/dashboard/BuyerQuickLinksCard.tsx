'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const QUICK_LINKS = [
  {
    title: 'Browse Marketplace',
    href: '/buyer/browse',
  },
  {
    title: 'My Orders',
    href: '/buyer/orders',
  },
  {
    title: 'Subscriptions',
    href: '/buyer/subscriptions',
  },
  {
    title: 'Billing',
    href: '/buyer/saved-growers',
  },
  {
    title: 'Tutorials',
    href: '/buyer/tutorials',
  },
  {
    title: 'Get Help',
    href: '/buyer/help',
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
            <Button variant="link" key={link.href} size="lg" className="items-start justify-start">
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
