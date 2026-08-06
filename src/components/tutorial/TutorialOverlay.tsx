'use client';

import {
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Minimize2,
  Maximize2,
  AlertTriangle,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { useTutorial } from '../providers/TutorialProvider';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Tutorial instructions and controls. It is an overlay in the bottom right corner.
 * @returns The overlay card component
 */
export function TutorialOverlay() {
  const {
    activeTutorial,
    currentStepIndex,
    currentStep,
    nextStep,
    prevStep,
    endTutorial,
    disallowedRoutes,
  } = useTutorial();
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!activeTutorial || !currentStep) return null;

  const isDisallowedPage = disallowedRoutes.some((route) => pathname.startsWith(route));

  if (isDisallowedPage) return null;

  const totalSteps = activeTutorial.steps.length;
  const isCorrectPage = pathname === currentStep.targetRoute;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm shadow-2xl transition-all duration-300 print:hidden">
      <Card className="border-2 border-forest shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-forest" />
            <CardTitle className="text-sm font-bold tracking-tight">
              {activeTutorial.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Minimize Tutorial"
              className="h-6 w-6"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <Maximize2 className="h-3.5 w-3.5" />
              ) : (
                <Minimize2 className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close Tutorial"
              className="h-6 w-6"
              onClick={endTutorial}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isCollapsed && (
          <>
            <CardContent className="p-4 pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-forest uppercase tracking-wider">
                  Step {currentStepIndex + 1} of {totalSteps}
                </span>
                <span className="text-xs text-ink-3">
                  Location:{' '}
                  <code className="bg-muted px-1 py-0.5 rounded">{currentStep.targetRoute}</code>
                </span>
              </div>

              <h4 className="text-xs font-bold text-ink">{currentStep.title}</h4>
              <p className="text-xs text-ink-3 leading-relaxed">{currentStep.content}</p>

              {!isCorrectPage && (
                <div className="rounded-md bg-amber-50 p-2.5 border border-amber-200 flex flex-col gap-2">
                  <div className="flex items-start gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800 leading-tight">
                      You are currently on a different page.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs w-full text-amber-900 border-amber-300 bg-white hover:bg-amber-100"
                    onClick={() => router.push(currentStep.targetRoute)}
                  >
                    Go to {currentStep.targetRoute}
                  </Button>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex items-center justify-between p-4 pt-2 border-t border-muted/40">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="h-8 gap-1 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back
              </Button>

              <Button variant="default" size="sm" onClick={nextStep} className="h-8 gap-1">
                {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </CardFooter>
          </>
        )}

        {isCollapsed && (
          <div className="px-4 pb-4 pt-1 flex justify-between items-center text-xs text-ink-3">
            <span>
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsCollapsed(false)}
              className="h-auto p-0 text-forest font-semibold"
            >
              Expand Instructions
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
