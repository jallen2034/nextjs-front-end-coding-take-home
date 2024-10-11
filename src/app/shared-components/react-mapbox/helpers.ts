// Define bounds for the Lower Mainland (northwest and southeast corners).
import { Property, ResaleDataFromAPI } from "@/app/map/types";
import {
  Feature,
  GeoJSONFeatureCollection,
  SlidingWindowPointers,
} from "@/app/shared-components/react-mapbox/types";
import { RefObject } from "react";
import { MapRef } from "react-map-gl";
import bbox from "@turf/bbox";
import { MapMouseEvent } from "mapbox-gl"; // Import the bbox utility to calculate bounding boxes.

const lowerMainlandBounds: [number, number, number, number] = [
  -123.6,
  49.0, // Southwest bound (longitude, latitude)
  -121.8,
  49.6, // Northeast bound (longitude, latitude) - Extended
];

// Helper function to get new indices for the sliding window when its moving right in the list of features.
const getNextIndicesForWindow = (
  rightIdx: number,
  itemsPerPage: number,
  maxVisibleFeatures: number,
  totalFeatures: number,
): SlidingWindowPointers => {
  const newRightIdx: number = Math.min(
    rightIdx + itemsPerPage,
    totalFeatures - 1,
  );
  const newLeftIdx: number = Math.max(newRightIdx - maxVisibleFeatures + 1, 0);
  return { leftIdx: newLeftIdx, rightIdx: newRightIdx };
};

// Helper function to get new indices for the sliding window when its moving left in the list of features.
const getPreviousIndicesForWindow = (
  leftIdx: number,
  itemsPerPage: number,
  maxVisibleFeatures: number,
  totalFeatures: number,
): SlidingWindowPointers => {
  const newLeftIdx: number = Math.max(leftIdx - itemsPerPage, 0);
  const newRightIdx: number = Math.min(
    newLeftIdx + maxVisibleFeatures - 1,
    totalFeatures - 1,
  );
  return { leftIdx: newLeftIdx, rightIdx: newRightIdx };
};

/* Helper function to take in our CSV data from the API on page load
 * and convert it into  an array of markers to render on the map. */
const generateGeoJsonDataFromMemoizedRecords = (
  memoizedRecords: ResaleDataFromAPI,
  selectedPropertyId: string | null,
): GeoJSONFeatureCollection => {
  const features: Feature[] = memoizedRecords.map((property: Property) => {
    const { longitude, latitude, id }: Property = property;

    // Determine icon size based on whether the property is selected
    const isSelected: boolean = selectedPropertyId === id;

    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      properties: {
        ...property,
        isSelected,
      },
    };
  });

  return {
    type: "FeatureCollection",
    features,
  };
};

// Helper function to take the ref to the map and zoom the map to the selected property.
const zoomToSelectedProperty = (
  selectedFeature: Feature,
  mapRef: RefObject<MapRef>,
): void => {
  if (selectedFeature && mapRef.current) {
    // @ts-expect-error: todo: fix this TS error with bbox wanting a correct Feature type def.
    const [minLng, minLat, maxLng, maxLat] = bbox(selectedFeature);
    
    // Fit the map to the bounding box.
    mapRef.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 40, duration: 1000 },
    );
  }
};

export const setupMapListeners = (
  map: MapRef,
  setSelectedPropertyToLocateOnMap: (id: string) => void
) => {
  const handleClick = (e: MapMouseEvent): void => {
    if (!e.features) return;
    const properties: Property = e.features[0].properties as Property;
    const { id }: Property = properties;
    setSelectedPropertyToLocateOnMap(id);
  };
  
  const handleMouseEnter = (): void => {
    map.getCanvas().style.cursor = "pointer"; // Change cursor to pointer
  };
  
  const handleMouseLeave = (): void => {
    map.getCanvas().style.cursor = ""; // Reset cursor style.
    // @ts-ignore
    map.off("mouseenter", "unclustered-point"); // Clean up mouse enter listener.
    // @ts-ignore
    map.off("mouseleave", "unclustered-point"); // Clean up mouse leave listener.
  };
  
  // Attach event listeners
  map.on("click", "unclustered-point", handleClick);
  map.on("mouseenter", "unclustered-point", handleMouseEnter);
  map.on("mouseleave", "unclustered-point", handleMouseLeave);
  
  // Return cleanup function
  return () => {
    // @ts-ignore
    map.off("click", "unclustered-point");
    // @ts-ignore
    map.off("mouseenter", "unclustered-point");
    // @ts-ignore
    map.off("mouseleave", "unclustered-point");
  };
};

export {
  lowerMainlandBounds,
  generateGeoJsonDataFromMemoizedRecords,
  zoomToSelectedProperty,
  getNextIndicesForWindow,
  getPreviousIndicesForWindow,
};
