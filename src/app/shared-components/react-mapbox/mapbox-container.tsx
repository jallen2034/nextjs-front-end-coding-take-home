"use client";

import * as React from "react";
import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Map, { Layer, MapRef, Source, ViewStateChangeEvent } from "react-map-gl";
import { MAPBOX_API_SECRET_KEY } from "@/app/apiUtils";
import {
  calculateWindowLocationWhenMarkerClicked,
  generateGeoJsonDataFromMemoizedRecords,
  getNextIndicesForWindow,
  getPreviousIndicesForWindow,
  lowerMainlandBounds,
  setupMapListeners,
  zoomToSelectedProperty,
} from "@/app/shared-components/react-mapbox/helpers";
import {
  Feature,
  GeoJSONFeatureCollection,
  MapBoxContainerProps,
  MapViewState,
  NewWindowPointers,
  SlidingWindowPointers,
} from "@/app/shared-components/react-mapbox/types";
import { PropertyListItem } from "@/app/shared-components/property-list-item/property-list-item";
import { Box, Button } from "@mui/material";
import "./mapbox-container.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  clusterCountLayer,
  clusterLayer,
  unclusteredPointLayer,
} from "@/app/shared-components/react-mapbox/mapbox-styles";

// Encapsulates the Mapbox map and is reusable across the Next.js app.
const MapboxContainer = ({ records }: MapBoxContainerProps) => {
  // Configuration for pagination.
  const itemsPerPage: number = 10;
  const maxVisibleFeatures: number = 10;

  // Reference to the Map component.
  const mapRef: RefObject<MapRef> = useRef<MapRef>(null);

  // Array of all the potential refs to attach to the elements generated below via visibleFeatures.
  const propertyRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State management for the map's view.
  const [viewState, setViewState] = useState<MapViewState>({
    longitude: -123.1207,
    latitude: 49.2827,
    zoom: 9.5,
  });

  // Track the left and right indices for the sliding window to build the current array of visible features to render.
  const [slidingWindowForVisibleFeatures, setSlidingWindowForVisibleFeatures] =
    useState<SlidingWindowPointers>({
      leftIdx: 0,
      rightIdx: 9,
    });

  // State to keep track of the selected property ID of a marker that is clicked on the map.
  const [selectedPropertyToLocateOnMap, setSelectedPropertyToLocateOnMap] =
    useState<string | null>(null);

  // Array to store the currently visible features. Calculated within bounds of the left + right pointer of the window.
  const [visibleFeatures, setVisibleFeatures] = useState<Feature[]>([]);

  // Memoized GeoJSON data derived from the records.
  const memoizedGeoJsonData: GeoJSONFeatureCollection =
    useMemo((): GeoJSONFeatureCollection => {
      return generateGeoJsonDataFromMemoizedRecords(
        records,
        selectedPropertyToLocateOnMap,
      );
    }, [records, selectedPropertyToLocateOnMap]);

  // Destructure properties from the memoized GeoJSON data.
  const { features }: GeoJSONFeatureCollection = memoizedGeoJsonData;
  const { length }: Feature[] = features;

  // Effect to scroll to the selected property into view when it is selected from a map marker.
  useEffect(() => {
    if (selectedPropertyToLocateOnMap) {
      const index: number = visibleFeatures.findIndex(
        (feature: Feature): boolean => feature.properties.id === selectedPropertyToLocateOnMap
      );
      
      // Retrieve the property reference that matches with the ID of the property the user clicked on.
      const propertyRef: any = propertyRefs.current[index];
      
      // Guard clause to check if the index is -1 (not found) or if the reference itself is invalid.
      if (index === -1 || !propertyRef?.current) return;
      
      // Scroll to the referenced DOM element if valid.
      propertyRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [features, selectedPropertyToLocateOnMap, visibleFeatures]);

  // Effect hook to update visible features based on the sliding window state.
  useEffect(() => {
    if (length) {
      const { leftIdx, rightIdx } = slidingWindowForVisibleFeatures;
      const newVisibleFeatures: Feature[] = features.slice(
        leftIdx,
        rightIdx + 1,
      );
      setVisibleFeatures(newVisibleFeatures);
    }
  }, [features, length, slidingWindowForVisibleFeatures]);

  // Effect to zoom in on the selected property when it is changed.
  useEffect(() => {
    if (!selectedPropertyToLocateOnMap) return;

    const selectedFeature: Feature | undefined = features.find(
      (feature: Feature): boolean =>
        feature.properties.id === selectedPropertyToLocateOnMap,
    );

    if (selectedFeature) {
      zoomToSelectedProperty(selectedFeature, mapRef);
    }
  }, [features, selectedPropertyToLocateOnMap, mapRef]);

  // Effect to set up event listeners for marker clicks.
  useEffect(() => {
    const map: MapRef | null = mapRef.current;

    if (map) {
      // Cleanup function to run on unmount or when map changes.
      return setupMapListeners(map, setSelectedPropertyToLocateOnMap);
    }
  }, [
    features,
    mapRef,
    memoizedGeoJsonData,
    selectedPropertyToLocateOnMap,
    setSelectedPropertyToLocateOnMap,
  ]);

  // Effect to adjust the sliding window based on the selected map marker/property.
  useEffect(() => {
    const windowPointers: NewWindowPointers | undefined =
      calculateWindowLocationWhenMarkerClicked(
        selectedPropertyToLocateOnMap,
        features,
        maxVisibleFeatures,
      );

    // Update the correct indices to move our sliding window to if we find the selected marker exists in the features array.
    if (windowPointers) {
      const { newLeftIdx, newRightIdx }: NewWindowPointers = windowPointers;
      setSlidingWindowForVisibleFeatures({
        leftIdx: newLeftIdx,
        rightIdx: newRightIdx,
      });
    }
  }, [selectedPropertyToLocateOnMap, features, maxVisibleFeatures]);

  // Helper function to load the next set of items in the sliding window.
  const loadNextItems = useCallback((): void => {
    const { rightIdx }: SlidingWindowPointers = slidingWindowForVisibleFeatures;

    if (rightIdx < length - 1) {
      setSlidingWindowForVisibleFeatures(
        getNextIndicesForWindow(
          rightIdx,
          itemsPerPage,
          maxVisibleFeatures,
          length,
        ),
      );
    }
  }, [length, slidingWindowForVisibleFeatures]);

  // Helper function to load the previous set of items in the sliding window.
  const loadPreviousItems = useCallback((): void => {
    const { leftIdx }: SlidingWindowPointers = slidingWindowForVisibleFeatures;

    if (leftIdx > 0) {
      setSlidingWindowForVisibleFeatures(
        getPreviousIndicesForWindow(
          leftIdx,
          itemsPerPage,
          maxVisibleFeatures,
          length,
        ),
      );
    }
  }, [length, slidingWindowForVisibleFeatures]);

  // Handler for map movements to update the view state.
  const onMove = useCallback(
    ({
      viewState: { longitude, latitude, zoom },
    }: ViewStateChangeEvent): void => {
      setViewState((prev: MapViewState) => ({
        ...prev,
        longitude,
        latitude,
        zoom: Math.min(Math.max(zoom, 10), 15), // Clamp zoom level between 10 and 15.
      }));
    },
    [],
  );

  return (
    <div className="mapbox-container">
      {/* Render the Map component with markers and the property list */}
      <Map
        ref={mapRef} // Reference to interact with the map instance directly.
        {...viewState}
        onMove={onMove}
        mapboxAccessToken={MAPBOX_API_SECRET_KEY}
        style={{ width: "100%", height: 400 }}
        maxBounds={lowerMainlandBounds} // Restrict map bounds to lower mainland.
        mapStyle="mapbox://styles/mapbox/standard" // Use Mapbox standard style.
        interactiveLayerIds={[clusterLayer.id]} // Enable interaction with cluster layer.
      >
        <Source
          id="records"
          type="geojson"
          data={memoizedGeoJsonData} // Provide the map the memoized GeoJSON data.
          cluster={true} // Enable clustering of points.
          clusterMaxZoom={14} // Set max zoom level for clustering.
          clusterRadius={50} // Set the radius for clustering.
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      </Map>

      {/* Render the list of properties based on the currently visible features */}
      <div className="property-list">
        {visibleFeatures.length > 0 &&
          visibleFeatures.map((feature: Feature, index: number) => {
            // Assign each property ref to the corresponding index
            // @ts-expect-error: todo: fix this typing issue
            propertyRefs.current[index] =
              propertyRefs.current[index] || React.createRef();

            return (
              <div
                // @ts-expect-error: todo: fix this typing issue with this ref.
                ref={propertyRefs.current[index]}
                key={feature.properties.id}
              >
                <PropertyListItem
                  feature={feature}
                  setSelectedPropertyToLocateOnMap={
                    setSelectedPropertyToLocateOnMap
                  }
                  isSelected={
                    selectedPropertyToLocateOnMap === feature.properties.id
                  }
                />
              </div>
            );
          })}
      </div>
      {/* Pagination buttons for loading more items */}
      <div className="next-prev-button-container">
        <Box
          className="pagination-buttons"
          display="flex"
          justifyContent="space-between"
        >
          <Button
            onClick={loadPreviousItems}
            disabled={slidingWindowForVisibleFeatures.leftIdx === 0} // Disable if window is at the start of the paginated list.
            className="back-forward-button"
          >
            Load Previous {itemsPerPage}
          </Button>
          <Button
            onClick={loadNextItems}
            disabled={
              slidingWindowForVisibleFeatures.rightIdx >= features.length - 1 // Disable if window is at the end of the paginated list.
            }
            className="back-forward-button"
          >
            Load Next {itemsPerPage}
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default MapboxContainer;
