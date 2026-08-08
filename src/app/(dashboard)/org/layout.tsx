'use client';

import { AuthGuard } from '@/components/auth-guard';
import { OrgSidebar } from '@/components/organization/OrgSidebar';
import { useAuth } from '@/hooks/useAuth';
import { useGetOrganization } from '@/lib/api/generated/organizations/organizations';

/**
 * Org layout wrapper that persists the left sidebar
 * across all sub-pages.
 * @param props - The component props.
 * @param props.children - Inject child elements into the body.
 * @returns HTML with children and page body.
 */
export default function OrgLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, status } = useAuth();
  const orgId = user?.organizationId ?? '';
  const {
    data: orgResult,
    isLoading,
    isError,
    refetch,
  } = useGetOrganization(orgId, {
    query: {
      enabled: !!user?.organizationId,
    },
  });

  const orgError = isError || orgResult?.status !== 200 || !orgResult.data;
  const org = !orgError ? orgResult.data : undefined;

  return (
    <AuthGuard user={user} status={status} requireOrganization>
      <div className="flex min-h-[calc(100vh-64px)] w-full bg-off-white">
        <aside className="print:hidden">
          <OrgSidebar
            user={user}
            status={status}
            org={org}
            isLoading={isLoading}
            isError={orgError}
            onRefetch={() => void refetch()}
          />
        </aside>
        <main className="flex-1 px-9 py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
