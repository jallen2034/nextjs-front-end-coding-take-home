import React from "react";
import dynamic from "next/dynamic"; // Import dynamic from next/dynamic
import { readAndParseCSV } from "@/app/map/helpers";
import { ResaleDataFromAPI } from "@/app/map/types";

// Dynamically import MapboxContainer with SSR disabled.
// https://nextjs.org/docs/messages/react-hydration-error
const MapboxContainer = dynamic(
  () => import("@/app/shared-components/react-mapbox/mapbox-container"),
  {
    ssr: false, // Disable SSR for this component.
  },
);

// This component is initially rendered on the server, enabling secure data fetching
// such as accessing a database or, in this case, reading a CSV file containing
// Vancouver resale data from 2023.
const MapPage = async () => {
  // Read the CSV file located in the public directory.
  const records: ResaleDataFromAPI = await readAndParseCSV();

  return (
    <div className="map-main-container">
      <MapboxContainer
        {...{
          records,
        }}
      />
    </div>
  );
};

export default MapPage;
