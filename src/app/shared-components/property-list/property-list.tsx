import { Dispatch, FC, RefObject, SetStateAction } from "react";
import { PropertyListItem } from "@/app/shared-components/property-list-item/property-list-item";
import { Feature } from "@/app/shared-components/react-mapbox/types";
import * as React from "react";
import "./property-list.scss";

interface PropertyListProps {
  visibleFeatures: Feature[];
  propertyRefs: RefObject<(HTMLDivElement | null)[]>;
  setSelectedPropertyToLocateOnMap: Dispatch<SetStateAction<string | null>>
  selectedPropertyToLocateOnMap: string | null;
}

const PropertyList: FC<PropertyListProps> = ({
  visibleFeatures,
  propertyRefs,
  setSelectedPropertyToLocateOnMap,
  selectedPropertyToLocateOnMap,
}) => {
  return (
    <div className="property-list-container">
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
                  setSelectedPropertyToLocateOnMap={setSelectedPropertyToLocateOnMap}
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