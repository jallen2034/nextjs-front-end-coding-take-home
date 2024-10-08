"use client";

import { useCallback, useMemo, useState } from "react";
import * as React from "react";
import { ResaleData } from "@/app/map/types";
import Map, { ViewStateChangeEvent } from "react-map-gl";
import { MAPBOX_API_SECRET_KEY } from "@/app/apiUtils";
import { lowerMainlandBounds } from "@/app/shared-components/react-mapbox/helpers";
import {
  MapBoxContainerProps,
  MapViewState,
  OnMoveCB,
} from "@/app/shared-components/react-mapbox/types";
import "mapbox-gl/dist/mapbox-gl.css";

// Encapsulates the Mapbox map and is reusable across the Next.js app.
const MapboxContainer = ({ records }: MapBoxContainerProps) => {
  // Keep track of the current view state of the map. If this gets more complex, consider encapsulating in a custom hook.
  const [viewState, setViewState] = useState<MapViewState>({
    longitude: -123.1207, // Center onto Vancouver.
    latitude: 49.2827,
    zoom: 9.5,
  });

  /* Memoize the records to prevent unnecessary recalculations on re-renders. Useful
   * for improving performance when handling static, large datasets from the server. */
  const memoizedRecords: ResaleData = useMemo(() => records, [records]);

  // Handle map movement and restrict view state to the geofence in the lower mainland.
  const onMove: OnMoveCB = useCallback(
    ({
      viewState: { longitude, latitude, zoom },
    }: ViewStateChangeEvent): void => {
      // Check if the new center is within the geofence (Lower Mainland Polygon)
      setViewState(
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

  // Debugging values.
  console.log(memoizedRecords);
  console.log({ viewState });

  return (
    <div>
      <Map
        {...viewState}
        onMove={onMove}
        mapboxAccessToken={MAPBOX_API_SECRET_KEY}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        style={{ width: 600, height: 400 }}
        maxBounds={lowerMainlandBounds} // Restrict map movement to the Lower Mainland bounds
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
    </div>
  );
};

export default MapboxContainer;
