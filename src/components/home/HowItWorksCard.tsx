'use client';

import Image from 'next/image';
import * as React from 'react';

import { cn, getAssetPath } from '@/lib/utils';

/**
 * The propts for the how it works card including an image, title and description.
 */
export interface HowItWorksCardProps extends React.ComponentPropsWithoutRef<'div'> {
  imageSrc: string;
  title: string;
  description: string;
}

/**
 * A feature card with a hover-triggered top border and image container.
 * @param props - Component properties.
 * @param props.className - Classes for the card container.
 * @param props.imageSrc - URL for the feature image.
 * @param props.title - Card heading text.
 * @param props.description - Body text for the card.
 * @param props... - Attributes passed to the root div.
 */
export const HowItWorksCard = React.forwardRef<HTMLDivElement, HowItWorksCardProps>(
  ({ className, imageSrc, title, description, ...props }, ref) => {
    const [hovered, setHovered] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-[14px] transition-all duration-300',
          className,
        )}
        style={{
          padding: '40px 32px',
          background: hovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
          border: hovered ? '1px solid rgba(164,199,57,0.25)' : '1px solid rgba(245,237,216,0.1)',
          transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
          transition: 'background 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...props}
      >
        {/* Animated Top Border Line */}
        <div
          className="absolute top-0 left-0 right-0 origin-left"
          style={{
            height: '3px',
            background: 'linear-gradient(90deg, var(--color-lime), var(--color-lime-light))',
            transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.4s ease',
          }}
        />

        {/* Image Container */}
        <div
          className="mb-6 rounded-lg overflow-hidden bg-black/20 relative w-full"
          style={{ aspectRatio: '16/9' }}
        >
          <Image
            src={getAssetPath(imageSrc)}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* Title */}
        <h3
          className="mb-3 text-lime-light"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.3rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-cream/50"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            lineHeight: 1.8,
          }}
        >
          {description}
        </p>
      </div>
    );
  },
);

HowItWorksCard.displayName = 'HowItWorksCard';
