'use client';

import { Bell } from 'lucide-react';

import type { Role } from './OnboardingClient';

import { Button } from '@/components/ui/button';

/**
 * Props for the NotificationsStep component.
 */
interface NotificationsStepProps {
  role: Role;
  onEnable: () => void;
  onSkip: () => void;
}

/**
 * A onboarding step that requests push notification permissions.
 * Tailors the value proposition based on whether the user is a buyer or seller.
 * @param props - Component properties.
 * @param props.role - The current user role used to customize the messaging.
 * @param props.onEnable - Callback triggered when the user opts into notifications.
 * @param props.onSkip - Callback triggered when the user bypasses this step.
 * @returns A centered layout with role-specific notification benefits and action buttons.
 */
export default function NotificationsStep({ role, onEnable, onSkip }: NotificationsStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col items-center text-center py-8">
      <div className="w-20 h-20 bg-sun-light text-sun rounded-full flex items-center justify-center mb-6">
        <Bell className="w-10 h-10" />
      </div>
      <h2 className="font-heading text-2xl font-bold text-deep-forest">Stay in the loop</h2>
      <p className="font-sans text-ink-3 mt-3 max-w-sm">
        {role === 'buyer'
          ? 'Get notified immediately when fresh, local produce drops in your area before it sells out.'
          : 'Get real-time alerts when you receive a new order or a message from a buyer.'}
      </p>

      <div className="mt-10 w-full space-y-3">
        <Button
          onClick={onEnable}
          className="w-full h-12 bg-lime text-forest-dark hover:bg-lime-light font-bold text-md"
        >
          Enable Push Notifications
        </Button>
        <Button
          onClick={onSkip}
          variant="ghost"
          className="w-full text-ink-3 hover:text-ink hover:bg-black/5"
        >
          Not right now
        </Button>
      </div>
    </div>
  );
}
