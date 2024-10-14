import { FC, RefObject } from "react";
import { PropertyListItem } from "@/app/shared-components/property-list-item/property-list-item";
import { ChangeFilterModalCB, Feature, PropertyToLocateOnMapCB } from "@/app/shared-components/react-mapbox/types";
import * as React from "react";
import { Button, Typography } from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import "./property-list.scss";

interface PropertyListProps {
  visibleFeatures: Feature[];
  propertyRefs: RefObject<(HTMLDivElement | null)[]>;
  handleChangePropertyToLocateOnMap: PropertyToLocateOnMapCB;
  selectedPropertyToLocateOnMap: string | null,
  handleOpenCloseFilterModal: ChangeFilterModalCB
}

const PropertyList: FC<PropertyListProps> = ({
  visibleFeatures,
  propertyRefs,
  handleChangePropertyToLocateOnMap,
  selectedPropertyToLocateOnMap,
  handleOpenCloseFilterModal
}) => {
  return (
    <div className="property-list-container">
      {/* Fixed filter options div */}
      <div className="filter-options">
        <Typography variant="body2" color="textSecondary" className="header-text">
          Vancouver resale data from 2023.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className="filter-button"
          onClick={(): void => handleOpenCloseFilterModal(true)}
        >
          Filter
          <FilterAltIcon className="filter-icon" /> {/* Place icon directly inside the button */}
        </Button>
      </div>
      {/* Scrollable property list */}
      <div className="property-list">
        {visibleFeatures.length > 0 &&
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
                  handleChangePropertyToLocateOnMap={handleChangePropertyToLocateOnMap}
                  isSelected={selectedPropertyToLocateOnMap === feature.properties.id}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PropertyList;
