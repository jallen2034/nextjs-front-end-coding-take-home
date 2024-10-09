"use client";

import { useCallback, useMemo, useState } from "react";
import * as React from "react";
import Map, { ViewStateChangeEvent, Source, Layer } from "react-map-gl";
import { MAPBOX_API_SECRET_KEY } from "@/app/apiUtils";
import {
  generateGeoJsonDataFromMemoizedRecords,
  lowerMainlandBounds,
} from "@/app/shared-components/react-mapbox/helpers";
import {
  GeoJSONFeatureCollection,
  MapBoxContainerProps,
  MapViewState,
  OnMoveCB,
} from "@/app/shared-components/react-mapbox/types";
import { CircleLayer } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Style for the marker layer. Don't know if this can be done in a SCSS module. curious.
const layerStyle: CircleLayer = {
  id: "marker",
  type: "circle", // Ensure you are using a circle type.
  source: "records",
  paint: {
    "circle-radius": 10,
    "circle-color": "#4e06bb",
  },
};

// Encapsulates the Mapbox map and is reusable across the Next.js app.
const MapboxContainer = ({ records }: MapBoxContainerProps) => {
  // Track of the current view state of the map. If this gets more complex, consider encapsulating in a custom hook.
  const [viewState, setViewState] = useState<MapViewState>({
    longitude: -123.1207, // Center onto Vancouver.
    latitude: 49.2827,
    zoom: 9.5,
  });

  /* Memoize the records and GeoJSON data to prevent unnecessary recalculations on re-renders.
   * Useful for improving performance when handling static, large datasets from the server. */
  const memoizedGeoJsonData: GeoJSONFeatureCollection = useMemo((): GeoJSONFeatureCollection => {
    return generateGeoJsonDataFromMemoizedRecords(records);
  }, [records]);

  // Handle map movement and restrict view state to the geofence in the lower mainland.
  const onMove: OnMoveCB = useCallback(
    ({
      viewState: { longitude, latitude, zoom },
    }: ViewStateChangeEvent): void => {
      setViewState( // Check if the new center is within the geofence (Lower Mainland Polygon).
        (prev: MapViewState): MapViewState => ({
          ...prev,
          longitude,
          latitude,
          zoom: Math.min(Math.max(zoom, 10), 15), // Limit zoom level.
        }),
      );
    },
    [],
  );

  return (
    <div>
      <Map
        {...viewState}
        onMove={onMove}
        mapboxAccessToken={MAPBOX_API_SECRET_KEY}
        style={{ width: 600, height: 400 }}
        maxBounds={lowerMainlandBounds} // Restrict map bounds to the Lower Mainland.
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Source id="hardcoded-marker" type="geojson" data={memoizedGeoJsonData}>
          <Layer {...layerStyle} />
        </Source>
      </Map>
    </div>
  );
};

export default MapboxContainer;
