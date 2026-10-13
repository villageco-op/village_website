import { Suspense } from 'react';

import LoginClient from '../../../components/login/LoginClient';

import LoadingSkeleton from '@/components/ui/loading-skeleton';

/**
 * Login page for user login and account creation.
 * @returns html page
 */
export default function Login() {
  return (
    <main className="flex flex-col bg-primary w-full min-h-screen relative">
      <Suspense
        fallback={<LoadingSkeleton heights={['h-8', 'h-64', 'h-6']} className="bg-primary" />}
      >
        <LoginClient />
      </Suspense>
    </main>
  );
}
