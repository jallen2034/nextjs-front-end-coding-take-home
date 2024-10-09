export interface CsvParseOptions {
  columns: boolean; // Parse CSV into objects with headers as keys
  skip_empty_lines: boolean; // Skip empty lines
  delimiter: string; // Field delimiter (e.g., ',')
  trim: boolean; // Trim whitespace around fields
}

export interface Property {
  id: string;
  area_sqft: string;
  bedrooms: string;
  bathrooms: string;
  price: string;
  date: string;
  address: string;
  latitude: string;
  longitude: string;
}

export type ResaleDataFromAPI = Property[];
