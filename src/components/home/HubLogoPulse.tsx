'use client';

import Image from 'next/image';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Props for the hub logo component
 */
export interface HubLogoPulseProps extends React.HTMLAttributes<HTMLDivElement> {
  imgSrc?: string;
  imgAlt?: string;
  imgClassName?: string;
  pulseDuration?: string;
  imgWidth?: number;
  imgHeight?: number;
}

/**
 * A circular logo container with a lime-colored pulse animation.
 * @param props - Component properties.
 * @param props.className - Classes for the outer container.
 * @param props.imgSrc - Source path for the logo image.
 * @param props.imgAlt - Alt text for the logo.
 * @param props.imgClassName - Classes for the Image component.
 * @param props.pulseDuration - CSS duration for the pulse (e.g., "3s").
 * @param props.imgWidth - Pixel width of the logo.
 * @param props.imgHeight - Pixel height of the logo.
 * @param props.children - Optional override for the image content.
 * @param props.style - Inline styles for the container.
 * @param props... - Attributes passed to the root div.
 * @returns The animated logo component
 */
export function HubLogoPulse({
  className,
  imgSrc = '/icons/logo.png',
  imgAlt = 'Hub Logo',
  imgClassName,
  pulseDuration = '3s',
  imgWidth = 36,
  imgHeight = 36,
  children,
  style,
  ...props
}: HubLogoPulseProps) {
  return (
    <>
      {/* Unified pulse keyframes injected globally for this component */}
      <style suppressHydrationWarning>{`
        @keyframes pulse-lime {
          0%   { box-shadow: 0 0 0 0 rgba(164, 199, 57, 0.5); }
          70%  { box-shadow: 0 0 0 14px rgba(164, 199, 57, 0); }
          100% { box-shadow: 0 0 0 0 rgba(164, 199, 57, 0); }
        }
      `}</style>

      <div
        className={cn('flex flex-col items-center justify-center rounded-full z-10', className)}
        style={{
          background: 'var(--color-deep-forest, #2A4B28)', // Fallback if tailwind class isn't used
          animation: `pulse-lime ${pulseDuration} infinite`,
          ...style,
        }}
        {...props}
      >
        {children ? (
          children
        ) : (
          <Image
            src={imgSrc}
            alt={imgAlt}
            width={imgWidth}
            height={imgHeight}
            className={cn('object-contain', imgClassName)}
          />
        )}
      </div>
    </>
  );
}
