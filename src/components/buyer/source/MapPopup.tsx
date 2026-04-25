import { Popup } from 'react-map-gl/maplibre';

import type { SourceMapNode } from '@/lib/api/generated/models';

interface MapPopupProps {
  node: SourceMapNode;
}

/**
 * A maplibre popup for displaying a node within the buyer source map.
 * @param props - Popup props
 * @param props.node - The map node
 * @returns A maplibre popup component
 */
export function MapPopup({ node }: MapPopupProps) {
  if (node.lat == null || node.lng == null) return null;

  return (
    <Popup
      longitude={node.lng}
      latitude={node.lat}
      offset={24}
      closeButton={false}
      closeOnClick={false}
      className="pointer-events-none z-50"
      maxWidth="250px"
    >
      <div className="flex flex-col gap-1.5 px-1 py-0.5">
        <div className="font-heading text-[0.85rem] font-bold leading-tight text-deep-forest">
          {node.name || 'Local Seller'}
        </div>

        <div className="flex flex-col gap-0.5 text-[0.7rem] text-ink-3">
          <div className="flex justify-between">
            <span>Purchased Vol:</span>
            <strong className="text-ink-2">{node.totalVolumeOz} oz</strong>
          </div>
          <div className="flex justify-between">
            <span>Total Spend:</span>
            <strong className="text-ink-2">${node.totalSpend.toFixed(2)}</strong>
          </div>
          {node.produceCategories && node.produceCategories.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {node.produceCategories.slice(0, 3).map((cat, idx) => (
                <span
                  key={idx}
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.6rem] font-medium text-ink-2"
                >
                  {cat}
                </span>
              ))}
              {node.produceCategories.length > 3 && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.6rem] font-medium text-ink-3">
                  +{node.produceCategories.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
}
