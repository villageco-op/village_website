import { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';

/**
 * A timer that ticks down for displaying cart group expiration.
 * @param props - Cart group props
 * @param props.expiresAt - When the cart group expires
 * @returns A timer component
 */
export function CartGroupTimer({ expiresAt }: { expiresAt: number }) {
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

  const isWarning = timeLeft < 300000; // Less than 5 minutes

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-full px-2.5 py-1 font-heading text-[0.68rem] font-bold',
        isWarning ? 'bg-sun-light text-[#8a6000]' : 'bg-lime/12 text-click-green',
      )}
    >
      <span
        className={cn(
          'h-1.25 w-1.25 rounded-full bg-current',
          !isWarning && 'animate-[pulse_1.2s_ease-in-out_infinite]',
        )}
      ></span>
      {timeStr}
    </div>
  );
}
