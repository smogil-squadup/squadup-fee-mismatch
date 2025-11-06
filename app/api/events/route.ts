import { NextRequest, NextResponse } from "next/server";
import { SquadUpApiResponse, Event } from "@/lib/types";
import { findPriceMismatches } from "@/lib/validators";

const SQUADUP_API_BASE = "https://www.squadup.com/api/v3/events";

/**
 * Fetches a single page of events from the SquadUp API
 */
async function fetchEventsPage(
  userId: string,
  pageNumber: number,
  pageSize: number = 100
): Promise<SquadUpApiResponse> {
  const url = `${SQUADUP_API_BASE}?page_number=${pageNumber}&page_size=${pageSize}&user_ids=${userId}&include=price_tiers`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // Don't cache to ensure fresh data
  });

  if (!response.ok) {
    throw new Error(`SquadUp API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches all pages of events from the SquadUp API
 */
async function fetchAllEvents(userId: string): Promise<Event[]> {
  const allEvents: Event[] = [];

  // Fetch first page to get total pages
  const firstPage = await fetchEventsPage(userId, 1);
  allEvents.push(...firstPage.events);

  const totalPages = firstPage.meta.paging.total_pages;

  // Fetch remaining pages in parallel
  if (totalPages > 1) {
    const remainingPages = Array.from(
      { length: totalPages - 1 },
      (_, i) => i + 2
    );

    const pagePromises = remainingPages.map((pageNum) =>
      fetchEventsPage(userId, pageNum)
    );

    const pages = await Promise.all(pagePromises);

    for (const page of pages) {
      allEvents.push(...page.events);
    }
  }

  return allEvents;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id parameter is required" },
        { status: 400 }
      );
    }

    // Validate userId is numeric
    if (!/^\d+$/.test(userId)) {
      return NextResponse.json(
        { error: "user_id must be a numeric value" },
        { status: 400 }
      );
    }

    // Fetch all events across all pages
    const events = await fetchAllEvents(userId);

    // Find price mismatches
    const mismatches = findPriceMismatches(events);

    return NextResponse.json({
      totalEvents: events.length,
      totalMismatches: mismatches.length,
      mismatches,
    });
  } catch (error) {
    console.error("Error fetching events:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch events from SquadUp API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
