'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Alignment for a node.
 */
export type Align = 'left' | 'right' | 'center';

/**
 * Node data for the diagram node.
 */
export interface NodeData {
  icon: string;
  title: string;
  role: string;
  bgClass?: string;
}

/**
 * Props for the diagram node including the node data and it's alignment.
 */
export interface DiagramNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  data: NodeData;
  align?: Align;
}

/**
 * A stylized node for flowcharts or diagrams, supporting left/right alignment.
 * @param props - Component properties.
 * @param props.data - Object containing icon, title, and role strings.
 * @param props.align - Content alignment: "left", "right", or "center".
 * @param props.className - Classes for the node container.
 * @param props... - Attributes passed to the root div.
 * @returns The diagram node component
 */
export function DiagramNode({ data, align = 'left', className, ...props }: DiagramNodeProps) {
  const isRight = align === 'right';

  return (
    <div
      className={cn(
        'group relative flex items-center gap-3.5 w-65 p-[18px_20px] bg-off-white',
        'border-[1.5px] border-cream-dark rounded-xl cursor-default transition-all duration-300',
        'shadow-[0_3px_18px_rgba(42,75,40,0.06)] hover:border-lime hover:scale-[1.02] hover:shadow-[0_8px_28px_rgba(42,75,40,0.12)]',
        isRight ? 'flex-row-reverse text-right' : 'flex-row text-left',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'flex items-center justify-center w-11 h-11 shrink-0 rounded-[10px] text-xl transition-transform group-hover:scale-110 duration-300',
          data.bgClass || 'bg-lime-pale',
        )}
      >
        {data.icon}
      </div>
      <div className="flex flex-col">
        <div className="font-heading text-[0.86rem] font-bold text-ink leading-tight">
          {data.title}
        </div>
        <div className="font-sans text-[0.72rem] text-ink-3 mt-0.5">{data.role}</div>
      </div>
    </div>
  );
}
