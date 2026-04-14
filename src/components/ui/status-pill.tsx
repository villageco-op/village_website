'use client';

import { cn } from '@/lib/utils';

interface StatusPillProps {
  status: string | null;
  variant?: 'lime' | 'sun' | 'clay' | 'forest' | 'red';
}

export function StatusPill({ status, variant }: StatusPillProps) {
  const displayStatus = status || 'Unknown';
  const lowerStatus = displayStatus.toLowerCase();

  let style = { bg: 'bg-gray-100', text: 'text-gray-700' };

  if (variant === 'lime' || lowerStatus.includes('delivered') || lowerStatus.includes('ready') || lowerStatus.includes('completed')) {
    style = { bg: 'bg-lime/30', text: 'text-green-800' };
  } else if (variant === 'sun' || lowerStatus.includes('pending') || lowerStatus.includes('processing')) {
    style = { bg: 'bg-sun/30', text: 'text-yellow-900' };
  } else if (variant === 'clay' || lowerStatus.includes('canceled') || lowerStatus.includes('failed')) {
    style = { bg: 'bg-clay/10', text: 'text-red-900' };
  } else if (variant === 'forest') {
    style = { bg: 'bg-deep-forest/10', text: 'text-deep-forest' };
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-heading text-[0.65rem] font-bold uppercase tracking-wider',
        style.bg,
        style.text
      )}
    >
      <span className="h-1.25 w-1.25 rounded-full bg-current" />
      {displayStatus}
    </span>
  );
}
