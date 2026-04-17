import OnboardingFlow from '../../components/pages/OnboardingClient';

/**
 * Onboarding flow that guides the user through profile setup, stripe onboarding, and enabling push notifications.
 * @returns html page
 */
export default function Onboarding() {
  return (
    <main className="flex flex-col w-full min-h-screen relative">
      <OnboardingFlow></OnboardingFlow>
    </main>
  );
}
