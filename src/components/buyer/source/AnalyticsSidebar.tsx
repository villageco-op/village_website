import { Truck } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ProduceType,
  type SourceMapAnalyticsResponse,
  type User,
} from '@/lib/api/generated/models';
import { formatProduceType } from '@/lib/produce-utils';

interface AnalyticsSidebarProps {
  produceType?: ProduceType;
  setProduceType: (val: ProduceType | undefined) => void;
  season: string;
  setSeason: (val: string) => void;
  analyticsLoading: boolean;
  nodesLoading: boolean;
  analytics: SourceMapAnalyticsResponse;
  user?: User;
}

/**
 * Renders an interactive sidebar for supply chain analytics, providing users with
 * insights into their local food impact, economic contributions, and logistics savings.
 * @param props - Sidebar props
 * @param props.produceType - The current selected category of produce
 * @param props.setProduceType - Callback function to update the produce filter
 * @param props.season - The current selected harvest season
 * @param props.setSeason - Callback function to update the season filter
 * @param props.analyticsLoading - Is analytics data is currently being fetched
 * @param props.nodesLoading - Is map node data is currently loading
 * @param props.analytics - The data object containing spend, miles saved, and produce breakdown
 * @param props.user - The current authenticated user
 * @returns A fixed-position sidebar component with scrollable analytics content.
 */
export function AnalyticsSidebar({
  produceType,
  setProduceType,
  season,
  setSeason,
  analyticsLoading,
  nodesLoading,
  analytics,
  user,
}: AnalyticsSidebarProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex max-h-[45vh] flex-col md:bottom-4 md:right-auto md:max-h-none md:w-90 pointer-events-none">
      <Card className="pointer-events-auto flex h-auto max-h-full flex-col overflow-hidden rounded-2xl border-forest-dark/10 bg-white/95 shadow-2xl backdrop-blur-md">
        <CardHeader className="shrink-0 pb-4">
          <CardTitle className="font-heading text-xl text-deep-forest">
            Supply Chain Impact
          </CardTitle>
          <p className="font-sans text-xs text-ink-3">Visualize the flow and volume of your food</p>
        </CardHeader>

        <CardContent className="hidden-scrollbar flex flex-col gap-6 overflow-y-auto pb-6">
          {/* Interactive Filtering */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-3">
                Filter by Produce
              </label>
              <Select
                value={produceType || 'ALL'}
                onValueChange={(val) =>
                  setProduceType(val === 'ALL' ? undefined : (val as ProduceType))
                }
              >
                <SelectTrigger className="h-9 bg-white text-sm">
                  <SelectValue placeholder="All Produce" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Produce</SelectItem>
                  {Object.entries(ProduceType).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {formatProduceType(key)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="produceType"
                className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-3"
              >
                Filter by Season
              </label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger id="produceType" className="h-9 bg-white text-sm">
                  <SelectValue placeholder="All Seasons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Year-Round</SelectItem>
                  <SelectItem value="spring">Spring Harvest</SelectItem>
                  <SelectItem value="summer">Summer Harvest</SelectItem>
                  <SelectItem value="fall">Fall Harvest</SelectItem>
                  <SelectItem value="winter">Winter Harvest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sidebar Analytics */}
          {analyticsLoading || nodesLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          ) : analytics ? (
            <>
              {/* Economic Impact */}
              <div className="rounded-lg border border-lime/30 bg-lime/20 p-4 shadow-sm">
                <div className="mb-1 font-heading text-2xl font-extrabold text-deep-forest">
                  $
                  {analytics.totalSpend.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </div>
                <p className="text-[0.8rem] leading-relaxed text-ink-2">
                  You&apos;ve injected this directly into the{' '}
                  <strong>{user?.city || 'local'}</strong> economy this year, supporting{' '}
                  <strong>{analytics.uniqueGrowers}</strong> local neighbors.
                </p>
              </div>

              {/* Food Miles Saved */}
              <div className="rounded-lg border border-sun/20 bg-sun/10 p-4 shadow-sm">
                <div className="mb-1 flex items-center gap-2">
                  <Truck className="text-xl text-clay" />
                  <div className="font-heading text-xl font-extrabold text-clay">
                    {analytics.foodMilesSaved.toLocaleString()} miles
                  </div>
                </div>
                <p className="text-[0.8rem] leading-relaxed text-ink-2">
                  Estimated food miles saved compared to conventional supermarket food.
                </p>
              </div>

              {/* The "Local Plate" Breakdown */}
              <div className="flex flex-col gap-3.5">
                <div className="text-[0.7rem] font-bold uppercase tracking-wider text-ink">
                  Your Local Plate
                </div>
                {analytics.produceBreakdown && analytics.produceBreakdown.length > 0 ? (
                  <div className="flex flex-col gap-3.5">
                    {analytics.produceBreakdown.map((pb: any) => (
                      <div key={pb.produceType} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[0.75rem] font-medium text-ink-2">
                          <span>{pb.produceType}</span>
                          <span className="font-heading font-bold text-deep-forest">
                            {pb.percentage}%
                          </span>
                        </div>
                        <Progress value={pb.percentage} className="h-1.5 bg-slate-100" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-ink-3">
                    No produce breakdown available for these filters.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-sm font-medium text-destructive">
              Failed to load map analytics.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
