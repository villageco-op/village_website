'use client';

import { Mail, User as UserIcon } from 'lucide-react';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import type {
  OrderDetailResponseBuyer,
  OrderDetailResponseSeller,
} from '@/lib/api/generated/models';

interface OrderUserCardProps {
  title: string;
  user: OrderDetailResponseBuyer | OrderDetailResponseSeller;
  role: 'buyer' | 'seller';
}

/**
 * A card for displaying the buyer or seller user information.
 * @param props - Component props
 * @param props.title - The display title
 * @param props.user - The user object
 * @param props.role - Buyer or seller
 * @returns A simple card displaying basic user information
 */
export function OrderUserCard({ title, user, role }: OrderUserCardProps) {
  if (!user) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 font-heading text-[0.95rem] font-bold text-ink border-b border-border/50 pb-3">
          {title}
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-border/50 flex items-center justify-center">
              {user.image ? (
                <Image src={user.image} alt={user.name || role} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-200 text-sm font-bold text-ink-2">
                  {user.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <UserIcon className="h-5 w-5 text-ink-3" />
                  )}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-ink-3 mb-0.5 capitalize">{role} Name</p>
              <p className="font-semibold text-sm text-ink">{user.name || 'Anonymous'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-border/30">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-ink-3">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-ink-3 mb-0.5">Email</p>
              <p className="font-medium text-sm text-ink break-all">
                {user.email ? (
                  <a href={`mailto:${user.email}`} className="text-lime-700 hover:underline">
                    {user.email}
                  </a>
                ) : (
                  'Not provided'
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
