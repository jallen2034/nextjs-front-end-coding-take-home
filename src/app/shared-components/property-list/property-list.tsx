import { FC, RefObject } from "react";
import { PropertyListItem } from "@/app/shared-components/property-list-item/property-list-item";
import {
  ChangeFilterModalCB, Feature, GeoJSONFeatureCollection, PropertyToLocateOnMapCB,
} from "@/app/shared-components/react-mapbox/types";
import * as React from "react";
import { Button, Typography } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { FilterData } from "@/app/shared-components/filter-data-modal/types";
import ActiveFilters from "@/app/shared-components/Active-Filters-Bar/active-filters-bar";
import "./property-list.scss";

interface PropertyListProps {
  visibleFeatures: Feature[];
  propertyRefs: RefObject<(HTMLDivElement | null)[]>;
  handleChangePropertyToLocateOnMap: PropertyToLocateOnMapCB;
  selectedPropertyToLocateOnMap: string | null;
  handleOpenCloseFilterModal: ChangeFilterModalCB;
  filters: FilterData;
  enableFilters: boolean;
  geoJsonDataCopy: GeoJSONFeatureCollection | null;
}

const PropertyList: FC<PropertyListProps> = ({
  visibleFeatures,
  propertyRefs,
  handleChangePropertyToLocateOnMap,
  selectedPropertyToLocateOnMap,
  handleOpenCloseFilterModal,
  filters,
  enableFilters,
  geoJsonDataCopy
}) => {
  const resultsCount: number = geoJsonDataCopy ? geoJsonDataCopy.features.length : 0;
  
  return (
    <div className="property-list-container">
      {/* Fixed filter options div */}
      <div className="filter-options">
        <div>
          <Typography
            variant="body2"
            color="textSecondary"
            className="header-text"
          >
            Vancouver 2023 resale data.
          </Typography>
          {/* Render the results count */}
          <Typography variant="body2" color="textPrimary" className="results-count">
            {resultsCount} {resultsCount === 1 ? "result" : "results"} found
          </Typography>
          {/* Use the ActiveFilters component here */}
          {enableFilters && <ActiveFilters filters={filters} />}
        </div>
        <Button
          variant="contained"
          color="primary"
          className="filter-button"
          onClick={(): void => handleOpenCloseFilterModal(true)}
        >
          Filter
          <FilterAltIcon className="filter-icon" />
        </Button>
      </div>
      {/* Scrollable property list */}
      <div className="property-list">
        {visibleFeatures.length > 0 ? (
          visibleFeatures.map((feature: Feature, index: number) => {
            // @ts-ignore
            propertyRefs.current[index] = propertyRefs.current[index] || React.createRef();
            
            return (
              <div
                // @ts-ignore
                ref={propertyRefs.current[index]}
                key={feature.properties.id}
              >
                <PropertyListItem
                  feature={feature}
                  handleChangePropertyToLocateOnMap={
                    handleChangePropertyToLocateOnMap
                  }
                  isSelected={
                    selectedPropertyToLocateOnMap === feature.properties.id
                  }
                />
              </div>
            );
          })
        ) : (
          <div className="no-results-error-container">
            <Typography
              variant="h6"
              color="textSecondary"
              className="no-properties-message"
            >
              No properties found! Maybe they’re hiding? 😞
            </Typography>
            <Typography
              variant="h6"
              color="textSecondary"
              className="no-properties-message"
            >
              Let’s try some different filters! 🕵️‍♂️🔍
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
