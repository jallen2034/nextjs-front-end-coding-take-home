import { useState } from "react";
import Map, { Source, Layer, MapRef } from "react-map-gl";
import { GeoJSONFeatureCollection } from "@/app/shared-components/react-mapbox/types";
import { MAPBOX_API_SECRET_KEY } from "@/app/apiUtils";
import { lowerMainlandBounds } from "@/app/shared-components/react-mapbox/helpers";
import {
  clusterCountLayer,
  clusterLayer, unclusteredPointLayer
} from "@/app/shared-components/react-mapbox/mapbox-styles";
import "./map-component.scss"

interface MapComponentProps {
  viewState: any;
  mapRef: React.RefObject<MapRef>;
  memoizedGeoJsonData: GeoJSONFeatureCollection;
  onMove: any
}

const MapComponent = ({
  viewState,
  mapRef,
  memoizedGeoJsonData,
  onMove
}: MapComponentProps) => {
  const [isMapLoaded, setIsMapLoadedInternal] = useState<boolean>(false);
  
  return (
    <div className="map-wrapper">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={onMove}
        mapboxAccessToken={MAPBOX_API_SECRET_KEY}
        style={{ width: "100%", height: "100%" }}
        maxBounds={lowerMainlandBounds}
        mapStyle="mapbox://styles/mapbox/standard"
        interactiveLayerIds={[clusterLayer.id]}
        onLoad={(): void => setIsMapLoadedInternal(true)} // Update internal state when map loads
      >
        {isMapLoaded && (
          <Source
            id="records"
            type="geojson"
            data={memoizedGeoJsonData}
            cluster={true}
            clusterMaxZoom={10}
            clusterRadius={50}
          >
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredPointLayer} />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;