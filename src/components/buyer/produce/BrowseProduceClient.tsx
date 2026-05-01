'use client';

import { useState } from 'react';

import { BrowseProduceHeader } from './BrowseProduceHeader';
import BrowseProduceListClient from './produce-list/BrowseProduceListClient';
import BrowseProduceMapClient from './produce-map/BrowseProduceMapClient';

/**
 * The browse produce page. Handles switching between list and map view.
 * @returns A page client with a header and produce filters and results
 */
export default function BrowseProduceClient() {
  const [view, setView] = useState<'list' | 'map'>('list');

  return (
    <div className="flex w-full flex-col p-6 sm:p-8 space-y-6 max-w-max-width mx-auto min-h-screen">
      <BrowseProduceHeader />

      {view === 'list' ? (
        <BrowseProduceListClient onViewChange={setView} />
      ) : (
        <BrowseProduceMapClient onViewChange={setView} />
      )}
    </div>
  );
}
