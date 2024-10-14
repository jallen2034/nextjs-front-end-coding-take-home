// generateGeoJsonData.test.ts
import { ResaleDataFromAPI } from "@/app/map/types";
import { generateGeoJsonDataFromMemoizedRecords } from "@/app/shared-components/react-mapbox/helpers";
import { GeoJSONFeatureCollection } from "@/app/shared-components/react-mapbox/types";

describe('generateGeoJsonDataFromMemoizedRecords', (): void => {
  it('should convert an array of properties into a GeoJSON FeatureCollection', (): void => {
    const input: ResaleDataFromAPI = [
      {
        id: "1",
        area_sqft: "800",
        bedrooms: "2",
        bathrooms: "1",
        price: "500000",
        date: "2024-01-01",
        address: "123 Test St",
        latitude: "49.2827",
        longitude: "-123.1207",
        isSelected: false
      },
      {
        id: "2",
        area_sqft: "1200",
        bedrooms: "3",
        bathrooms: "2",
        price: "800000",
        date: "2024-02-01",
        address: "456 Sample Ave",
        latitude: "49.2828",
        longitude: "-123.1210",
        isSelected: false
      },
    ];
    
    const expectedOutput: GeoJSONFeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [-123.1207, 49.2827],
          },
          properties: {
            id: "1",
            area_sqft: "800",
            bedrooms: "2",
            bathrooms: "1",
            price: "500000",
            date: "2024-01-01",
            address: "123 Test St",
            latitude: "49.2827",
            longitude: "-123.1207",
            isSelected: false
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [-123.1210, 49.2828],
          },
          properties: {
            id: "2",
            area_sqft: "1200",
            bedrooms: "3",
            bathrooms: "2",
            price: "800000",
            date: "2024-02-01",
            address: "456 Sample Ave",
            latitude: "49.2828",
            longitude: "-123.1210",
            isSelected: false
          },
        },
      ],
    };
    
    const result: GeoJSONFeatureCollection = generateGeoJsonDataFromMemoizedRecords(input, null);
    expect(result).toEqual(expectedOutput);
  });
  
  it('should handle an empty input array', (): void => {
    const input: ResaleDataFromAPI = [];
    const expectedOutput: GeoJSONFeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
    
    const result: GeoJSONFeatureCollection = generateGeoJsonDataFromMemoizedRecords(input, null);
    expect(result).toEqual(expectedOutput);
  });
  
  it('should mark the selected property as isSelected', (): void => {
    const input: ResaleDataFromAPI = [
      {
        id: "1",
        area_sqft: "800",
        bedrooms: "2",
        bathrooms: "1",
        price: "500000",
        date: "2024-01-01",
        address: "123 Test St",
        latitude: "49.2827",
        longitude: "-123.1207",
        isSelected: false
      },
      {
        id: "2",
        area_sqft: "1200",
        bedrooms: "3",
        bathrooms: "2",
        price: "800000",
        date: "2024-02-01",
        address: "456 Sample Ave",
        latitude: "49.2828",
        longitude: "-123.1210",
        isSelected: false
      },
    ];
    
    const expectedOutput: GeoJSONFeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [-123.1207, 49.2827],
          },
          properties: {
            id: "1",
            area_sqft: "800",
            bedrooms: "2",
            bathrooms: "1",
            price: "500000",
            date: "2024-01-01",
            address: "123 Test St",
            latitude: "49.2827",
            longitude: "-123.1207",
            isSelected: false
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [-123.1210, 49.2828],
          },
          properties: {
            id: "2",
            area_sqft: "1200",
            bedrooms: "3",
            bathrooms: "2",
            price: "800000",
            date: "2024-02-01",
            address: "456 Sample Ave",
            latitude: "49.2828",
            longitude: "-123.1210",
            isSelected: true // This property should now be marked as selected :)
          },
        },
      ],
    };
    
    const result: GeoJSONFeatureCollection = generateGeoJsonDataFromMemoizedRecords(input, "2");
    expect(result).toEqual(expectedOutput);
  });
  
  it('should handle invalid latitude and longitude gracefully', (): void => {
    const input: ResaleDataFromAPI = [
      {
        id: "1",
        area_sqft: "800",
        bedrooms: "2",
        bathrooms: "1",
        price: "500000",
        date: "2024-01-01",
        address: "123 Test St",
        latitude: "invalid_latitude",
        longitude: "invalid_longitude",
        isSelected: false
      },
    ];
    
    const expectedOutput: GeoJSONFeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [NaN, NaN], // Invalid coordinates
          },
          properties: {
            id: "1",
            area_sqft: "800",
            bedrooms: "2",
            bathrooms: "1",
            price: "500000",
            date: "2024-01-01",
            address: "123 Test St",
            latitude: "invalid_latitude",
            longitude: "invalid_longitude",
            isSelected: false
          },
        },
      ],
    };
    
    const result: GeoJSONFeatureCollection = generateGeoJsonDataFromMemoizedRecords(input, null);
    expect(result).toEqual(expectedOutput);
  });
  
  // TODO: Add more relevant test cases in here when I have the bandwidth.
});
