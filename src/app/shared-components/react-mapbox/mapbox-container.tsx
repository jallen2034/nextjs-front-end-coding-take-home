"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import * as React from "react";
import Map, { ViewStateChangeEvent, Source, Layer } from "react-map-gl";
import { MAPBOX_API_SECRET_KEY } from "@/app/apiUtils";
import {
  generateGeoJsonDataFromMemoizedRecords,
  lowerMainlandBounds,
} from "@/app/shared-components/react-mapbox/helpers";
import {
  Feature,
  GeoJSONFeatureCollection,
  MapBoxContainerProps,
  MapViewState,
  SlidingWindowPointers,
} from "@/app/shared-components/react-mapbox/types";
import { CircleLayer } from "mapbox-gl";
import { PropertyListItem } from "@/app/shared-components/property-list-item/property-list-item";
import { Box, CircularProgress, Button } from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";

// Style for the marker layer.
const layerStyle: CircleLayer = {
  id: "marker",
  type: "circle",
  source: "records",
  paint: {
    "circle-radius": 10,
    "circle-color": "#4e06bb",
  },
};

// Encapsulates the Mapbox map and is reusable across the Next.js app.
const MapboxContainer = ({ records }: MapBoxContainerProps) => {
  const memoizedGeoJsonData: GeoJSONFeatureCollection =
    useMemo((): GeoJSONFeatureCollection => {
      return generateGeoJsonDataFromMemoizedRecords(records);
    }, [records]);
  
  const { features }: GeoJSONFeatureCollection = memoizedGeoJsonData;
  
  const [viewState, setViewState] = useState<MapViewState>({
    longitude: -123.1207,
    latitude: 49.2827,
    zoom: 9.5,
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [slidingWindowForVisibleFeatures, setSlidingWindowForVisibleFeatures] =
    useState<SlidingWindowPointers>({
      leftIdx: 0,
      rightIdx: 19,
    });
  
  const [visibleFeatures, setVisibleFeatures] = useState<Feature[]>([]);
  
  // Number of items per page.
  const itemsPerPage = 10;
  const maxVisibleFeatures = 20;
  
  // Helper function to load the next set of items
  const loadNextItems = useCallback((): void => {
    setLoading(true);
    setTimeout((): void => {
      const { rightIdx } = slidingWindowForVisibleFeatures;
      if (rightIdx < features.length - 1) {
        const newRightIdx = Math.min(rightIdx + itemsPerPage, features.length - 1);
        const newLeftIdx = Math.max(newRightIdx - maxVisibleFeatures + 1, 0);
        setSlidingWindowForVisibleFeatures({
          leftIdx: newLeftIdx,
          rightIdx: newRightIdx,
        });
      }
      setLoading(false);
    }, 300);
  }, [features.length, slidingWindowForVisibleFeatures]);
  
  // Helper function to load the previous set of items
  const loadPreviousItems = useCallback((): void => {
    setLoading(true);
    setTimeout((): void => {
      const { leftIdx } = slidingWindowForVisibleFeatures;
      if (leftIdx > 0) {
        const newLeftIdx = Math.max(leftIdx - itemsPerPage, 0);
        const newRightIdx = Math.min(newLeftIdx + maxVisibleFeatures - 1, features.length - 1);
        setSlidingWindowForVisibleFeatures({
          leftIdx: newLeftIdx,
          rightIdx: newRightIdx,
        });
      }
      setLoading(false);
    }, 300);
  }, [features.length, slidingWindowForVisibleFeatures]);
  
  // Effect hook to update the visible features based on the sliding window.
  useEffect((): void => {
    if (features.length) {
      const { leftIdx, rightIdx } = slidingWindowForVisibleFeatures;
      const newVisibleFeatures = features.slice(leftIdx, rightIdx + 1);
      setVisibleFeatures(newVisibleFeatures);
    }
  }, [features, slidingWindowForVisibleFeatures]);
  
  // Logic to handle moving around the map and looking at the markers.
  const onMove = useCallback(
    ({ viewState: { longitude, latitude, zoom } }: ViewStateChangeEvent): void => {
      setViewState((prev) => ({
        ...prev,
        longitude,
        latitude,
        zoom: Math.min(Math.max(zoom, 10), 15),
      }));
    },
    [],
  );
  
  return (
    <div className="mapbox-container">
      <Map
        {...viewState}
        onMove={onMove}
        mapboxAccessToken={MAPBOX_API_SECRET_KEY}
        style={{ width: 600, height: 400 }}
        maxBounds={lowerMainlandBounds}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Source id="hardcoded-marker" type="geojson" data={memoizedGeoJsonData}>
          <Layer {...layerStyle} />
        </Source>
      </Map>
      
      {/* Scrollable container for the list of properties */}
      <div className="propertyList" style={{ height: "300px", overflowY: "auto" }}>
        {visibleFeatures.length > 0 ? (
          visibleFeatures.map((feature) => (
            <PropertyListItem key={feature.properties.id} feature={feature} />
          ))
        ) : (
          <Box className="loading-spinner-container">
            <CircularProgress />
          </Box>
        )}
        
        {/* Show loading spinner while loading more items */}
        {loading && <CircularProgress />}
      </div>
      <div>
        {/* Load Previous and Next buttons */}
        <Box className="pagination-buttons" display="flex" justifyContent="space-between">
          <Button
            onClick={loadPreviousItems}
            disabled={slidingWindowForVisibleFeatures.leftIdx === 0 || loading}
          >
            Load Previous {itemsPerPage} properties
          </Button>
          <Button
            onClick={loadNextItems}
            disabled={slidingWindowForVisibleFeatures.rightIdx >= features.length - 1 || loading}
          >
            Load Next {itemsPerPage} properties
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default MapboxContainer;
