// Define bounds for the Lower Mainland (northwest and southeast corners).
import { Property, ResaleDataFromAPI } from "@/app/map/types";
import {
  Feature,
  GeoJSONFeatureCollection,
  SlidingWindowPointers,
} from "@/app/shared-components/react-mapbox/types";

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

export {
  lowerMainlandBounds,
  generateGeoJsonDataFromMemoizedRecords,
  getNextIndicesForWindow,
  getPreviousIndicesForWindow,
};
