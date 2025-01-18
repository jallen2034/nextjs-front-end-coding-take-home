import React from 'react'
import {ResaleDataFromAPI} from "@/app/map/types";
import {readAndParseCSV} from "@/app/map/helpers";
import {PaginationContainer} from "@/app/shared-components/PaginationContainer/pagination-container";

const PaginationPage = async () => {
  // Read the CSV file located in the public directory.
  const records: ResaleDataFromAPI = await readAndParseCSV();
  
  console.log({ records });

  return (
    <div className="pagination-page">
      <div className="items-container">{/* Render your items here */}</div>
      <PaginationContainer records={records} />
    </div>
  );
};

export default PaginationPage;