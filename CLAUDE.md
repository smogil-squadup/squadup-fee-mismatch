# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application that analyzes SquadUp event pricing tiers to identify fee mismatches. Built with TypeScript, React 19, and Tailwind CSS v4, it uses Turbopack for fast compilation and shadcn/ui components for a polished user interface.

### Purpose
The application helps event organizers identify pricing tiers that don't follow SquadUp's fee structure rules:
- Tickets priced ≤ $12.00 should have a $1.00 SquadUp fee
- Tickets priced > $12.00 should have a $2.00 SquadUp fee

## Key Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack at http://localhost:3000

# Build & Deploy
npm run build            # Build for production with Turbopack
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
```

## Architecture

### Framework & Tooling
- **Next.js 15** with App Router (not Pages Router)
- **Turbopack** enabled for both dev and build
- **Tailwind CSS v4** (note: newer version with different config approach)
- **TypeScript** with strict mode enabled

### Project Structure
- `app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with Geist fonts (sans and mono)
  - `page.tsx` - Main application page with user input and results display (client component)
  - `api/events/route.ts` - API route that fetches events from SquadUp API with pagination support
  - `globals.css` - Global styles and Tailwind directives
- `lib/` - Utility functions and business logic
  - `utils.ts` - Contains `cn()` helper for class name merging with clsx and tailwind-merge
  - `types.ts` - TypeScript interfaces for SquadUp API responses and app data models
  - `validators.ts` - Price tier validation logic and mismatch detection
- `components/` - React components
  - `ui/` - shadcn/ui components (button, input, table, badge, skeleton, card, alert)
  - `user-input-form.tsx` - Form component for User ID input
  - `price-mismatch-table.tsx` - Table component displaying pricing mismatches
- `public/` - Static assets

### Path Aliases
The project uses `@/*` to reference the root directory:
```typescript
import { cn } from "@/lib/utils"
import Component from "@/components/ui/button"
```

### shadcn/ui Configuration
The project is configured with shadcn/ui (see `components.json`):
- Style: "new-york"
- RSC: true (React Server Components enabled)
- Base color: neutral
- CSS variables: true
- Icon library: lucide-react
- Aliases configured for `@/components`, `@/lib`, `@/hooks`, etc.

When adding shadcn/ui components, they will be installed to `components/ui/` directory.

### Styling Approach
- Tailwind CSS v4 with CSS variables for theming
- Dark mode support via CSS classes
- Uses `cn()` utility from `lib/utils.ts` for conditional class merging
- Global styles in `app/globals.css`

### Fonts
- Geist Sans and Geist Mono are loaded via `next/font/google` in the root layout
- Font variables: `--font-geist-sans` and `--font-geist-mono`

## Application Flow

1. **User Input**: User selects a venue from the dropdown (Colonial or Elysian)
2. **API Call**: Client calls `/api/events?user_id={id}` which:
   - Fetches all events from SquadUp API (handles pagination automatically)
   - Validates all price tiers against venue-specific fee rules
   - Returns only mismatched price tiers
3. **Display Results**: Shows mismatches in a table with event and price tier details including a clickable link to edit the price tier in SquadUp admin

## SquadUp API Integration

### Endpoint
`https://www.squadup.com/api/v3/events?page_number={n}&page_size=100&user_ids={id}&include=price_tiers,event_dates`

### Key Response Fields
- `events[]` - Array of event objects
  - `id` - Event ID
  - `name` - Event title
  - `name_line_2` - Event subtitle (often featuring artists)
  - `price_tiers[]` - Array of pricing tier objects at event level
    - `id` - Price tier ID
    - `name` - Tier name (e.g., "General Admission", "Advanced")
    - `price` - Ticket price (string, needs parsing)
    - `squadup_fee_dollar` - SquadUp fee amount (string, needs parsing)
  - `event_dates[]` - Array of event date objects (optional)
    - `id` - Event date ID
    - `name` - Event date name (e.g., "Ticket Tiers")
    - `price_tiers[]` - Array of pricing tier objects within this event date
- `meta.paging.total_pages` - Total number of pages (for pagination)

**Note:** Price tiers can exist at two levels:
1. Directly on the event (`event.price_tiers`)
2. Within event dates (`event.event_dates[].price_tiers`)

The validator checks both locations to ensure complete coverage.

### Validation Rules
Implemented in [lib/validators.ts](lib/validators.ts) with venue-specific rules:

**Colonial (ID: 10089636)**
- If `price <= 12.00` → `squadup_fee_dollar` must equal `1.00`
- If `price > 12.00` → `squadup_fee_dollar` must equal `2.00`
- Default fee when `squadup_fee_dollar` is `null`: `1.00`

**Elysian (ID: 7867604)**
- If `price <= 30.00` → `squadup_fee_dollar` must equal `2.00`
- If `price > 30.00` → `squadup_fee_dollar` must equal `2.50`
- Default fee when `squadup_fee_dollar` is `null`: `2.00`

**Gotham (ID: 9987142)**
- Coming soon - placeholder rules currently in place

**Null Handling:**
When `squadup_fee_dollar` is `null` or empty in the API response, the validator uses the venue's default fee for comparison. This ensures price tiers with missing fee data are still validated against the correct baseline.

## Important Notes

- The project uses **Turbopack** by default - commands include `--turbopack` flag
- Next.js 15 uses the App Router, not the Pages Router
- React 19 is used (latest version with breaking changes from v18)
- ESLint is configured with Next.js core-web-vitals and TypeScript rules
- The API route handles pagination automatically by fetching the first page, checking total pages, then fetching remaining pages in parallel
- Price values from SquadUp API are strings and must be parsed to numbers for comparison
- The application supports multiple venues with different pricing rules via a centralized validation system in `lib/validators.ts`
- Each venue has its own fee calculation logic defined in the `VENUE_RULES` constant
