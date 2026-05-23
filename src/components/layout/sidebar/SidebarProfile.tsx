'use client';

import { ExternalLink, LogIn } from 'lucide-react';
import Link from 'next/link';

import type { SidebarProps } from '../Sidebar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/user-utils';
import { cn } from '@/lib/utils';

/**
 * Profile section for the sidebar.
 * @param props - The sidebar props
 * @param props.user - The user object
 * @param props.roleLabel - The users role (e.g., buyer, seller, delivery)
 * @param props.settingsHref - The path to the settings page
 * @param props.publicProfileBaseUrl - The base for the public profile page (e.g., /buyer, /seller)
 * @param props.fallbackName - The display name when user.name is missing
 * @param props.isCollapsed - Is the sidebar collapsed
 * @returns A profile icon with a link
 */
export default function SidebarProfile({
  user,
  roleLabel,
  settingsHref,
  publicProfileBaseUrl,
  fallbackName = 'User',
  isCollapsed,
}: Omit<SidebarProps, 'navGroups'> & { isCollapsed: boolean }) {
  if (!user) {
    return (
      <div className="flex justify-center border-b border-white/5 p-[20px_14px_16px]">
        <Button
          asChild
          size={isCollapsed ? 'icon' : 'sm'}
          className={cn(
            'bg-lime font-heading font-bold text-forest-dark transition-transform hover:-translate-y-px hover:bg-lime-light',
            isCollapsed ? 'h-9 w-9 rounded-full' : 'w-full text-xs',
          )}
        >
          <Link href="/login" className="flex items-center justify-center gap-1.5">
            {isCollapsed ? (
              <>
                <LogIn size={16} />
                <span className="sr-only">Log In</span>
              </>
            ) : (
              <>Get involved &rarr;</>
            )}
          </Link>
        </Button>
      </div>
    );
  }

  const userImage = user.image;
  const userName = user.name || fallbackName;

  return (
    <div className="group relative flex items-center gap-2.75 border-b border-white/5 p-[20px_18px_16px] transition-colors hover:bg-white/5">
      <Link href={settingsHref} className="absolute inset-0 z-0" aria-label="Edit Profile" />

      <div className="pointer-events-none z-10 flex flex-1 items-center gap-2.75">
        <Avatar className="h-9 w-9 bg-lime">
          {userImage && <AvatarImage src={userImage} alt={userName} className="object-cover" />}
          <AvatarFallback className="bg-transparent font-heading text-xs font-extrabold text-deep-forest">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="flex-1 overflow-hidden">
            <div className="truncate font-heading text-[0.8rem] font-bold leading-[1.2] text-cream">
              {userName}
            </div>
            <div className="truncate font-sans text-[0.68rem] text-lime-light/70">{roleLabel}</div>
          </div>
        )}
      </div>

      {user.id && publicProfileBaseUrl && (
        <Button
          asChild
          variant="ghost"
          size="icon"
          title="View Public Profile"
          className="relative z-20 h-6 w-6 shrink-0 rounded-md text-lime-light/40 hover:bg-lime/20 hover:text-lime-light"
        >
          <Link
            href={`${publicProfileBaseUrl}/${user.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="sr-only">View Public Profile</span>
          </Link>
        </Button>
      )}
    </div>
  );
}
