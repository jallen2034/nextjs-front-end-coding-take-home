import { ViewStateChangeEvent } from "react-map-gl";
import { Property, ResaleDataFromAPI } from "@/app/map/types";
import { RefObject } from "react";

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
  properties: Property;
}

interface SelectedPropertyResult {
  selectedFeature: Feature | undefined;
  propertyRef: RefObject<any>;
}

// Define the interface for the entire GeoJSON FeatureCollection
interface GeoJSONFeatureCollection {
  type: string;
  features: Feature[];
}

interface SlidingWindowPointers {
  leftIdx: number,
  rightIdx: number,
}


interface NewWindowPointers {
  newLeftIdx: number,
  newRightIdx: number
}

type ChangeFilterModalCB = (action: boolean) => void

type PropertyToLocateOnMapCB = (id: string) => void

export type {
  MapBoxContainerProps,
  OnMoveCB,
  MapViewState,
  GeoJSONFeatureCollection,
  Feature,
  SlidingWindowPointers,
  NewWindowPointers,
  ChangeFilterModalCB,
  PropertyToLocateOnMapCB,
  SelectedPropertyResult
};
