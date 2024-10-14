import React from "react";
import { FilterData } from "@/app/shared-components/filter-data-modal/types";
import "./active-filters.scss"; // Add your styles here

interface ActiveFiltersProps {
  filters: FilterData;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ filters }) => {
  const filterBubbles: JSX.Element[] = [];
  
  // Create a currency formatter
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // This is actually CAD lol.
  });
  
  // Check for min and max values, including 0
  if (filters.squareFeet.min !== undefined || filters.squareFeet.max !== undefined) {
    filterBubbles.push(
      <span key="squareFeet" className="filter-bubble">
        {filters.squareFeet.min !== undefined && `sqft: min ${filters.squareFeet.min}`}
        {filters.squareFeet.max !== undefined && ` max ${filters.squareFeet.max}`}
      </span>
    );
  }
  
  if (filters.bedrooms.min !== undefined || filters.bedrooms.max !== undefined) {
    filterBubbles.push(
      <span key="bedrooms" className="filter-bubble">
        {filters.bedrooms.min !== undefined && `BR: min ${filters.bedrooms.min}`}
        {filters.bedrooms.max !== undefined && ` max ${filters.bedrooms.max}`}
      </span>
    );
  }
  
  if (filters.bathrooms.min !== undefined || filters.bathrooms.max !== undefined) {
    filterBubbles.push(
      <span key="bathrooms" className="filter-bubble">
        {filters.bathrooms.min !== undefined && `BA: min ${filters.bathrooms.min}`}
        {filters.bathrooms.max !== undefined && ` max ${filters.bathrooms.max}`}
      </span>
    );
  }
  
  if (filters.price.min !== undefined || filters.price.max !== undefined) {
    const minPrice: number = Number(filters.price.min); // Ensure it's a number
    const maxPrice: number = Number(filters.price.max); // Ensure it's a number
    
    filterBubbles.push(
      <span key="price" className="filter-bubble">
        {filters.price.min !== undefined && `Price: min ${currencyFormatter.format(minPrice)}`}
        {filters.price.max !== undefined && ` max ${currencyFormatter.format(maxPrice)}`}
      </span>
    );
  }
  
  return filterBubbles.length > 0 ? (
    <div className="active-filters-container">
      <div className="active-filters">{filterBubbles}</div>
    </div>
  ) : null;
};

export default ActiveFilters;
