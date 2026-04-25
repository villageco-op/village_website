import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import { SourceMap } from './SourceMap';

import type { SourceMapNode } from '@/lib/api/generated/models';

const meta: Meta<typeof SourceMap> = {
  title: 'Buyer/SourceMap/SourceMap',
  component: SourceMap,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative h-screen w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    baseLat: 43.0731, // Madison, WI
    baseLng: -89.4012,
    setHoveredNode: fn(),
    getNodeSize: (volume: number) => Math.min(Math.max(volume / 500, 1.2), 2.5),
  },
};

export default meta;
type Story = StoryObj<typeof SourceMap>;

const mockNodes: SourceMapNode[] = [
  {
    sellerId: 's1',
    name: 'Green Valley Organics',
    lat: 43.095,
    lng: -89.35,
    totalVolumeOz: 1200,
    totalSpend: 450.5,
    primaryProduceType: 'Leafy Greens',
    produceCategories: ['Kale', 'Spinach', 'Arugula', 'Chard'],
  },
  {
    sellerId: 's2',
    name: 'Hilltop Orchard',
    lat: 43.03,
    lng: -89.48,
    totalVolumeOz: 2500,
    totalSpend: 890.0,
    primaryProduceType: 'Fruits',
    produceCategories: ['Apples', 'Pears'],
  },
  {
    sellerId: 's3',
    name: 'Bessie’s Dairy',
    lat: 43.12,
    lng: -89.45,
    totalVolumeOz: 800,
    totalSpend: 320.75,
    primaryProduceType: 'Dairy',
    produceCategories: ['Milk', 'Cheese', 'Butter'],
  },
];

// Helper to generate lines from base to nodes
const generateGeoJSON = (baseLat: number, baseLng: number, nodes: SourceMapNode[]) => ({
  type: 'FeatureCollection',
  features: nodes.map((node) => ({
    type: 'Feature',
    properties: {
      volumeWeight: node.totalVolumeOz / 3000, // Normalized for line-width
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [baseLng, baseLat],
        [node.lng, node.lat],
      ],
    },
  })),
});

export const Default: Story = {
  args: {
    nodes: mockNodes,
    linesGeoJSON: generateGeoJSON(43.0731, -89.4012, mockNodes),
    hoveredNode: null,
  },
};

/**
 * Demonstrates the MapPopup appearing when a node is hovered.
 */
export const WithHoveredPopup: Story = {
  args: {
    ...Default.args,
    hoveredNode: mockNodes[0],
  },
};

/**
 * Visualizing a larger network of local sellers.
 */
export const DenseNetwork: Story = {
  args: {
    ...Default.args,
    nodes: [
      ...mockNodes,
      {
        sellerId: 's4',
        name: 'Rooted Farms',
        lat: 43.05,
        lng: -89.32,
        totalVolumeOz: 400,
        totalSpend: 150,
        primaryProduceType: 'Root Vegetables',
        produceCategories: ['Carrots', 'Beets'],
      },
      {
        sellerId: 's5',
        name: 'The Egg Basket',
        lat: 43.15,
        lng: -89.38,
        totalVolumeOz: 3000,
        totalSpend: 1200,
        primaryProduceType: 'Eggs',
        produceCategories: ['Chicken Eggs', 'Duck Eggs'],
      },
    ],
    linesGeoJSON: generateGeoJSON(43.0731, -89.4012, [
      ...mockNodes,
      { lat: 43.05, lng: -89.32, totalVolumeOz: 400 } as any,
      { lat: 43.15, lng: -89.38, totalVolumeOz: 3000 } as any,
    ]),
  },
};

/**
 * State with no sellers nearby, showing only the base store location.
 */
export const OnlyBaseLocation: Story = {
  args: {
    nodes: [],
    linesGeoJSON: null,
    hoveredNode: null,
  },
};
