'use client';

import * as React from 'react';

import { HubLogoPulse } from './HubLogoPulse';

import { cn } from '@/lib/utils';

const NETWORK_NODES = [
  { id: 'producers', icon: '🌱', label: 'Producers', sub: 'Grow & earn' },
  { id: 'landowners', icon: '🏠', label: 'Landowners', sub: 'Share & contribute' },
  { id: 'businesses', icon: '🏪', label: 'Businesses', sub: 'Buy local produce' },
  { id: 'logistics', icon: '🚚', label: 'Logistics', sub: 'Move & store' },
];

function NetworkNode({ icon, label, sub }: { icon: string; label: string; sub: string }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-cream)',
        border: hovered ? '1.5px solid var(--color-lime)' : '1.5px solid var(--color-cream-dark)',
        borderRadius: '10px',
        padding: '18px 14px',
        textAlign: 'center',
        cursor: 'default',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 6px 20px rgba(164,199,57,0.15)' : 'none',
        transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <span
        className="items-center"
        style={{ fontSize: '1.7rem', display: 'block', marginBottom: '7px', lineHeight: 1 }}
      >
        {icon}
      </span>
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--color-ink-2)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.67rem',
          color: 'var(--color-ink-3)',
          marginTop: '2px',
        }}
      >
        {sub}
      </div>
    </div>
  );
}

/**
 * Network grid props.
 */
export interface NetworkGridProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * An animated component showing the different parks of the Village ecosystem.
 * @returns The component html
 */
export const NetworkGrid = React.forwardRef<HTMLDivElement, NetworkGridProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative z-10', className)}
        style={{
          background: 'var(--color-off-white)',
          border: '1px solid rgba(42,75,40,0.1)',
          borderRadius: '16px',
          padding: '44px',
          boxShadow: '0 8px 48px rgba(42,75,40,0.08)',
        }}
        {...props}
      >
        {/* Pulse keyframes injected inline — same pattern as PlatformDiagramSection */}
        <style suppressHydrationWarning>{`
          @keyframes pulse-lime-hub {
            0%, 100% { box-shadow: 0 4px 24px rgba(42,75,40,0.3), 0 0 0 10px rgba(164,199,57,0.10); }
            50%       { box-shadow: 0 4px 24px rgba(42,75,40,0.3), 0 0 0 16px rgba(164,199,57,0.18); }
          }
        `}</style>

        {/* 2×2 node grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}
        >
          {NETWORK_NODES.map((node) => (
            <NetworkNode key={node.id} {...node} />
          ))}
        </div>

        {/* Central Hub */}
        <HubLogoPulse
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '62px',
            height: '62px',
            zIndex: 3,
            fontSize: '1.5rem',
          }}
          imgClassName="w-[36px] h-[36px]"
          pulseDuration="3s"
        />
      </div>
    );
  },
);

NetworkGrid.displayName = 'NetworkGrid';
