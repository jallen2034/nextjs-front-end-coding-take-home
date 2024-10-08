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
  type: "Point"; // The type of geometry (Point, LineString, etc.)
  coordinates: [number, number];
}

interface Feature {
  type: "Feature";
  geometry: Coordinates;
  properties: string;
}

// Define the interface for the entire GeoJSON FeatureCollection
interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

export type { MapBoxContainerProps, OnMoveCB, MapViewState, GeoJSONFeatureCollection };
