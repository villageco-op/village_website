import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

/**
 * Not found page.
 * @returns A page with a back button
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-off-white p-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-deep-forest">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-deep-forest">Page Not Found</h1>
      <p className="mb-6 max-w-md text-ink-3">
        We couldn&apos;t find the page you were looking for. It might have been moved or removed.
      </p>
      <Button asChild>
        <Link href="/">Go Back Home</Link>
      </Button>
    </div>
  );
}
