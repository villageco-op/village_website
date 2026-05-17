import { Suspense } from 'react';

import LoginClient from '../../components/login/LoginClient';
import { LoginSkeleton } from '../../components/login/LoginSkeleton';

/**
 * Login page for user login and account creation.
 * @returns html page
 */
export default function Login() {
  return (
    <main className="flex flex-col w-full min-h-screen relative">
      <Suspense fallback={<LoginSkeleton />}>
        <LoginClient />
      </Suspense>
    </main>
  );
}
