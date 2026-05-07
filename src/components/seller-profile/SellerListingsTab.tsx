'use client';

import { Search, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Eyebrow } from '../ui/eyebrow';
import { ProduceIcon } from '../ui/produce-icon';

import { SellerListingsTabSkeleton } from './SellerProfileSkeletons';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PaginationControls } from '@/components/ui/pagination-controls';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePagination } from '@/hooks/usePagination';
import { GetProduceListSortBy } from '@/lib/api/generated/models';
import { useGetProduceList } from '@/lib/api/generated/produce/produce';

interface SellerListingsTabProps {
  sellerId: string;
}

/**
 * The tab for viewing the sellers listings within the public profile.
 * @param props - Props for the listings tab
 * @param props.sellerId - The seller Id
 * @returns The seller listings tab component
 */
export default function SellerListingsTab({ sellerId }: SellerListingsTabProps) {
  const { page, limit, setPage } = usePagination(12);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, setPage]);

  const { data: response, isLoading } = useGetProduceList({
    sellerId: sellerId,
    page,
    limit,
    search: debouncedSearch || undefined,
    sortBy: sortBy !== 'all' ? (sortBy as GetProduceListSortBy) : undefined,
  });

  if (isLoading) {
    return <SellerListingsTabSkeleton />;
  }

  const listings = response?.data?.data || [];
  const meta = response?.data?.meta || { total: 0, page: 1, limit: 4, totalPages: 1 };

  return (
    <div>
      {/* Header Info */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Eyebrow>Current &amp; Upcoming Listings</Eyebrow>
          <div className="font-sans text-[0.8rem] text-ink-3">
            {meta.total} active {meta.total === 1 ? 'listing' : 'listings'}
          </div>
        </div>
        <div>
          <Badge className="bg-lime/20 text-click-green hover:bg-lime/30 border-none">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current"></span>
            {meta.total} In season now
          </Badge>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="mb-6 flex flex-wrap gap-3 w-full">
        <div className="relative flex-1 min-w-62.5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3" />
          <Input
            placeholder="Search listings..."
            className="pl-9 bg-white h-9 w-full"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-40">
          <Select
            value={sortBy}
            onValueChange={(val) => {
              setSortBy(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full bg-white h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Default</SelectItem>
              <SelectItem value={GetProduceListSortBy.price}>Lowest Price</SelectItem>
              <SelectItem value={GetProduceListSortBy.distance}>Nearest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {listings.length > 0 ? (
          listings.map((item) => (
            <Card
              key={String(item.id)}
              className="overflow-hidden rounded-2xl border-1.5 border-cream-dark bg-white transition-all"
            >
              <div className="relative flex h-25 items-center justify-center bg-linear-to-br from-lime-pale to-[#eafaea] text-click-green overflow-hidden">
                {item.thumbnail ? (
                  <Image
                    src={String(item.thumbnail)}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <ProduceIcon type={item.name} className="h-10 w-10 opacity-60" />
                )}
              </div>
              <CardContent className="p-5 flex flex-col h-[calc(100%-100px)]">
                <div className="mb-1 font-heading text-[1.05rem] font-extrabold text-deep-forest line-clamp-1">
                  {item.name}
                </div>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <Badge className="bg-lime hover:bg-click-green border-none">
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-white"></span>
                    In Season
                  </Badge>
                  {item.isSubscribable && (
                    <Badge className="bg-deep-forest hover:bg-forest-dark border-none">
                      <Calendar className="mr-1 h-3 w-3" /> Subscribable
                    </Badge>
                  )}
                </div>
                <p className="mb-4 font-sans text-[0.76rem] leading-relaxed text-ink-3 line-clamp-3 flex-1">
                  {item.description || 'No description provided for this listing.'}
                </p>

                <div className="mt-auto">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="font-heading text-xl font-extrabold text-deep-forest">
                        {item.price}
                      </div>
                      <div className="font-sans text-[0.72rem] text-ink-3">
                        {item.amount} available ·{' '}
                        {new Date(item.availableBy).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="lime" className="flex-1">
                      + Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-cream-dark bg-white text-ink-3">
            <p>No listings found matching your search.</p>
          </div>
        )}
      </div>

      {listings.length > 0 && (
        <div className="mt-6">
          <PaginationControls meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
