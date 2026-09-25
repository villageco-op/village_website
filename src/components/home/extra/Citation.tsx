'use client';

import { ExternalLink } from 'lucide-react';
import { useRef, useState } from 'react';

import { Card } from '@/components/ui/card';

interface CitationProps {
  id: number;
  label: string;
  url: string;
}

/**
 * Simple inline academic citation marker [N] with hovering reference card.
 * @param props - Component props
 * @param props.id - The citation Id
 * @param props.label - The citation label
 * @param props.url - The citation source url
 * @returns An inline citation marker [N]
 */
export function Citation({ id, label, url }: CitationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-lime font-bold font-mono text-sm px-1 hover:underline cursor-pointer focus:outline-none"
      >
        [{id}]
      </button>

      {isOpen && (
        <Card className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-72 shadow-xl border-lime/30 bg-deep-forest text-cream rounded-lg p-3 text-xs leading-relaxed animate-in fade-in duration-150 after:absolute after:-bottom-4 after:left-0 after:h-4 after:w-full">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-lime font-semibold shrink-0">Source [{id}]:</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/90 hover:text-white underline break-all inline-flex items-center gap-1"
            >
              <span>{label}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        </Card>
      )}
    </span>
  );
}
