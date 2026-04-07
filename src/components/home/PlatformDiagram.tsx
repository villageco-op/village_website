'use client';

import * as React from 'react';

import { DiagramNode, type NodeData } from './DiagramNode';
import { HubLogoPulse } from './HubLogoPulse';

import { cn } from '@/lib/utils';

const LEFT_NODES: NodeData[] = [
  {
    icon: '🌱',
    title: 'Producers',
    role: 'Grow food, earn weekly',
    bgClass: 'bg-lime-pale',
  },
  {
    icon: '🏠',
    title: 'Landowners',
    role: 'Share space, earn a cut',
    bgClass: 'bg-sun-light',
  },
  {
    icon: '⛪',
    title: 'Community Orgs',
    role: 'Host gardens + distribute',
    bgClass: 'bg-lime-pale',
  },
];

const RIGHT_NODES: NodeData[] = [
  {
    icon: '🏪',
    title: 'Restaurants',
    role: 'Buy fresh & local',
    bgClass: 'bg-lime-pale',
  },
  {
    icon: '🚚',
    title: 'Logistics Members',
    role: 'Move & store produce',
    bgClass: 'bg-[rgba(160,82,45,0.12)]',
  },
  {
    icon: '🏘️',
    title: 'Households',
    role: 'Buy from neighbors',
    bgClass: 'bg-sun-light',
  },
];

/**
 * Platform diagram props.
 */
export interface PlatformDiagramProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * An animated diagram of village as a whole.
 * @param props - Class name override and props
 * @param props.className - CSS override
 * @param ...props - Spread of platform diagram props extending HTMLElement attributes
 * @returns The component html
 */
export function PlatformDiagram({ className, ...props }: PlatformDiagramProps) {
  return (
    <section className={cn('bg-cream py-25 relative', className)} {...props}>
      {/* Required custom keyframes for the bespoke animations */}
      <style suppressHydrationWarning>{`
        @keyframes pulse-lime {
          0%, 100% { box-shadow: 0 8px 40px rgba(42,75,40,0.3), 0 0 0 14px rgba(164,199,57,0.08); }
          50% { box-shadow: 0 8px 40px rgba(42,75,40,0.3), 0 0 0 20px rgba(164,199,57,0.15); }
        }
        @keyframes dash-flow {
          to { stroke-dashoffset: -8; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Decorative Background Circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full border border-deep-forest/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-250 h-250 rounded-full border border-deep-forest/3 pointer-events-none" />

      <div className="hidden lg:flex relative w-240 mx-auto justify-between items-center h-69 z-10">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 960 276"
          fill="none"
        >
          <defs>
            <marker
              id="arrowhead-right"
              markerWidth="6"
              markerHeight="6"
              refX="4"
              refY="3"
              orient="auto"
            >
              <path d="M 0 0 L 6 3 L 0 6 z" fill="var(--color-lime)" />
            </marker>
          </defs>

          {/* Left-side paths (flowing into the hub) */}
          <g
            stroke="var(--color-lime)"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="animate-[dash-flow_1s_linear_infinite]"
            markerEnd="url(#arrowhead-right)"
          >
            {/* Top Left */}
            <path d="M 260 40 C 345 40, 345 138, 420 138" />
            {/* Mid Left */}
            <path d="M 260 138 L 420 138" />
            {/* Bot Left */}
            <path d="M 260 236 C 345 236, 345 138, 420 138" />
          </g>

          {/* Right-side paths (flowing out of the hub) */}
          <g
            stroke="var(--color-lime)"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="animate-[dash-flow_1s_linear_infinite]"
            markerEnd="url(#arrowhead-right)"
          >
            {/* Top Right */}
            <path d="M 540 138 C 615 138, 615 40, 690 40" />
            {/* Mid Right */}
            <path d="M 540 138 L 690 138" />
            {/* Bot Right */}
            <path d="M 540 138 C 615 138, 615 236, 690 236" />
          </g>
        </svg>

        <div className="flex flex-col gap-4.5 w-85 relative z-20">
          {LEFT_NODES.map((node, i) => (
            <div
              key={node.title}
              className="px-10 -mx-10 animate-[fade-in-up_0.6s_ease-out_both]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <DiagramNode data={node} align="left" />
            </div>
          ))}
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <HubLogoPulse
            className="w-25 h-25 bg-deep-forest"
            imgClassName="w-16 h-16"
            pulseDuration="4s"
          />
        </div>

        <div className="flex flex-col gap-4.5 w-75 relative z-20 items-end">
          {RIGHT_NODES.map((node, i) => (
            <div
              key={node.title}
              className="px-10 -mx-10 animate-[fade-in-up_0.6s_ease-out_both]"
              style={{ animationDelay: `${(i + 3) * 100}ms` }}
            >
              <DiagramNode data={node} align="right" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex lg:hidden flex-col items-center gap-10 relative z-10 w-full px-4">
        <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-0 border-l-2 border-dashed border-lime-light -z-10" />

        <div className="flex flex-col gap-4">
          {LEFT_NODES.map((node) => (
            <DiagramNode
              key={node.title}
              data={node}
              align="left"
              className="mx-auto w-full max-w-[320px]"
            />
          ))}
        </div>

        <HubLogoPulse
          className="w-22.5 h-22.5 bg-deep-forest shadow-lg z-20"
          imgClassName="w-16 h-16"
          pulseDuration="4s"
        />

        <div className="flex flex-col gap-4">
          {RIGHT_NODES.map((node) => (
            <DiagramNode
              key={node.title}
              data={node}
              align="right"
              className="mx-auto w-full max-w-[320px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
