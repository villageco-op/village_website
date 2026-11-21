'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const QUICK_LINKS = [
  {
    title: 'Orders',
    href: '/sell/orders',
  },
  {
    title: 'Subscriptions',
    href: '/sell/subscriptions',
  },
  {
    title: 'Listings',
    href: '/sell/listings',
  },
  {
    title: 'New Listing',
    href: '/sell/new-listing',
  },
  {
    title: 'Tutorials',
    href: '/sell/tutorials',
  },
  {
    title: 'Get Help',
    href: '/sell/help',
  },
  {
    title: 'Settings',
    href: '/settings',
  },
];

/**
 * List of quick links to sell pages and actions
 * @returns A card containing the links
 */
export function SellerQuickLinksCard() {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col">
        <div className="mb-4">
          <h2 className="font-heading font-bold text-ink">Navigation</h2>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {QUICK_LINKS.map((link) => (
            <Button
              variant="link"
              asChild
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
