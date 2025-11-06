import { Event, PriceTier, PriceMismatch } from "./types";

/**
 * Validates a price tier against the fee rules:
 * - Price <= $12: squadup_fee_dollar should be $1
 * - Price > $12: squadup_fee_dollar should be $2
 */
export function validatePriceTier(
  priceTier: PriceTier,
  eventName: string,
  eventId: number
): PriceMismatch | null {
  const price = parseFloat(priceTier.price);
  const squadupFee = parseFloat(priceTier.squadup_fee_dollar);

  let expectedFee: number;

  if (price <= 12) {
    expectedFee = 1;
  } else {
    expectedFee = 2;
  }

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
 * Finds all price tier mismatches across all events
 */
export function findPriceMismatches(events: Event[]): PriceMismatch[] {
  const mismatches: PriceMismatch[] = [];

  for (const event of events) {
    // Combine event name and name_line_2 if present
    const eventName = event.name_line_2
      ? `${event.name} - ${event.name_line_2}`
      : event.name;

    // Check each price tier
    for (const priceTier of event.price_tiers) {
      const mismatch = validatePriceTier(priceTier, eventName, event.id);
      if (mismatch) {
        mismatches.push(mismatch);
      }
    }
  }

  return mismatches;
}
