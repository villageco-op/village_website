import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { MapPopup } from './MapPopup';

import type { SourceMapNode } from '@/lib/api/generated/models';
import { getProduceIcon } from '@/lib/produce-utils';

interface SourceMapProps {
  baseLat: number;
  baseLng: number;
  nodes: SourceMapNode[];
  linesGeoJSON: any;
  hoveredNode: SourceMapNode | null;
  setHoveredNode: (node: SourceMapNode | null) => void;
  getNodeSize: (volume: number) => number;
}

/**
 * Renders an interactive MapLibre map visualizing supply chain nodes and connections.
 * @param props - Source map properties
 * @param props.baseLat - Latitude of the central store/hub.
 * @param props.baseLng - Longitude of the central store/hub.
 * @param props.nodes - Array of source nodes (growers) to display as markers.
 * @param props.linesGeoJSON - GeoJSON data representing the paths between nodes.
 * @param props.hoveredNode - The node currently being hovered by the user.
 * @param props.setHoveredNode - State setter to update the currently hovered node.
 * @param props.getNodeSize - Function that calculates marker scale based on volume.
 * @returns A full-screen absolute positioned map component.
 */
export function SourceMap({
  baseLat,
  baseLng,
  nodes,
  linesGeoJSON,
  hoveredNode,
  setHoveredNode,
  getNodeSize,
}: SourceMapProps) {
  return (
    <div className="absolute inset-0 z-0">
      <Map
        initialViewState={{
          longitude: baseLng,
          latitude: baseLat,
          zoom: 11,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        attributionControl={false}
        interactiveLayerIds={['supply-lines']}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {/* Supply Lines Layer */}
        {linesGeoJSON && (
          <Source type="geojson" data={linesGeoJSON}>
            <Layer
              id="supply-lines"
              type="line"
              paint={{
                'line-color': '#2A4B28',
                'line-width': ['*', ['get', 'volumeWeight'], 6],
                'line-opacity': ['*', ['get', 'volumeWeight'], 0.8],
              }}
            />
          </Source>
        )}

        {/* Base Store Location Pin */}
        <Marker longitude={baseLng} latitude={baseLat} anchor="bottom">
          <div
            className="z-20 cursor-pointer drop-shadow-md transition-transform hover:scale-110"
            title="Your Store"
          >
            <span className="text-[2rem]">📍</span>
          </div>
        </Marker>

        {/* Nodes (Grower Locations) */}
        {nodes.map((node) => {
          if (node.lat == null || node.lng == null) return null;
          const size = getNodeSize(node.totalVolumeOz);

          return (
            <Marker
              key={String(node.sellerId)}
              longitude={node.lng}
              latitude={node.lat}
              anchor="center"
            >
              <div
                className="flex cursor-pointer items-center justify-center rounded-full border border-forest-dark/20 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-transform hover:scale-125 hover:z-30"
                style={{
                  width: `${size + 0.6}rem`,
                  height: `${size + 0.6}rem`,
                  fontSize: `${size}rem`,
                }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {getProduceIcon(node.primaryProduceType)}
              </div>
            </Marker>
          );
        })}

        {/* Map Tooltip */}
        {hoveredNode && <MapPopup node={hoveredNode} />}
      </Map>
    </div>
  );
}
