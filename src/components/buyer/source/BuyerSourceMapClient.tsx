'use client';

import { useMemo, useState } from 'react';

import { AnalyticsSidebar } from './AnalyticsSidebar';
import { SourceMap } from './SourceMap';

import { useAuth } from '@/hooks/useAuth';
import type {
  SourceMapNodesResponse,
  SourceMapNode,
  SourceMapQuery,
  ProduceType,
  Season,
} from '@/lib/api/generated/models';
import {
  useGetSourceMapAnalytics,
  useGetSourceMapNodes,
} from '@/lib/api/generated/source-map/source-map';

/**
 * The client for the buyer source map with loading and error handling.
 * @returns A page containing a full screen map and metrics bar
 */
export default function BuyerSourceMapClient() {
  const { user } = useAuth();

  const [produceType, setProduceType] = useState<ProduceType | undefined>(undefined);
  const [season, setSeason] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<SourceMapNode | null>(null);

  const queryParams: SourceMapQuery = {
    produceType,
    season: season as Season,
  };

  const {
    data: nodesResponse,
    isLoading: nodesLoading,
    isError: isNodesError,
  } = useGetSourceMapNodes(queryParams);
  const {
    data: analyticsResponse,
    isLoading: analyticsLoading,
    isError: isAnalyticsError,
  } = useGetSourceMapAnalytics(queryParams);

  const nodesFailed = isNodesError || nodesResponse?.status !== 200 || !nodesResponse?.data;
  const analyticsFailed = isAnalyticsError || analyticsResponse?.status !== 200;

  const nodes: SourceMapNodesResponse = useMemo(() => {
    return nodesFailed || nodesLoading ? [] : nodesResponse.data;
  }, [nodesFailed, nodesLoading, nodesResponse]);

  const analytics = useMemo(() => {
    return analyticsFailed || analyticsLoading
      ? {
          totalSpend: 0,
          totalVolumeOz: 0,
          uniqueGrowers: 0,
          foodMilesSaved: 0,
          produceBreakdown: [],
        }
      : analyticsResponse?.data;
  }, [analyticsFailed, analyticsLoading, analyticsResponse?.data]);

  const baseLat = user?.lat ?? 41.602;
  const baseLng = user?.lng ?? -87.3371;

  const linesGeoJSON = useMemo(() => {
    if (!nodes.length) return null;

    const maxVolume = Math.max(...nodes.map((n) => n.totalVolumeOz), 1);

    const features = nodes
      .map((node) => {
        if (node.lat == null || node.lng == null) return null;

        return {
          type: 'Feature',
          properties: {
            sellerId: node.sellerId,
            volumeWeight: Math.max(0.15, node.totalVolumeOz / maxVolume),
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [baseLng, baseLat],
              [node.lng, node.lat],
            ],
          },
        };
      })
      .filter(Boolean);

    return {
      type: 'FeatureCollection',
      features,
    };
  }, [nodes, baseLat, baseLng]);

  const getMaxVolume = () => Math.max(...nodes.map((n) => n.totalVolumeOz), 1);
  const getNodeSize = (volume: number) => {
    const max = getMaxVolume();
    const ratio = volume / max;
    return 1 + ratio * 1.5;
  };

  if ((nodesFailed && !nodesLoading) || (analyticsFailed && !analyticsLoading)) {
    return (
      <div className="m-8 flex h-64 items-center justify-center rounded-xl bg-destructive/10 p-8 text-destructive">
        <p className="font-heading font-bold">Failed to load your sourcing data.</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-50 border-y border-forest-dark/10">
      <AnalyticsSidebar
        produceType={produceType}
        setProduceType={setProduceType}
        season={season}
        setSeason={setSeason}
        analyticsLoading={analyticsLoading}
        nodesLoading={nodesLoading}
        analytics={analytics}
        user={user}
      />

      <SourceMap
        baseLat={baseLat}
        baseLng={baseLng}
        nodes={nodes}
        linesGeoJSON={linesGeoJSON}
        hoveredNode={hoveredNode}
        setHoveredNode={setHoveredNode}
        getNodeSize={getNodeSize}
      />
    </div>
  );
}
