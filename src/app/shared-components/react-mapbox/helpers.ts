// Define bounds for the Lower Mainland (northwest and southeast corners).
import { Property, ResaleDataFromAPI } from "@/app/map/types";
import { Feature, GeoJSONFeatureCollection } from "@/app/shared-components/react-mapbox/types";

const lowerMainlandBounds: [number, number, number, number] = [
  -123.6,
  49.0, // Southwest bound (longitude, latitude)
  -121.8,
  49.6, // Northeast bound (longitude, latitude) - Extended
];

/* Helper function to take in our CSV data from the API on page load
 * and convert it into  an array of markers to render on the map. */
const generateGeoJsonDataFromMemoizedRecords = (
  memoizedRecords: ResaleDataFromAPI,
): GeoJSONFeatureCollection => {
  // Map over the records to create GeoJSON features.
  const features: Feature[] = memoizedRecords.map(
    (property: Property) => {
      const { longitude, latitude }: Property = property;
      
      
      return {
        type: "Feature", // Each feature must have a type.
        geometry: {
          type: "Point", // The geometry type is Point.
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        properties: property,
      };
    },
  );

  // Return the GeoJSON FeatureCollection.
  return {
    type: "FeatureCollection",
    features,
  };
};

export { lowerMainlandBounds, generateGeoJsonDataFromMemoizedRecords };
