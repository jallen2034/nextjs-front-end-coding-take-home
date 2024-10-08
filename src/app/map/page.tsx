import React from "react";
import MapboxContainer from "@/app/shared-components/react-mapbox/mapbox-container"

// Default export for the map page.
const MapPage = () => {
  return (
    <div className="map-main-container">
      Hello, I will be the map page :)
      <div>
        <MapboxContainer/>
      </div>
    </div>
  );
};

export default MapPage;