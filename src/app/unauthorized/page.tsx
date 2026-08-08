import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

/**
 * The general unauthorized page.
 * @returns A page with a go home and switch account button
 */
export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-off-white p-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-deep-forest">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-deep-forest">Access Denied</h1>
      <p className="mb-6 max-w-md text-ink-3">
        You don&apos;t have permission to view or access this page. Please make sure you are logged
        into the correct account.
      </p>
      <div className="flex items-center gap-3">
        <Button asChild variant="outline">
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild>
          <Link href="/settings">Account Settings</Link>
        </Button>
      </div>
    </div>
  );
}
