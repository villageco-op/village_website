'use client';

import { ChevronDown, ChevronUp, Map as MapIcon, List, X } from 'lucide-react';
import { useState } from 'react';

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
import {
  type GetProduceMapParams,
  ProduceType,
  GetProduceMapHasDelivery,
  GetProduceMapIsSubscribable,
  Season,
} from '@/lib/api/generated/models';

interface BrowseProduceMapFiltersProps {
  searchInput: string;
  setSearchInput: (val: string) => void;
  filters: Omit<GetProduceMapParams, 'search' | 'lat' | 'lng'>;
  setFilters: React.Dispatch<
    React.SetStateAction<Omit<GetProduceMapParams, 'search' | 'lat' | 'lng'>>
  >;
  currentView: 'list' | 'map';
  onViewChange: (view: 'list' | 'map') => void;
}

const formatEnum = (str: string) =>
  str
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

/**
 * The filters for the browse produce map.
 * @param props - Filter props
 * @param props.searchInput - The search input string
 * @param props.setSearchInput - When the search input is edited
 * @param props.filters - All the filters
 * @param props.setFilters - When any of the filter inputs are edited
 * @param props.currentView - The current map view (list or map)
 * @param props.onViewChange - When the view toggle is clicked
 * @returns A horizontal row of filters with an advanced expandable section
 */
export function BrowseProduceMapFilters({
  searchInput,
  setSearchInput,
  filters,
  setFilters,
  currentView,
  onViewChange,
}: BrowseProduceMapFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === 'all' || value === '' ? undefined : value,
    }));
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setFilters({});
  };

  const hasActiveFilters =
    searchInput !== '' || Object.values(filters).some((val) => val !== undefined);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Toggle View Buttons */}
        <div className="flex items-center rounded-md border border-input-border bg-input p-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('map')}
            className={`h-8 px-2.5 ${currentView === 'map' ? 'bg-slate-100 text-ink-1' : 'text-ink-4'}`}
          >
            <MapIcon className="mr-1.5 h-4 w-4" /> Map
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('list')}
            className={`h-8 px-2.5 ${currentView === 'list' ? 'bg-slate-100 text-ink-1' : 'text-ink-4'}`}
          >
            <List className="mr-1.5 h-4 w-4" /> List
          </Button>
        </div>

        <Input
          placeholder="Search items or growers..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-xs"
        />

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
          value={filters.radiusMiles?.toString() || 'all'}
          onValueChange={(val) =>
            handleFilterChange('radiusMiles', val !== 'all' ? Number(val) : undefined)
          }
        >
          <SelectTrigger aria-label="radius-miles">
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

      {showAdvanced && (
        <Card>
          <CardContent className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4 lg:grid-cols-6 animate-in fade-in slide-in-from-top-2">
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
                  <SelectItem value={GetProduceMapHasDelivery.true}>Delivery Available</SelectItem>
                  <SelectItem value={GetProduceMapHasDelivery.false}>Pickup Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subscriptions-only">Subscriptions Only</Label>
              <Checkbox
                id="subscriptions-only"
                className="size-6"
                checked={filters.isSubscribable === GetProduceMapIsSubscribable.true}
                onCheckedChange={(checked) =>
                  handleFilterChange(
                    'isSubscribable',
                    checked ? GetProduceMapIsSubscribable.true : 'all',
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
              <Label htmlFor="min-price">Min Price ($/lb)</Label>
              <Input
                id="min-price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={filters.minPrice ? (filters.minPrice * 16).toFixed(2) : ''}
                onChange={(e) => {
                  const pricePerLb = e.target.value ? Number(e.target.value) : undefined;
                  handleFilterChange(
                    'minPrice',
                    pricePerLb !== undefined ? pricePerLb / 16 : undefined,
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
              <Label htmlFor="max-order-lb">Max Order Qt. (lbs)</Label>
              <Input
                id="max-order-lb"
                type="number"
                placeholder="Any"
                value={filters.maxOrderQuantity ? filters.maxOrderQuantity / 16 : ''}
                onChange={(e) => {
                  const lbs = e.target.value ? Number(e.target.value) : undefined;
                  handleFilterChange('maxOrderQuantity', lbs !== undefined ? lbs * 16 : undefined);
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
