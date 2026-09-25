'use client';

import { ExternalLink, BookOpen } from 'lucide-react';
import { useState, useRef } from 'react';

import { Card, CardContent } from '@/components/ui/card';

interface CitationProps {
  id: number;
  label: string;
  url: string;
}

interface DefinitionTermProps {
  term: string;
  definition: string;
  citation: CitationProps;
}

/**
 * A definition popup for defining a term with a citation.
 * @param props - Component props
 * @param props.term - The term being defined
 * @param props.definition - The definition
 * @param props.citation - The citation id, label, and url
 * @returns A relative card containing the definition
 */
export function DefinitionTerm({ term, definition, citation }: DefinitionTermProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [wasClicked, setWasClicked] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!wasClicked) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  const handleClick = () => {
    setIsOpen((prev) => {
      const next = !prev;
      setWasClicked(next);
      return next;
    });
  };

  return (
    <span
      className="inline-block relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={handleClick}
        className="underline underline-offset-4 decoration-lime decoration-2 font-semibold text-deep-forest hover:text-forest-dark transition-colors cursor-pointer focus:outline-none"
        aria-expanded={isOpen}
      >
        {term}
        <sup className="ml-0.5 text-xs text-lime font-bold font-mono">[{citation.id}]</sup>
      </button>

      {/* Academic Definition Callout / Card */}
      {isOpen && (
        <Card className="absolute left-0 top-full mt-2 z-50 w-80 shadow-xl border-lime/30 bg-white text-deep-forest rounded-lg p-0 overflow-visible text-left animate-in fade-in duration-150 before:absolute before:-top-4 before:left-0 before:h-4 before:w-full">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-forest-dark/70 border-b border-gray-100 pb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-lime" />
              Definition [{citation.id}]
            </div>
            <p className="text-sm font-sans text-deep-forest leading-snug">
              <span className="font-semibold">{term}: </span>
              {definition}
            </p>
            <div className="pt-1 border-t border-gray-100 text-xs">
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-forest-dark hover:text-lime hover:underline font-mono"
              >
                <span>Source: {citation.label}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </span>
  );
}
