'use client';

import { Search, User, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/components/ui/state-displays';
import { useSearchReferrer } from '@/lib/api/generated/clients/clients';
import type { Referrer } from '@/lib/api/generated/models';

interface ReferralSelectorProps {
  selectedReferrer: Referrer | null;
  onSelect: (referrer: Referrer | null) => void;
}

/**
 * Component for searching and selecting a referral candidate.
 * @param props - Component props
 * @param props.selectedReferrer - The selected referring client, if any
 * @param props.onSelect - When a table row (referrer) is selected
 * @returns A component containing the search and selection functionality
 */
export function ReferralSelector({ selectedReferrer, onSelect }: ReferralSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');

  const { data: searchResponse, isFetching } = useSearchReferrer(
    { q: activeQuery },
    { query: { enabled: activeQuery.trim().length > 0 } },
  );

  const results = searchResponse?.status === 200 ? searchResponse.data?.results || [] : [];

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveQuery('');
  };

  const handleRemoveReferrer = () => {
    onSelect(null);
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-semibold text-ink-2 uppercase tracking-wide">
            Referral
          </Label>
          <p className="text-xs text-ink-3">
            Optional. Search for the client who referred this individual.
          </p>
        </div>

        {selectedReferrer ? (
          /* Selected Referrer Preview */
          <div className="flex items-center justify-between rounded-lg border border-forest/20 bg-forest/[0.02] p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest/10 text-forest">
                <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-ink">{selectedReferrer.name}</span>
                <span className="text-[10px] text-ink-3">
                  {[selectedReferrer.email, selectedReferrer.phone].filter(Boolean).join(' • ')}
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemoveReferrer}
              className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          /* Search Form & Results */
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (searchQuery.trim()) setActiveQuery(searchQuery.trim());
                    }
                  }}
                  disabled={isFetching}
                  className="h-9 pl-9 text-sm"
                />
              </div>
              <Button
                type="button"
                onClick={() => searchQuery.trim() && setActiveQuery(searchQuery.trim())}
                disabled={isFetching || !searchQuery.trim()}
                className="h-9 text-xs"
              >
                {isFetching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Search'}
              </Button>
            </div>

            {activeQuery && !isFetching && results.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 space-y-2">
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {results.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="flex items-center justify-between rounded border border-slate-100 bg-white p-2 hover:border-forest/40 transition-colors"
                    >
                      <div className="text-xs">
                        <p className="font-semibold text-ink">{candidate.name}</p>
                        <p className="text-ink-3">
                          {[candidate.email, candidate.phone].filter(Boolean).join(' • ')}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onSelect(candidate);
                          handleClearSearch();
                        }}
                        className="h-7 text-xs px-2"
                      >
                        Select
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="h-7 text-xs text-amber-900 hover:bg-amber-100/50"
                  >
                    Cancel Search
                  </Button>
                </div>
              </div>
            )}

            {/* No Results Fallback */}
            {activeQuery && !isFetching && results.length === 0 && (
              <EmptyState title="No matching client found. Try searching with a different term." />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
