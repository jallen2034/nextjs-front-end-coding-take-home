// Constants for dropdown options
const BEDROOM_OPTIONS: number[] = Array.from({ length: 10 }, (_, i) => i);
const BATHROOM_OPTIONS: number[] = Array.from({ length: 9 }, (_, i) => i + 1); // Bathrooms start from 1
const MAX_SQUARE_FEET: number = 3000; // Max square feet constant

export {
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
  MAX_SQUARE_FEET
}