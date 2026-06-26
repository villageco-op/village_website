import { Suspense } from 'react';

import AcceptInviteClient from '@/components/accept-invite/AcceptInviteClient';
import { AcceptInviteSkeleton } from '@/components/accept-invite/AcceptInviteSkeleton';

/**
 * Page for accepting an invitation to an organization.
 * @returns The accept invite client wrapped in a suspense
 */
export default function AcceptInvitePage() {
  return (
    <main className="flex flex-col w-full min-h-screen relative">
      <Suspense fallback={<AcceptInviteSkeleton />}>
        <AcceptInviteClient />
      </Suspense>
    </main>
  );
}
