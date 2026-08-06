import { UserCheck } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

/**
 * The already logged in page to redirect users to if they navigate to /login.
 * @returns A page with a return home button
 */
export default function AlreadyLoggedInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-off-white p-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-deep-forest">
        <UserCheck className="h-8 w-8" />
      </div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-deep-forest">
        You are already logged in
      </h1>
      <p className="mb-6 max-w-md text-ink-3">
        You are already signed into your account. To switch accounts, navigate to account settings
        and logout.
      </p>
      <div className="flex items-center gap-3">
        <Button asChild variant="outline">
          <Link href="/">Return to Home</Link>
        </Button>
        <Button asChild>
          <Link href="/settings">Account Settings</Link>
        </Button>
      </div>
    </div>
  );
}
