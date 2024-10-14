import { GeoJSONFeatureCollection } from "@/app/shared-components/react-mapbox/types";

export const calculatePageCount = (
  geoJsonDataCopy: GeoJSONFeatureCollection | null,
  itemsPerPage: number = 10
): number => {
  if (!geoJsonDataCopy || !geoJsonDataCopy.features) {
    return 0;
  }
  
  const totalFeatures: number = geoJsonDataCopy.features.length;
  return Math.ceil(totalFeatures / itemsPerPage);
};

export const calculateCurrentPage = (leftIdx: number): number => {
  // Calculate the current page based on leftIdx and rightIdx
  return Math.floor(leftIdx / 10) + 1; // Assuming 10 items per page
};