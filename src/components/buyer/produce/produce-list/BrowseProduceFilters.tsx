'use client';

import { ChevronDown, ChevronUp, List, Loader2, LocateFixed, MapIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGeocodeAddress } from '@/lib/api/generated/location/location';
import {
  type GetProduceListParams,
  ProduceType,
  GetProduceListSortBy,
  GetProduceListHasDelivery,
  GetProduceListIsSubscribable,
  Season,
} from '@/lib/api/generated/models';

interface BrowseProduceFiltersProps {
  searchInput: string;
  setSearchInput: (val: string) => void;
  filters: Omit<GetProduceListParams, 'page' | 'limit' | 'search' | 'lat' | 'lng'>;
  setFilters: React.Dispatch<
    React.SetStateAction<Omit<GetProduceListParams, 'page' | 'limit' | 'search' | 'lat' | 'lng'>>
  >;
  currentView: 'list' | 'map';
  onViewChange: (view: 'list' | 'map') => void;
  onLocationChange: (lat: number, lng: number) => void;
  currentLocationName?: string;
}

const formatEnum = (str: string) =>
  str
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

/**
 * The filters for the browse produce list.
 * @param props - Filter props
 * @param props.searchInput - The search input string
 * @param props.setSearchInput - When the search input is edited
 * @param props.filters - All the filters
 * @param props.setFilters - When any of the filter inputs are edited
 * @param props.currentView - The current map view (list or map)
 * @param props.onViewChange - When the view toggle is clicked
 * @param props.onLocationChange - When the location filters are edited
 * @param props.currentLocationName -
 * @returns A horizontal row of filters with an advanced expandable section
 */
export function BrowseProduceFilters({
  searchInput,
  setSearchInput,
  filters,
  setFilters,
  currentView,
  onViewChange,
  onLocationChange,
  currentLocationName,
}: BrowseProduceFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [zipInput, setZipInput] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const geocodeAddressMutation = useGeocodeAddress();

  useEffect(() => {
    if (/^\d{5}$/.test(zipInput)) {
      const triggerGeocode = async () => {
        try {
          const geocodeRes = await geocodeAddressMutation.mutateAsync({
            data: {
              zip: zipInput,
            },
          });

          if (geocodeRes.status === 200) {
            const { lat, lng } = geocodeRes.data;
            onLocationChange(lat, lng);
          }
        } catch (error) {
          console.error('Failed to resolve address coordinates:', error);
        }
      };

      void triggerGeocode();
    }
  }, [zipInput, onLocationChange, geocodeAddressMutation]);

  const handleBrowserLocation = () => {
    if (!navigator.geolocation) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange(position.coords.latitude, position.coords.longitude);
        setZipInput('');
        setIsLocating(false);
      },
      (error) => {
        console.error('Error retrieving device position:', error);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === 'all' || value === '' ? undefined : value,
    }));
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setZipInput('');
    setFilters({});
  };

  const hasActiveFilters =
    searchInput !== '' ||
    zipInput !== '' ||
    Object.values(filters).some((val) => val !== undefined);

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Toggle View Buttons */}
        <div className="flex items-center rounded-md border border-input-border bg-input p-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('list')}
            className={`h-8 px-2.5 ${currentView === 'list' ? 'bg-slate-100 text-ink-1' : 'text-ink-4'}`}
          >
            <List className="mr-1.5 h-4 w-4" /> List
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('map')}
            className={`h-8 px-2.5 ${currentView === 'map' ? 'bg-slate-100 text-ink-1' : 'text-ink-4'}`}
          >
            <MapIcon className="mr-1.5 h-4 w-4" /> Map
          </Button>
        </div>
        <Input
          placeholder="Search items or growers..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-xs"
        />

        {/* Location / Zip input container */}
        <div className="relative flex items-center max-w-40">
          <Input
            placeholder={currentLocationName || 'Enter ZIP code'}
            value={zipInput}
            maxLength={5}
            onChange={(e) => setZipInput(e.target.value.replace(/\D/g, ''))}
            className="pr-8"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={handleBrowserLocation}
            disabled={isLocating}
            className="absolute right-2.5"
            title="Use my current location"
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
          </Button>
        </div>

        <Select
          value={filters.produceType || 'all'}
          onValueChange={(val) => handleFilterChange('produceType', val)}
        >
          <SelectTrigger aria-label="produce-type">
            <SelectValue placeholder="Produce Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.values(ProduceType).map((type) => (
              <SelectItem key={type} value={type}>
                {formatEnum(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy || 'all'}
          onValueChange={(val) => handleFilterChange('sortBy', val)}
        >
          <SelectTrigger aria-label="sort-by">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Default (Relevance)</SelectItem>
            <SelectItem value={GetProduceListSortBy.distance}>Nearest First</SelectItem>
            <SelectItem value={GetProduceListSortBy.price}>Lowest Price</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.maxDistance?.toString() || 'all'}
          onValueChange={(val) =>
            handleFilterChange('maxDistance', val !== 'all' ? Number(val) : undefined)
          }
        >
          <SelectTrigger aria-label="max-distance">
            <SelectValue placeholder="Distance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Distance</SelectItem>
            <SelectItem value="5">Within 5 miles</SelectItem>
            <SelectItem value="15">Within 15 miles</SelectItem>
            <SelectItem value="25">Within 25 miles</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? (
            <ChevronUp className="mr-1 h-4 w-4" />
          ) : (
            <ChevronDown className="mr-1 h-4 w-4" />
          )}
          Advanced
        </Button>

        {hasActiveFilters && (
          <Button variant="destructive" size="sm" onClick={clearAllFilters} className="ml-auto">
            <X className="mr-1 h-3 w-3" /> Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 p-4 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-1.5">
              <Label htmlFor="delivery">Delivery</Label>
              <Select
                value={filters.hasDelivery || 'all'}
                onValueChange={(val) => handleFilterChange('hasDelivery', val)}
              >
                <SelectTrigger id="delivery">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value={GetProduceListHasDelivery.true}>Delivery Available</SelectItem>
                  <SelectItem value={GetProduceListHasDelivery.false}>Pickup Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subscriptions-only">Subscriptions Only</Label>
              <Checkbox
                id="subscriptions-only"
                className="size-6"
                checked={filters.isSubscribable === GetProduceListIsSubscribable.true}
                onCheckedChange={(checked) =>
                  handleFilterChange(
                    'isSubscribable',
                    checked ? GetProduceListIsSubscribable.true : 'all',
                  )
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="season">Season</Label>
              <Select
                value={filters.season || 'all'}
                onValueChange={(val) => handleFilterChange('season', val)}
              >
                <SelectTrigger id="season">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Season || {}).map((s) => (
                    <SelectItem key={s} value={s}>
                      {formatEnum(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="min-quantity-lb">Min. Available (lbs)</Label>
              <Input
                id="min-quantity-lb"
                type="number"
                placeholder="0"
                value={filters.availableInventory ? filters.availableInventory / 16 : ''}
                onChange={(e) => {
                  const lbs = e.target.value ? Number(e.target.value) : undefined;
                  handleFilterChange(
                    'availableInventory',
                    lbs !== undefined ? lbs * 16 : undefined,
                  );
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="max-price">Max Price ($/lb)</Label>
              <Input
                id="max-price"
                type="number"
                step="0.01"
                placeholder="Any"
                value={filters.maxPrice ? (filters.maxPrice * 16).toFixed(2) : ''}
                onChange={(e) => {
                  const pricePerLb = e.target.value ? Number(e.target.value) : undefined;
                  handleFilterChange(
                    'maxPrice',
                    pricePerLb !== undefined ? pricePerLb / 16 : undefined,
                  );
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="available-by">Available By</Label>
              <Input
                id="available-by"
                type="date"
                value={filters.availableBy || ''}
                onChange={(e) => handleFilterChange('availableBy', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
