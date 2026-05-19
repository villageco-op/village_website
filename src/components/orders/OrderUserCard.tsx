'use client';

import { Mail, User as UserIcon } from 'lucide-react';

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
    <Card className="rounded-xl border border-forest-dark/10 bg-white shadow-[0_2px_12px_rgba(42,75,40,0.05)]">
      <CardContent className="p-6">
        <h2 className="mb-4 font-heading text-[0.95rem] font-bold text-ink border-b border-border/50 pb-3">
          {title}
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-ink-3">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-ink-3 mb-0.5 capitalize">{role} Name</p>
              <p className="font-medium text-sm text-ink">
                {user.organization || user.name || 'Anonymous'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-ink-3">
              <Mail className="h-5 w-5" />
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
