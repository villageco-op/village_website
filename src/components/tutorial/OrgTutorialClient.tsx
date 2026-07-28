'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { useTutorial } from '../providers/TutorialProvider';

import TutorialCard from './TutorialCard';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import type { Tutorial } from '@/config/tutorials';

/**
 * The tutorial page with cards for starting the tutorials.
 * @returns The client page component
 */
export default function OrgTutorialClient() {
  const { startTutorial, endTutorial, activeTutorial, tutorials } = useTutorial();

  const groupedTutorials = useMemo(() => {
    const list = Object.values(tutorials);

    return list.reduce<Record<string, Tutorial[]>>((acc, tutorial) => {
      const category = tutorial.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tutorial);
      return acc;
    }, {});
  }, [tutorials]);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-bold text-ink">Tutorials</h1>
        <p className="text-sm text-ink-3">
          Step-by-step guides on client & organization management.
        </p>
      </div>

      {/* Render tutorials grouped by category */}
      <div className="space-y-8">
        {Object.entries(groupedTutorials).map(([category, categoryTutorials]) => (
          <section key={category} className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">{category}</h2>

            <div className="grid gap-4 md:grid-cols-2">
              {categoryTutorials.map((tutorial) => (
                <TutorialCard
                  key={tutorial.id}
                  tutorial={tutorial}
                  isRunning={activeTutorial?.id === tutorial.id}
                  onStart={startTutorial}
                  onEnd={endTutorial}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Additional Help Card */}
      <Card>
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold text-ink">
              Need additional assistance?
            </CardTitle>
            <CardDescription className="text-sm text-ink-3">
              Didn&apos;t find what you were looking for? Visit our support page to ask a question.
            </CardDescription>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/org/help/">Get Help</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
