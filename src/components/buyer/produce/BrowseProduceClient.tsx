'use client';

import { useState } from 'react';

import BrowseProduceListClient from './produce-list/BrowseProduceListClient';
import BrowseProduceMapClient from './produce-map/BrowseProduceMapClient';

import { PageHeader } from '@/components/ui/page-header';
import { useAuth } from '@/hooks/useAuth';

/**
 * The browse produce page. Handles switching between list and map view.
 * @returns A page client with a header and produce filters and results
 */
export default function BrowseProduceClient() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const { user } = useAuth();

  return (
    <div className="flex w-full flex-col p-6 sm:p-8 space-y-6 max-w-max-width mx-auto min-h-screen">
      <PageHeader
        title="Browse Produce"
        subtitle="Fresh listings from nearby growers · Updated daily"
      />

      {view === 'list' ? (
        <BrowseProduceListClient onViewChange={setView} />
      ) : (
        <BrowseProduceMapClient onViewChange={setView} user={user} />
      )}
    </div>
  );
}
