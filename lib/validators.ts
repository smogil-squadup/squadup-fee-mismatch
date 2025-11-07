import { Event, PriceTier, PriceMismatch } from "./types";

export type VenueId = "10089636" | "7867604" | "9987142";

interface VenueRules {
  name: string;
  calculateExpectedFee: (price: number) => number;
}

/**
 * Venue-specific pricing rules
 */
const VENUE_RULES: Record<VenueId, VenueRules> = {
  "10089636": {
    // Colonial
    name: "Colonial",
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
  const squadupFee = parseFloat(priceTier.squadup_fee_dollar);

  // Skip validation if price or fee data is invalid
  if (isNaN(price) || isNaN(squadupFee)) {
    return null;
  }

  const venueRules = VENUE_RULES[venueId];
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

    // Check each price tier
    for (const priceTier of event.price_tiers) {
      const mismatch = validatePriceTier(priceTier, eventName, event.id, venueId);
      if (mismatch) {
        mismatches.push(mismatch);
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
