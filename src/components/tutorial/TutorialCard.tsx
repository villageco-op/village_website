'use client';

import { Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Tutorial } from '@/config/tutorials';

interface TutorialCardProps {
  tutorial: Tutorial;
  isRunning: boolean;
  onStart: (id: string) => void;
  onEnd: () => void;
}

/**
 * Isolated Card component for individual tutorials.
 * @param props - Component props
 * @param props.tutorial - The tutorial
 * @param props.isRunning - Is the tutorial currently running
 * @param props.onStart - When the start button is clicked
 * @param props.onEnd - When the stop button is clicked
 * @returns A card with the tutorial name, description, and start button
 */
export default function TutorialCard({ tutorial, isRunning, onStart, onEnd }: TutorialCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{tutorial.title}</CardTitle>
        <CardDescription className="mt-1 leading-relaxed">{tutorial.description}</CardDescription>
      </CardHeader>

      <CardFooter className="mt-auto flex items-center justify-between p-4 pt-3">
        <span className="text-[11px] font-medium text-ink-3">{tutorial.steps.length} steps</span>

        {isRunning ? (
          <Button variant="destructive" size="sm" onClick={onEnd} className="h-8">
            Stop Tutorial
          </Button>
        ) : (
          <Button
            variant="forest"
            size="sm"
            onClick={() => onStart(tutorial.id)}
            className="h-8 gap-1"
          >
            <Play className="h-3 w-3 fill-current" />
            Start
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
