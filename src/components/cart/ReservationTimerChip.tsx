'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface ReservationTimerChipProps {
  sellerName: string | null;
  expiresAt: number;
}

/**
 * A timer for showing the cart expiration tick down.
 * @param props - Props for the timer
 * @param props.sellerName - The seller name
 * @param props.expiresAt - The cart group expiration time
 * @returns A small timer component
 */
export function ReservationTimerChip({ sellerName, expiresAt }: ReservationTimerChipProps) {
  const [timeLeft, setTimeLeft] = useState(15 * 60000);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(Math.max(0, expiresAt - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (timeLeft <= 0) return null;

  const mins = Math.floor(timeLeft / 60000);
  const secs = Math.floor((timeLeft % 60000) / 1000);
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  const statusClass =
    timeLeft < 60000 // Less than 1 minute (urgent)
      ? 'bg-[#c0392b]/20 text-[#FF7B6B] border-[#c0392b]/35 animate-[pulse_1s_ease-in-out_infinite]'
      : timeLeft < 300000 // Less than 5 minutes (warning)
        ? 'bg-[#f5a800]/15 text-[#f5a800] border-[#f5a800]/30'
        : 'bg-[#a4c739]/15 text-[#a4c739] border-[#a4c739]/25'; // Plenty of time

  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 font-heading text-[11.5px] font-bold transition-colors',
        statusClass,
      )}
    >
      <div className="h-1.5 w-1.5 rounded-full bg-current" />
      <span className="max-w-25 truncate">{sellerName || 'Seller'}</span>
      <span className="font-mono tabular-nums tracking-wide">{timeStr}</span>
    </div>
  );
}
