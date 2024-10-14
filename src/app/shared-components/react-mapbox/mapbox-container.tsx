"use client";

import * as React from "react";
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MapRef, ViewStateChangeEvent } from "react-map-gl";
import {
  applyFiltersFromModal, calculateWindowLocationWhenMarkerClicked,
  generateGeoJsonDataFromMemoizedRecords,
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
import "./mapbox-container.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import useWindowSize from "@/app/shared-components/react-mapbox/custom-hooks/useWindowSize";
import MapComponent from "@/app/shared-components/map-component/map-component";
import PropertyList from "@/app/shared-components/property-list/property-list";
import { FilterDataModal } from "@/app/shared-components/filter-data-modal/filter-data-modal";

// Encapsulates the Mapbox map and is reusable across the Next.js app.
const MapboxContainer = ({ records }: MapBoxContainerProps) => {
  // Configuration for pagination.
  const maxVisibleFeatures: number = 10;

  // Reference to the Map component.
  const mapRef: RefObject<MapRef> = useRef<MapRef>(null);

  // Array of all the potential refs to attach to the elements generated below via visibleFeatures.
  const propertyRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State to manage opening and closing the modal to filer the property data.
  const [openFilterModal, setOpenFilterModal] = useState<boolean>(false);

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

  // Custom hook to calculate the window size.
  const { width } = useWindowSize();
  const isDesktop: boolean = width !== undefined && width >= 992; // Assuming 992px is your breakpoint

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
    setSelectedPropertyToLocateOnMap(id);
  };
  
  const handleApplyFilters: any = (): void => {
    const filteredMemoizedGeoJsonData: any = applyFiltersFromModal();
    console.log(filteredMemoizedGeoJsonData)
  }
  
  return (
    <div className="mapbox-container">
      <FilterDataModal {...{ handleOpenCloseFilterModal, openFilterModal, handleApplyFilters }} />
      {isDesktop ? (
        <>
          <PropertyList
            {...{
              visibleFeatures,
              propertyRefs,
              handleChangePropertyToLocateOnMap,
              selectedPropertyToLocateOnMap,
              handleOpenCloseFilterModal,
            }}
          />
          <MapComponent
            {...{
              viewState,
              mapRef,
              memoizedGeoJsonData,
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
              memoizedGeoJsonData,
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
            }}
          />
        </>
      )}
    </div>
  );
};

export default MapboxContainer;
