"use client";

import * as React from "react";
import {
  ChangeEvent,
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MapRef, ViewStateChangeEvent } from "react-map-gl";
import {
  applyFiltersFromModal,
  calculateWindowLocation,
  generateGeoJsonDataFromMemoizedRecords, initializeWindowLocation,
  recalculateSelectedFeatureInGeoJsonDataCopy,
  setupMapListeners,
  zoomToSelectedProperty,
} from "@/app/shared-components/react-mapbox/helpers";
import {
  ChangeFilterModalCB,
  Feature,
  GeoJSONFeatureCollection,
  MapBoxContainerProps,
  MapViewState,
  NewWindowPointers,
  PropertyToLocateOnMapCB,
  SlidingWindowPointers,
} from "@/app/shared-components/react-mapbox/types";
import useWindowSize from "@/app/shared-components/react-mapbox/custom-hooks/useWindowSize";
import MapComponent from "@/app/shared-components/map-component/map-component";
import PropertyList from "@/app/shared-components/property-list/property-list";
import { FilterDataModal } from "@/app/shared-components/filter-data-modal/filter-data-modal";
import {
  FilterData,
  StringFilterFieldData,
} from "@/app/shared-components/filter-data-modal/types";
import {
  DEFAULT_MIN_PRICE,
  DEFAULT_MAX_SQUARE_FEET,
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_SQUARE_FEET,
  DEFAULT_MIN_BEDROOMS,
  DEFAULT_MAX_BEDROOMS,
  DEFAULT_MIN_BATHROOMS,
  DEFAULT_MAX_BATHROOMS,
} from "@/app/shared-components/filter-data-modal/contants";
import { SelectChangeEvent } from "@mui/material";
import "./mapbox-container.scss";
import "mapbox-gl/dist/mapbox-gl.css";

// Encapsulates the Mapbox map and is reusable across the Next.js app.
const MapboxContainer = ({ records }: MapBoxContainerProps) => {
  // Configuration for pagination.
  const maxVisibleFeatures: number = 10;

  // Reference to the Map component.
  const mapRef: RefObject<MapRef> = useRef<MapRef>(null);

  // Array of all the potential refs to attach to the elements generated below via visibleFeatures.
  const propertyRefs: MutableRefObject<(HTMLDivElement | null)[]> = useRef<
    (HTMLDivElement | null)[]
  >([]);

  // State to manage opening and closing the modal to filer the property data.
  const [openFilterModal, setOpenFilterModal] = useState<boolean>(false);

  // State to keep track of if the user wants to have filters enabled or not.
  const [enableFilters, setEnableFilters] = useState<boolean>(false);

  // State to keep track fo the current filters set in the modal.
  const [filters, setFilters] = useState<FilterData>({
    squareFeet: {
      min: DEFAULT_MIN_SQUARE_FEET.toString(),
      max: DEFAULT_MAX_SQUARE_FEET.toString(),
    },
    bedrooms: { min: DEFAULT_MIN_BEDROOMS, max: DEFAULT_MAX_BEDROOMS },
    bathrooms: { min: DEFAULT_MIN_BATHROOMS, max: DEFAULT_MAX_BATHROOMS },
    price: {
      min: DEFAULT_MIN_PRICE.toString(),
      max: DEFAULT_MAX_PRICE.toString(),
    },
  });

  // State management for the map's current view.
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

  // Create a copy of originalGeoJsonData on mount that will be used to modify when the user filters properties
  const [geoJsonDataCopy, setGeoJsonDataCopy] =
    useState<GeoJSONFeatureCollection | null>(null);

  // Memoized GeoJSON data derived from the records - this is read only and should never be modified.
  const originalGeoJsonData: GeoJSONFeatureCollection =
    useMemo((): GeoJSONFeatureCollection => {
      return generateGeoJsonDataFromMemoizedRecords(records, null);
    }, [records]);

  // Choose to use geoJsonDataCopy if it exists, otherwise fallback to originalGeoJsonData.
  const currentGeoJsonData: GeoJSONFeatureCollection =
    geoJsonDataCopy ?? originalGeoJsonData;
  const { features }: GeoJSONFeatureCollection = currentGeoJsonData;
  const { length }: Feature[] = features;

  // Custom hook to calculate the window size.
  const { width } = useWindowSize();
  const isDesktop: boolean = width !== undefined && width >= 992; // Assuming 992px is your breakpoint

  // When the originalGeoJsonData is fetched on first page load from the API, copy it into geoJsonDataCopy.
  useEffect((): void => {
    setGeoJsonDataCopy(originalGeoJsonData);
  }, [originalGeoJsonData]);

  // // recalculate the geoJsonDataCopy whenever selectedPropertyToLocateOnMap changes.
  // useEffect((): void => {
  //   const recalculatedGeoJsonData: GeoJSONFeatureCollection | null =
  //     recalculateSelectedFeatureInGeoJsonDataCopy(
  //       geoJsonDataCopy,
  //       selectedPropertyToLocateOnMap,
  //     );
  //   if (!recalculatedGeoJsonData) return;
  //   setGeoJsonDataCopy(recalculatedGeoJsonData);
  //   // I only ever want this to fire when selectedPropertyToLocateOnMap changes not geoJsonDataCopy but eslint complains.
  // }, [selectedPropertyToLocateOnMap]);

  // Effect to scroll to the selected property into view when it is selected from a map marker.
  useEffect(() => {
    if (selectedPropertyToLocateOnMap) {
      const index: number = visibleFeatures.findIndex(
        (feature: Feature): boolean =>
          feature.properties.id === selectedPropertyToLocateOnMap,
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
    currentGeoJsonData,
    selectedPropertyToLocateOnMap,
    setSelectedPropertyToLocateOnMap,
  ]);

  // Effect to adjust the sliding window based on the selected map marker/property.
  useEffect(() => {
    const windowPointers: NewWindowPointers | undefined =
      calculateWindowLocation(
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

  // Callback function to handle state responsible for opening the modal in this component.
  const handleOpenCloseFilterModal: ChangeFilterModalCB = (
    action: boolean,
  ): void => {
    setOpenFilterModal(action);
  };

  // Callback function to handle updating the selected property on map encapsulated to this component.
  const handleChangePropertyToLocateOnMap: PropertyToLocateOnMapCB = (
    id: string,
  ): void => {
    // Update the selected property first
    setSelectedPropertyToLocateOnMap(id);
    
    // Recalculate geoJsonDataCopy based on the new selected property
    const recalculatedGeoJsonData: GeoJSONFeatureCollection | null =
      recalculateSelectedFeatureInGeoJsonDataCopy(
        geoJsonDataCopy,
        id,
      );
    
    // If recalculated data is valid, update the geoJsonDataCopy state
    if (recalculatedGeoJsonData) {
      setGeoJsonDataCopy(recalculatedGeoJsonData);
    }
  };

  const handleApplyFilters: any = (): void => {
    const filteredFeatures: Feature[] = applyFiltersFromModal(
      originalGeoJsonData,
      filters,
    );

    // Clear visible features if filtered results are empty
    if (filteredFeatures.length === 0) {
      setVisibleFeatures([]);
    } else {
      // Initialize window pointers for the filtered features.
      const { newLeftIdx, newRightIdx}: NewWindowPointers = initializeWindowLocation(
        filteredFeatures,
        maxVisibleFeatures,
      );
      
      // Update the sliding window state.
      setSlidingWindowForVisibleFeatures({
        leftIdx: newLeftIdx,
        rightIdx: newRightIdx,
      });
      
      // Update geoJsonDataCopy with the filtered features
      setGeoJsonDataCopy((prevState: GeoJSONFeatureCollection | null) => ({
        ...prevState,
        type: prevState?.type || "FeatureCollection",
        features: filteredFeatures,
      }));
    }
    setOpenFilterModal(false);
  };

  // Callback function to handle updating the enable/disable filters toggle.
  const handleChangeEnableFilters: any = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const newValue: boolean = event.target.checked;

    // If the user is disabling the toggle, reset the filters on the dataCopy to the original.
    if (!newValue) {
      setGeoJsonDataCopy(originalGeoJsonData);
    }

    setEnableFilters(newValue);
  };

  // Methods that handle updating the state of the user's selected filters.
  const handleInputChange: any =
    (
      categoryKey: keyof FilterData,
      categoryTypeKey: keyof StringFilterFieldData,
    ): any =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const value: string = event.target.value;
      setFilters({
        ...filters,
        [categoryKey]: { ...filters[categoryKey], [categoryTypeKey]: value },
      });
    };

  const handleSelectChange: any =
    (key: keyof FilterData, isMin: boolean): any =>
    (event: SelectChangeEvent<number>): void => {
      const value = event.target.value as number;
      setFilters({
        ...filters,
        [key]: { ...filters[key], [isMin ? "min" : "max"]: value },
      });
    };
  
  return (
    <div className="mapbox-container">
      <FilterDataModal
        {...{
          handleOpenCloseFilterModal,
          openFilterModal,
          handleApplyFilters,
          handleInputChange,
          handleSelectChange,
          filters,
          enableFilters,
          handleChangeEnableFilters,
        }}
      />
      {isDesktop ? (
        <>
          <PropertyList
            {...{
              visibleFeatures,
              propertyRefs,
              handleChangePropertyToLocateOnMap,
              selectedPropertyToLocateOnMap,
              handleOpenCloseFilterModal,
              filters,
              enableFilters,
              geoJsonDataCopy,
            }}
          />
          <MapComponent
            {...{
              viewState,
              mapRef,
              currentGeoJsonData,
              onMove,
            }}
          />
        </>
      ) : (
        <>
          <MapComponent
            {...{
              viewState,
              mapRef,
              currentGeoJsonData,
              onMove,
            }}
          />
          <PropertyList
            {...{
              visibleFeatures,
              propertyRefs,
              handleChangePropertyToLocateOnMap,
              selectedPropertyToLocateOnMap,
              handleOpenCloseFilterModal,
              filters,
              enableFilters,
              geoJsonDataCopy,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MapboxContainer;
