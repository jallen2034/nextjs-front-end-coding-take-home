"use client"

import { useMemo } from "react"
import * as React from "react"
import { ResaleData } from "@/app/map/types"
import Map from "react-map-gl"
import { MAPBOX_API_SECRET_KEY } from "@/app/apiUtils"
import "mapbox-gl/dist/mapbox-gl.css"

interface MapBoxContainerProps {
  records: ResaleData
}

// Encapsulates the Mapbox map and is reusable across the Next.js app.
const MapboxContainer = ({ records }: MapBoxContainerProps) => {
  
  /* Memoize the records to prevent unnecessary recalculations on re-renders. Useful
   * for improving performance when handling static, large datasets from the server. */
  const memoizedRecords: ResaleData = useMemo(() => records, [records])
  console.log(memoizedRecords)
  
  return (
    <Map
      mapboxAccessToken={MAPBOX_API_SECRET_KEY}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: 600, height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  )
}

export default MapboxContainer