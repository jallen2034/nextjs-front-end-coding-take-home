"use client";

import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as React from "react";
import Map, { ViewStateChangeEvent, Source, Layer, MapRef } from "react-map-gl";
import { MAPBOX_API_SECRET_KEY } from "@/app/apiUtils";
import {
  generateGeoJsonDataFromMemoizedRecords,
  getNextIndicesForWindow,
  getPreviousIndicesForWindow,
  lowerMainlandBounds,
} from "@/app/shared-components/react-mapbox/helpers";
import {
  Feature,
  GeoJSONFeatureCollection,
  MapBoxContainerProps,
  MapViewState,
  SlidingWindowPointers,
} from "@/app/shared-components/react-mapbox/types";
import { PropertyListItem } from "@/app/shared-components/property-list-item/property-list-item";
import { Box, Button } from "@mui/material";
import "./mapbox-container.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import bbox from "@turf/bbox"; // Import the bbox utility to calculate bounding boxes
import {
  clusterCountLayer,
  clusterLayer,
  unclusteredPointLayer,
} from "@/app/shared-components/react-mapbox/mapbox-styles";
import mapboxgl from "mapbox-gl";

// Encapsulates the Mapbox map and is reusable across the Next.js app.
const MapboxContainer = ({ records }: MapBoxContainerProps) => {
  // Create a reference for the Map component
  const mapRef: RefObject<MapRef> = useRef<MapRef>(null);
  
  // All state to keep track of in this component. note: if this gets too complex, might be worth using a custom hook.
  const [viewState, setViewState] = useState<MapViewState>({
    longitude: -123.1207,
    latitude: 49.2827,
    zoom: 9.5,
  });
  
  // State to keep track of the left and right pointer for the sliding window keeping track of the visible features.
  const [slidingWindowForVisibleFeatures, setSlidingWindowForVisibleFeatures] =
    useState<SlidingWindowPointers>({
      leftIdx: 0,
      rightIdx: 19,
    });
  
  // Add a state variable for selected property ID.
  const [selectedPropertyToLocateOnMap, setSelectedPropertyToLocateOnMap] =
    useState<string | null>(null);
  
  // State to load a smaller array of 20 items from the 4000 features as the sliding window goes across it.
  const [visibleFeatures, setVisibleFeatures] = useState<Feature[]>([]);

  // Number of items per page.
  const itemsPerPage: number = 10;
  const maxVisibleFeatures: number = 20;
  
  const memoizedGeoJsonData: GeoJSONFeatureCollection =
    useMemo((): GeoJSONFeatureCollection => {
      return generateGeoJsonDataFromMemoizedRecords(records, selectedPropertyToLocateOnMap);
    }, [records, selectedPropertyToLocateOnMap]);
  
  // Destructure properties we want from the memoizedGeoJsonData.
  const { features }: GeoJSONFeatureCollection = memoizedGeoJsonData;
  const { length }: Feature[] = features;
  
  // Helper function to load the next set of items, and slide the window over features right.
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

  // Helper function to load the previous set of items, and slide the window over features left.
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

  // Effect hook to update the visible features based on the current state of the sliding window.
  useEffect((): void => {
    if (length) {
      const { leftIdx, rightIdx } = slidingWindowForVisibleFeatures;
      const newVisibleFeatures: Feature[] = features.slice(
        leftIdx,
        rightIdx + 1,
      );
      setVisibleFeatures(newVisibleFeatures);
    }
  }, [features, length, slidingWindowForVisibleFeatures]);

  // Effect to listen for when 'selectedPropertyToLocateOnMap' changes, and "zero in" the map to that marker
  // https://github.com/visgl/react-map-gl/blob/7.1-release/examples/zoom-to-bounds/src/app.tsx
  useEffect((): void => {
    if (!selectedPropertyToLocateOnMap) {
      return;
    }
    
    const selectedFeature: Feature | undefined = features.find(
      (feature: Feature): boolean =>
        feature.properties.id === selectedPropertyToLocateOnMap,
    );
    
    if (selectedFeature && mapRef.current) {
      // Calculate the bounding box of the selected feature
      // @ts-expect-error: todo: fix this TS error with bbox wanting a correct Feature type def.
      const [minLng, minLat, maxLng, maxLat] = bbox(selectedFeature);
      
      // Fit the map to the bounding box.
      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat]
        ],
        { padding: 40, duration: 1000 } // Adjust padding and duration as needed.
      );
    }
  }, [features, selectedPropertyToLocateOnMap]);
  
  // Logic to handle moving around the map and looking at the markers.
  const onMove = useCallback(
    ({
      viewState: { longitude, latitude, zoom },
    }: ViewStateChangeEvent): void => {
      setViewState((prev: MapViewState) => ({
        ...prev,
        longitude,
        latitude,
        zoom: Math.min(Math.max(zoom, 10), 15),
      }));
    },
    [],
  );
  
  // useEffect(() => {
  //   const map = mapRef.current;
  //
  //   if (map) {
  //     // Add event listener for unclustered points
  //     map.on('click', 'unclustered-point', (e) => {
  //       const coordinates = e.features[0].geometry.coordinates.slice();
  //       const mag = e.features[0].properties.mag;
  //       const tsunami = e.features[0].properties.tsunami === 1 ? 'yes' : 'no';
  //
  //       // Make sure popup appears above the clicked marker
  //       while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
  //         coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  //       }
  //
  //       new mapboxgl.Popup()
  //       .setLngLat(coordinates)
  //       .setHTML(`Magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`)
  //       .addTo(map);
  //     });
  //
  //     // Clean up the event listener on unmount
  //     return () => {
  //       map.off('click', 'unclustered-point');
  //     };
  //   }
  // }, [mapRef, memoizedGeoJsonData]);
  
  return (
    <div className="mapbox-container">
      {/* Container containing the map and markers rendered on it for each property. */}
      <Map
        ref={mapRef} // Attach the ref to the Map component.
        {...viewState}
        onMove={onMove}
        mapboxAccessToken={MAPBOX_API_SECRET_KEY}
        style={{ width: "100%", height: 400 }}
        maxBounds={lowerMainlandBounds}
        mapStyle="mapbox://styles/mapbox/standard" // Updated to use the Mapbox Light style
        interactiveLayerIds={[clusterLayer.id]}
      >
        <Source
          id="records"
          type="geojson"
          data={memoizedGeoJsonData}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      </Map>
      <div className="property-list">
        {visibleFeatures.length > 0 &&
          visibleFeatures.map((feature: Feature) => (
            <PropertyListItem
              key={feature.properties.id}
              feature={feature}
              setSelectedPropertyToLocateOnMap={
                setSelectedPropertyToLocateOnMap
              }
            />
          ))}
      </div>
      <div className="next-prev-button-container">
        {/* Load Previous and Next buttons */}
        <Box
          className="pagination-buttons"
          display="flex"
          justifyContent="space-between"
        >
          <Button
            onClick={loadPreviousItems}
            disabled={slidingWindowForVisibleFeatures.leftIdx === 0}
            className="back-forward-button"
          >
            Load Previous {itemsPerPage}
          </Button>
          <Button
            onClick={loadNextItems}
            disabled={
              slidingWindowForVisibleFeatures.rightIdx >= features.length - 1
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
