'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';

import {
  type Tutorial,
  type TutorialStep,
  TUTORIALS as DEFAULT_TUTORIALS,
  DISALLOWED_TUTORIAL_ROUTES as DEFAULT_DISALLOWED_ROUTES,
} from '@/config/tutorials';

interface TutorialContextType {
  activeTutorial: Tutorial | null;
  currentStepIndex: number;
  currentStep: TutorialStep | null;
  startTutorial: (id: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  endTutorial: () => void;
  isOnboardingCompleted: boolean;
  completeOnboarding: () => void;
  disallowedRoutes: string[];
  tutorials: Record<string, Tutorial>;
}

interface TutorialProviderProps {
  children: React.ReactNode;
  /** Optional custom tutorials map (defaults to config/tutorials) */
  tutorials?: Record<string, Tutorial>;
  /** Optional disallowed routes array (defaults to config/tutorials) */
  disallowedRoutes?: string[];
  /** Optional default tutorial key to auto-start for onboarding */
  defaultTutorialId?: string;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

/**
 * Provider allowing global tutorial state tracking and controls.
 * @param props - Component props
 * @param props.children - Children components
 * @param props.tutorials - Optional tutorial override
 * @param props.disallowedRoutes - Optional disallowed routes override
 * @param props.defaultTutorialId - Optional defualt tutorial step override
 * @returns The provider wrapping the children
 */
export function TutorialProvider({
  children,
  tutorials = DEFAULT_TUTORIALS,
  disallowedRoutes = DEFAULT_DISALLOWED_ROUTES,
  defaultTutorialId = 'overview',
}: TutorialProviderProps) {
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(() => {
    if (typeof window !== 'undefined') {
      const cachedId = localStorage.getItem('active_tutorial_id');
      return cachedId && tutorials[cachedId] ? tutorials[cachedId] : null;
    }
    return null;
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const cachedStep = localStorage.getItem('active_tutorial_step');
      return cachedStep ? parseInt(cachedStep, 10) : 0;
    }
    return 0;
  });

  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('onboarding_completed') === 'true';
    }
    return false;
  });

  const router = useRouter();
  const pathname = usePathname();

  const saveTutorialState = (tutorial: Tutorial | null, stepIndex: number) => {
    if (typeof window !== 'undefined') {
      if (tutorial) {
        localStorage.setItem('active_tutorial_id', tutorial.id);
        localStorage.setItem('active_tutorial_step', stepIndex.toString());
      } else {
        localStorage.removeItem('active_tutorial_id');
        localStorage.removeItem('active_tutorial_step');
      }
    }
  };

  const startTutorial = useCallback(
    (id: string) => {
      const tutorial = tutorials[id];
      if (!tutorial) return;

      setActiveTutorial(tutorial);
      setCurrentStepIndex(0);
      saveTutorialState(tutorial, 0);

      const firstStep = tutorial.steps[0];
      if (firstStep && pathname !== firstStep.targetRoute) {
        router.push(firstStep.targetRoute);
      }
      toast.success(`Starting: ${tutorial.title}`);
    },
    [tutorials, pathname, router],
  );

  const nextStep = () => {
    if (!activeTutorial) return;
    const nextIndex = currentStepIndex + 1;

    if (nextIndex >= activeTutorial.steps.length) {
      endTutorial();
      toast.success(`Completed: ${activeTutorial.title}`);
    } else {
      setCurrentStepIndex(nextIndex);
      saveTutorialState(activeTutorial, nextIndex);
      const nextStepObj = activeTutorial.steps[nextIndex];
      if (nextStepObj && pathname !== nextStepObj.targetRoute) {
        router.push(nextStepObj.targetRoute);
      }
    }
  };

  const prevStep = () => {
    if (!activeTutorial || currentStepIndex === 0) return;
    const prevIndex = currentStepIndex - 1;

    setCurrentStepIndex(prevIndex);
    saveTutorialState(activeTutorial, prevIndex);
    const prevStepObj = activeTutorial.steps[prevIndex];
    if (prevStepObj && pathname !== prevStepObj.targetRoute) {
      router.push(prevStepObj.targetRoute);
    }
  };

  const endTutorial = () => {
    setActiveTutorial(null);
    setCurrentStepIndex(0);
    saveTutorialState(null, 0);
  };

  const completeOnboarding = () => {
    setIsOnboardingCompleted(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding_completed', 'true');
    }
    if (tutorials[defaultTutorialId]) {
      startTutorial(defaultTutorialId);
    }
  };

  const currentStep = activeTutorial ? activeTutorial.steps[currentStepIndex] : null;

  return (
    <TutorialContext.Provider
      value={{
        activeTutorial,
        currentStepIndex,
        currentStep,
        startTutorial,
        nextStep,
        prevStep,
        endTutorial,
        isOnboardingCompleted,
        completeOnboarding,
        disallowedRoutes,
        tutorials,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

/**
 * Hook for accessing the tutorial context.
 * @returns The tutorial context
 */
export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}
