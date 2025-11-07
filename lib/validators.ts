import { Event, PriceTier, PriceMismatch } from "./types";

export type VenueId = "10089636" | "7867604" | "9987142";

interface VenueRules {
  name: string;
  defaultFee: number;
  calculateExpectedFee: (price: number) => number;
}

/**
 * Venue-specific pricing rules
 */
const VENUE_RULES: Record<VenueId, VenueRules> = {
  "10089636": {
    // Colonial
    name: "Colonial",
    defaultFee: 1, // When squadup_fee_dollar is null
    calculateExpectedFee: (price: number) => {
      if (price <= 12) {
        return 1;
      } else {
        return 2;
      }
    },
  },
  "7867604": {
    // Elysian
    name: "Elysian",
    defaultFee: 2, // When squadup_fee_dollar is null
    calculateExpectedFee: (price: number) => {
      if (price <= 30) {
        return 2;
      } else {
        return 2.5;
      }
    },
  },
  "9987142": {
    // Gotham (placeholder - coming soon)
    name: "Gotham",
    defaultFee: 0,
    calculateExpectedFee: () => {
      // Placeholder rules - will be defined later
      return 0;
    },
  },
};

/**
 * Validates a price tier against venue-specific fee rules
 */
export function validatePriceTier(
  priceTier: PriceTier,
  eventName: string,
  eventId: number,
  venueId: VenueId
): PriceMismatch | null {
  const price = parseFloat(priceTier.price);

  // Skip validation if price data is invalid
  if (isNaN(price)) {
    return null;
  }

  const venueRules = VENUE_RULES[venueId];

  // If squadup_fee_dollar is null or empty, use venue's default fee
  let squadupFee: number;
  if (priceTier.squadup_fee_dollar === null || priceTier.squadup_fee_dollar === "") {
    squadupFee = venueRules.defaultFee;
  } else {
    squadupFee = parseFloat(priceTier.squadup_fee_dollar);
    // If parsing fails, skip validation
    if (isNaN(squadupFee)) {
      return null;
    }
  }

  const expectedFee = venueRules.calculateExpectedFee(price);

  // If the actual fee doesn't match the expected fee, it's a mismatch
  if (squadupFee !== expectedFee) {
    return {
      eventName,
      eventId,
      priceTierName: priceTier.name,
      priceTierId: priceTier.id,
      price,
      squadupFeeDollar: squadupFee,
      expectedFee,
    };
  }

  return null;
}

/**
 * Finds all price tier mismatches across all events for a specific venue
 */
export function findPriceMismatches(
  events: Event[],
  venueId: VenueId
): PriceMismatch[] {
  const mismatches: PriceMismatch[] = [];

  for (const event of events) {
    // Combine event name and name_line_2 if present
    const eventName = event.name_line_2
      ? `${event.name} - ${event.name_line_2}`
      : event.name;

    // Check each price tier at event level
    for (const priceTier of event.price_tiers) {
      const mismatch = validatePriceTier(priceTier, eventName, event.id, venueId);
      if (mismatch) {
        mismatches.push(mismatch);
      }
    }

    // Check price tiers within event_dates
    if (event.event_dates && event.event_dates.length > 0) {
      for (const eventDate of event.event_dates) {
        if (eventDate.price_tiers && eventDate.price_tiers.length > 0) {
          for (const priceTier of eventDate.price_tiers) {
            const mismatch = validatePriceTier(priceTier, eventName, event.id, venueId);
            if (mismatch) {
              mismatches.push(mismatch);
            }
          }
        }
      }
    }
  }

  return mismatches;
}

/**
 * Get venue name by ID
 */
export function getVenueName(venueId: VenueId): string {
  return VENUE_RULES[venueId].name;
}
