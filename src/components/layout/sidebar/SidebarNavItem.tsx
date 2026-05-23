'use client';

import Link from 'next/link';

import type { NavItem } from '../Sidebar';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Single nav item for the sidebar.
 * @param props - The item props
 * @param props.item - The nav item info
 * @param props.isActive - Is the item active
 * @param props.isCollapsed - Is the sidebar collapsed
 * @returns A Link component
 */
export default function SidebarNavItem({
  item,
  isActive,
  isCollapsed,
}: {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}) {
  return (
    <Link
      key={item.name}
      href={item.href}
      className={cn(
        'relative flex w-full items-center gap-2.5 px-4.5 py-2.25 transition-colors hover:bg-lime/5',
        isActive && 'bg-lime/10',
        isCollapsed && 'justify-center px-0',
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
      {!isCollapsed && (
        <>
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
              <span className="mt-px block font-sans text-[0.62rem] text-cream/60">{item.sub}</span>
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
        </>
      )}
    </Link>
  );
}
