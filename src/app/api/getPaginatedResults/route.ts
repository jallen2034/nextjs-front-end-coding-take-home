import {NextResponse} from "next/server";
import {Property, ResaleDataFromAPI} from "@/app/map/types";
import {readAndParseCSV} from "@/app/map/helpers";

// Types for server response
export interface ServerPaginationResponse {
  data: Property[];
  total: number;
  currentPage: number;
}

export async function GET(request: Request) {
  try {
    // 1. Get pagination parameters from URL.
    const { searchParams } = new URL(request.url);
    const page: number = parseInt(searchParams.get('page') || '1');
    const limit: number = parseInt(searchParams.get('limit') || '100');

    // 2. Get all records from CSV
    const allRecords: ResaleDataFromAPI = await readAndParseCSV();

    // 3. Calculate pagination values
    const startIndex: number = (page - 1) * limit;
    const endIndex: number = startIndex + limit;

    // 4. Slice the data for the current page
    const paginatedData: Property[] = allRecords.slice(startIndex, endIndex);

    // 5. Prepare the response
    const response: ServerPaginationResponse = {
      data: paginatedData,
      total: allRecords.length,
      currentPage: page
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in pagination API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch paginated results' },
      { status: 500 }
    );
  }
}