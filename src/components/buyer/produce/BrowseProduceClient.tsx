'use client';

import { useState } from 'react';

import BrowseProduceListClient from './produce-list/BrowseProduceListClient';
import BrowseProduceMapClient from './produce-map/BrowseProduceMapClient';

import { useAuth } from '@/hooks/useAuth';

/**
 * The browse produce page. Handles switching between list and map view.
 * @returns A page client with a header and produce filters and results
 */
export default function BrowseProduceClient() {
  const [view, setView] = useState<'list' | 'map'>('map');
  const { user } = useAuth();

  return (
    <div
      className={
        view === 'map'
          ? 'flex flex-1 flex-col w-full max-w-max-width mx-auto p-6 sm:p-8 overflow-hidden h-[calc(100dvh-64px)] '
          : 'flex flex-col w-full max-w-max-width mx-auto p-6 sm:p-8 space-y-6 min-h-screen'
      }
    >
      {view === 'list' ? (
        <BrowseProduceListClient onViewChange={setView} />
      ) : (
        <BrowseProduceMapClient onViewChange={setView} user={user} />
      )}
    </div>
  );
}
