import { CircleLayer } from "mapbox-gl";
import { LayerProps } from "react-map-gl";

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
    "circle-opacity": 0.75,
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
    // Set circle color for all points.
    "circle-color": "#e7015c",
    
    // Set circle radius based on isSelected property.
    "circle-radius": [
      "case",
      ["boolean", ["get", "isSelected"], false],
      15, // Radius if isSelected is true.
      4,  // Radius if isSelected is false.
    ],
    
    // Set stroke width for better visibility.
    "circle-stroke-width": 5,
    
    // Set stroke color based on isSelected property conditionally.
    "circle-stroke-color": [
      "case",
      ["boolean", ["get", "isSelected"], false],
      "#1900ff", // Stroke color for if isSelected is true.
      "#e7015c", // Stroke color for if isSelected is false.
    ],
  },
};

export {
  unclusteredPointLayer,
  clusterCountLayer,
  clusterLayer
}