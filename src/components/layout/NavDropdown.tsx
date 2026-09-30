'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

import type { NavGroup } from './navConfig';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavDropdownProps {
  label?: string;
  groups: NavGroup[];
  className?: string;
}

/**
 * Dropdown for the header navigation menus.
 * @param props - Component props
 * @param props.label - The label for the dropdown
 * @param props.groups - The nav groups
 * @param props.className - CSS classname overrides
 * @returns A dropdown menu component
 */
export function NavDropdown({ label = 'Menu', groups, className }: NavDropdownProps) {
  if (groups.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`font-heading text-xs font-semibold bg-transparent hover:bg-white/5 hover:text-cream text-cream/50 aria-expanded:bg-transparent aria-expanded:text-cream/50 group-hover/dropdown:text-cream ${className ?? ''}`}
        >
          {label}
          <ChevronDown className="ml-1 h-3 w-3 transition-transform" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent variant="forest" className="mt-1">
        {groups.map((group, groupIdx) => (
          <div key={group.label || groupIdx}>
            {groupIdx > 0 && <DropdownMenuSeparator />}
            {group.label && (
              <DropdownMenuLabel className="text-xs text-cream/50 font-bold uppercase tracking-wider">
                {group.label}
              </DropdownMenuLabel>
            )}
            {group.items.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href}>{item.name}</Link>
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
