// Sample geoJsonDataCopy as per your provided structure
import { GeoJSONFeatureCollection } from "@/app/shared-components/react-mapbox/types";
import { calculateCurrentPage, calculatePageCount } from "@/app/shared-components/property-list/helpers";

const mockGeoJsonDataCopy: GeoJSONFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-123.06504, 49.23668],
      },
      properties: {
        id: "47679",
        area_sqft: "1004",
        bedrooms: "3",
        bathrooms: "2",
        price: "780000",
        date: "2023-01-05",
        latitude: "49.26151",
        longitude: "-123.05328",
        address: "2028 37TH AVENUE E",
        isSelected: false,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-123.06061, 49.20746],
      },
      properties: {
        id: "136281",
        area_sqft: "1229",
        bedrooms: "3",
        bathrooms: "2",
        price: "755000",
        date: "2023-02-17",
        latitude: "49.26151",
        longitude: "-123.05328",
        address: "2250 MARINE DRIVE SE",
        isSelected: false,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-123.02449, 49.23616],
      },
      properties: {
        id: "155693",
        area_sqft: "985",
        bedrooms: "3",
        bathrooms: "2",
        price: "720000",
        date: "2023-04-19",
        latitude: "49.26151",
        longitude: "-123.05328",
        address: "3680 RAE AVENUE",
        isSelected: false,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-123.05328, 49.26151],
      },
      properties: {
        id: "37003",
        area_sqft: "1012",
        bedrooms: "3",
        bathrooms: "2",
        price: "440000",
        date: "2023-08-25",
        latitude: "49.26151",
        longitude: "-123.05328",
        address: "2533 PENTICTON STREET",
        isSelected: false,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-123.02718, 49.23558],
      },
      properties: {
        id: "116299",
        area_sqft: "949",
        bedrooms: "3",
        bathrooms: "2",
        price: "745000",
        date: "2023-11-26",
        latitude: "49.26151",
        longitude: "-123.05328",
        address: "3663 CROWLEY DRIVE",
        isSelected: false,
      },
    },
  ],
};

// Tests for calculatePageCount
describe('calculatePageCount', () => {
  it('should return 0 if geoJsonDataCopy is null', (): void => {
    expect(calculatePageCount(null)).toBe(0);
  });
  
  it('should return 0 if geoJsonDataCopy has no features', (): void => {
    // Add the `type` property to the emptyGeoJsonData
    const emptyGeoJsonData: GeoJSONFeatureCollection = { type: "FeatureCollection", features: [] };
    expect(calculatePageCount(emptyGeoJsonData)).toBe(0);
  });
  
  it('should calculate correct page count for provided geoJsonDataCopy with default items per page (10)', () => {
    // The sample geoJsonDataCopy has 5 features
    expect(calculatePageCount(mockGeoJsonDataCopy)).toBe(1); // 5 items, 1 page with 10 items per page
  });
  
  // todo: add more detailed test cases with a bigger items array and more expected pages here.
});

// Tests for calculateCurrentPage
describe('calculateCurrentPage', (): void => {
  it('should return page 1 if leftIdx is 0', (): void => {
    expect(calculateCurrentPage(0)).toBe(1); // First page starts at index 0
  });
  
  it('should return page 2 if leftIdx is 10', (): void => {
    expect(calculateCurrentPage(10)).toBe(2); // Page 2 starts at index 10
  });
  
  it('should return page 3 if leftIdx is 20', (): void => {
    expect(calculateCurrentPage(20)).toBe(3); // Page 3 starts at index 20
  });
  
  it('should return page 4 if leftIdx is 30', (): void => {
    expect(calculateCurrentPage(30)).toBe(4); // Page 4 starts at index 30
  });
});