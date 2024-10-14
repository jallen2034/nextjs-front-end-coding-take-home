import {
  FilterData,
  FilterDataErrors,
  ValidateModalInputReturnVals,
} from "@/app/shared-components/filter-data-modal/types";

// Helper function to validate the input of the filters
const validateModalInput = (
  filters: FilterData,
): ValidateModalInputReturnVals => {
  // Build our object of all potential validation errors on the modal the user could possibly run into.
  const errors: FilterDataErrors = {
    squareFeet: { min: "", max: "" },
    bedrooms: { min: "", max: "" },
    bathrooms: { min: "", max: "" },
    price: { min: "", max: "" },
  };
  
  // Destructure the filters for better readability.
  const {
    squareFeet: { min: minSquareFeet, max: maxSquareFeet },
    bedrooms: { min: minBedrooms, max: maxBedrooms },
    bathrooms: { min: minBathrooms, max: maxBathrooms },
    price: { min: minPrice, max: maxPrice },
  }: FilterData = filters;
  
  // Validate Square Feet.
  const parsedMinSquareFeet: number = parseFloat(minSquareFeet);
  const parsedMaxSquareFeet: number = parseFloat(maxSquareFeet);
  
  if (minSquareFeet && isNaN(parsedMinSquareFeet)) {
    errors.squareFeet.min = "Min square feet must be a valid number.";
  } else if (parsedMinSquareFeet < 1) {
    errors.squareFeet.min = "Min square feet cannot be negative or less than 1.";
  }
  
  if (maxSquareFeet && isNaN(parsedMaxSquareFeet)) {
    errors.squareFeet.max = "Max square feet must be a valid number.";
  } else if (parsedMaxSquareFeet < 1) {
    errors.squareFeet.max = "Max square feet cannot be negative or less than 1.";
  }
  
  if (
    minSquareFeet &&
    maxSquareFeet &&
    parsedMinSquareFeet > parsedMaxSquareFeet
  ) {
    errors.squareFeet.max = "Max square feet must be greater than Min square feet.";
  }
  
  // Validate Bedrooms.
  if (minBedrooms > maxBedrooms) {
    errors.bedrooms.max = "Max bedrooms must be greater than Min bedrooms.";
  }
  
  // Validate Bathrooms.
  if (minBathrooms > maxBathrooms) {
    errors.bathrooms.max = "Max bathrooms must be greater than Min bathrooms.";
  }
  
  // Validate Price.
  const parsedMinPrice: number = parseFloat(minPrice);
  const parsedMaxPrice: number = parseFloat(maxPrice);
  
  if (minPrice && isNaN(parsedMinPrice)) {
    errors.price.min = "Min price must be a valid number.";
  } else if (parsedMinPrice < 1) {
    errors.price.min = "Min price cannot be a negative number or 0.";
  }
  
  if (maxPrice && isNaN(parsedMaxPrice)) {
    errors.price.max = "Max price must be a valid number.";
  } else if (parsedMaxPrice < 1) {
    errors.price.max = "Max price cannot be a negative number or 0.";
  }
  
  if (minPrice && maxPrice && parsedMinPrice > parsedMaxPrice) {
    errors.price.max = "Max price must be greater than Min price.";
  }
  
  // Check if any errors exist.
  const hasErrors: boolean = Object.values(errors).some((error: any): boolean =>
    Object.values(error).some((errMsg: any): any => errMsg),
  );
  
  return { errors, hasErrors };
};

export { validateModalInput };
