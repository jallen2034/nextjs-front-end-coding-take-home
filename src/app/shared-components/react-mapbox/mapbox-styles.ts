import { CircleLayer } from "mapbox-gl";
import { LayerProps } from "react-map-gl";

// I dunno if there is a way to style the map

// Cluster Layer - https://github.com/visgl/react-map-gl/blob/7.1-release/examples/clusters/src/layers.ts
const clusterLayer: CircleLayer = {
  id: "clusters",
  type: "circle",
  source: "records",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#733bc4",
      100,
      "#ce175f",
      750,
      "#196cc9",
    ],
    "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
  },
};

// Cluster Count Layer - https://github.com/visgl/react-map-gl/blob/7.1-release/examples/clusters/src/layers.ts
const clusterCountLayer: LayerProps = {
  id: "cluster-count",
  type: "symbol",
  source: "records",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
};

// Unclustered Point Layer.
const unclusteredPointLayer: CircleLayer = {
  id: "unclustered-point",
  type: "circle",
  source: "records",
  filter: ["!", ["has", "point_count"]],
  paint: {
    // Set circle color for all points
    "circle-color": "#ce175f",
    
    // Set circle radius based on isSelected property
    "circle-radius": [
      "case",
      ["boolean", ["get", "isSelected"], false],
      15, // Radius if isSelected is true
      4,  // Radius if isSelected is false
    ],
    
    // Set stroke width for better visibility
    "circle-stroke-width": 2,
    
    // Set stroke color based on isSelected property conditionally.
    "circle-stroke-color": [
      "case",
      ["boolean", ["get", "isSelected"], false],
      "#196cc9", // Stroke color for selected points
      "#ce175f", // Stroke color for unselected points
    ],
  },
};

export {
  unclusteredPointLayer,
  clusterCountLayer,
  clusterLayer
}