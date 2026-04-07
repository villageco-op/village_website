import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Props for the HeroSectionHeader component.
 * Extends standard HTML div attributes but omits 'title' to allow for ReactNode input.
 */
export interface HeroSectionHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}

/**
 * A bold hero header component featuring fluid typography, an animated "ping" indicator,
 * and high-contrast styling optimized for dark layouts.
 * @param props - Component properties.
 * @param props.eyebrow - Small uppercase text above the title with a live pulse indicator.
 * @param props.title - The primary headline using fluid 'clamp' typography.
 * @param props.description - Supporting subtext with constrained width for readability.
 * @param props.className - Additional CSS classes for the container.
 * @returns The rendered hero section header.
 */
export function HeroSectionHeader({
  eyebrow,
  title,
  description,
  className,
  ...props
}: HeroSectionHeaderProps) {
  return (
    <div className={cn('flex flex-col items-start', className)} {...props}>
      {/* Eyebrow with Ping Indicator */}
      {eyebrow && (
        <div className="inline-flex items-center gap-2 mb-7 bg-lime/12 border border-lime/28 rounded-full px-4 py-1.5 font-heading text-[0.7rem] font-bold tracking-widest uppercase text-lime w-fit">
          <div className="relative flex h-1.75 w-1.75">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.75 w-1.75 bg-lime"></span>
          </div>
          {eyebrow}
        </div>
      )}

      {/* Main Title (H1) */}
      <h1 className="font-heading text-[clamp(2.8rem,4.4vw,4.1rem)] font-extrabold leading-[1.1] tracking-[-0.035em] text-cream mb-6">
        {title}
      </h1>

      {/* Description / Subtitle */}
      {description && (
        <p className="font-sans text-base leading-[1.82] text-cream/65 max-w-115 mb-10">
          {description}
        </p>
      )}
    </div>
  );
}
