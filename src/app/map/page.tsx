import React from "react"
import MapboxContainer from "@/app/shared-components/react-mapbox/mapbox-container"
import { readAndParseCSV } from "@/app/map/helpers"
import { ResaleData } from "@/app/map/types"

/* This component is initially rendered on the server, enabling secure data fetching
 * such as accessing a database or, in this case, reading a CSV file containing
 * Vancouver resale data from 2023. For more details, refer to:
 * https://vercel.com/guides/loading-static-file-nextjs-api-route */
const MapPage = async () => {
  // Read the CSV file located in the public directory.
  const records: ResaleData = await readAndParseCSV();

  return (
    <div className="map-main-container">
      <MapboxContainer {...{
        records
      }} />
    </div>
  )
}

export default MapPage