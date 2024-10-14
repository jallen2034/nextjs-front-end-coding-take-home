// Constants for dropdown options
const BEDROOM_OPTIONS: number[] = Array.from({ length: 10 }, (_, i) => i);
const BATHROOM_OPTIONS: number[] = Array.from({ length: 9 }, (_, i) => i + 1); // Bathrooms start from 1
const DEFAULT_MIN_BEDROOMS: number = 0;
const DEFAULT_MAX_BEDROOMS: number = 0;
const DEFAULT_MIN_BATHROOMS: number = 1;
const DEFAULT_MAX_BATHROOMS: number = 1;
const DEFAULT_MIN_SQUARE_FEET: number = 0;
const DEFAULT_MAX_SQUARE_FEET: number = 3000; // Max square feet constant
const DEFAULT_MIN_PRICE: number = 50000;
const DEFAULT_MAX_PRICE: number = 5000000;

export {
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
  DEFAULT_MAX_SQUARE_FEET,
  DEFAULT_MIN_PRICE,
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_SQUARE_FEET,
  DEFAULT_MIN_BEDROOMS,
  DEFAULT_MAX_BEDROOMS,
  DEFAULT_MIN_BATHROOMS,
  DEFAULT_MAX_BATHROOMS
}