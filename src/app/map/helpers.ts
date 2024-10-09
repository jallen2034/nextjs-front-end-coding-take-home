import { promises as fs } from "fs";
import { CsvParseOptions, ResaleDataFromAPI } from "@/app/map/types";
import { parse } from "csv-parse/sync";

const readAndParseCSV = async (): Promise<ResaleDataFromAPI> => {
  // Read the CSV file located in the public directory.
  const filePath: string = process.cwd() + "/public/data/resale-data.csv";
  let fileContent: string = await fs.readFile(filePath, "utf8");

  // Remove the BOM (Byte Order Mark) if it's present.
  if (fileContent.charCodeAt(0) === 0xfeff) {
    fileContent = fileContent.slice(1);
  }

  const CsvParseOptions: CsvParseOptions = {
    columns: true, // Return records as objects with column headers.
    skip_empty_lines: true, // Skip any empty lines.
    delimiter: ",", // Explicitly define the delimiter (comma in this case).
    trim: true, // Trim whitespace around fields.
  };

  // Parse the CSV content using csv-parse
  return parse(fileContent, CsvParseOptions);
};

export { readAndParseCSV };
