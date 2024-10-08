import { ViewStateChangeEvent } from "react-map-gl";
import { ResaleData } from "@/app/map/types";

type OnMoveCB = (event: ViewStateChangeEvent) => void;

interface MapBoxContainerProps {
  records: ResaleData;
}

interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

export type { MapBoxContainerProps, OnMoveCB, MapViewState };
