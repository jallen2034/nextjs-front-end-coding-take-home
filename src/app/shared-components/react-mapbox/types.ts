import { ViewStateChangeEvent } from "react-map-gl";
import { ResaleDataFromAPI } from "@/app/map/types";

type OnMoveCB = (event: ViewStateChangeEvent) => void;

interface MapBoxContainerProps {
  records: ResaleDataFromAPI;
}

interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

interface Coordinates {
  type: string; // The type of geometry (Point, LineString, etc.)
  coordinates: number[];
}

interface Feature {
  type: string;
  geometry: Coordinates;
  properties: string;
}

// Define the interface for the entire GeoJSON FeatureCollection
interface GeoJSONFeatureCollection {
  type: string;
  features: Feature[];
}

export type {
  MapBoxContainerProps,
  OnMoveCB,
  MapViewState,
  GeoJSONFeatureCollection,
  Feature,
};
