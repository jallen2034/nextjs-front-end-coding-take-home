"use client"

// Import the CSS file for Mapbox GL JS
import 'mapbox-gl/dist/mapbox-gl.css';

import * as React from 'react';
import Map from 'react-map-gl';
import { MAPBOX_API_SECRET_KEY } from "@/app/apiUtils"

// Component to encapsulate the Map Box Container to be reusable if we want to use it in multiple places in our NextJS app.
function MapboxContainer() {
  return (
    <Map
      mapboxAccessToken={MAPBOX_API_SECRET_KEY}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14
      }}
      style={{ width: 600, height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
}

export default MapboxContainer;