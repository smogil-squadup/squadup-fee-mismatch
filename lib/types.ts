export interface PriceTier {
  id: number;
  price: string;
  name: string;
  quantity: number;
  quantity_sold: number;
  fees_paid_by: string;
  min_quantity: number | null;
  max_quantity: number | null;
  qty_limit: number | null;
  min_order_qty: number | null;
  sort: number;
  priority: number;
  remaining_quantity: number;
  description: string | null;
  sales_start_date: string | null;
  sales_end_date: string | null;
  preceding_price_tier_id: number | null;
  willcall: boolean;
  eticket: boolean;
  shipped: boolean;
  added_fee_dollar: string;
  added_fee_percent: string;
  coming_soon: boolean;
  hidden: boolean;
  unhide_promo_code_id: number | null;
  package: boolean;
  package_quantity: number | null;
  default_delivery_method: string;
  event_id: number;
  allowed_bins: string[];
  sold_out: boolean;
  hide_on_sold_out: boolean;
  seats_io_category_key: string | null;
  unhide_on_gift_card: boolean;
  is_face_value: boolean;
  add_on: boolean;
  ticketless: boolean;
  squadup_fee_dollar: string;
  squadup_fee_percent: string | null;
  tags: string[];
  unlock_price_tier_ids: number[];
}

export interface Location {
  id: number | null;
  name: string;
  latitude: string;
  longitude: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  timezone_name: string;
}

export interface Host {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  subcategory: boolean;
}

export interface Image {
  thumbnail_url: string;
  default_url: string;
}

export interface EventDate {
  id: number;
  name: string;
  quantity_remaining: number;
  auto_expand: boolean;
  sold_out: boolean;
  min_qty: number | null;
  max_qty: number | null;
  price_tiers: PriceTier[];
}

export interface Event {
  id: number;
  name: string;
  name_line_2: string | null;
  url: string;
  start_at: string;
  end_at: string;
  ticketed: boolean;
  privacy: string;
  description: string;
  location: Location;
  host: Host;
  category: Category | null;
  image: Image;
  max_capacity: number;
  timezone_name: string;
  timezone_abbreviation: string;
  location_type: string;
  updated_at: string;
  created_at: string;
  price_tiers: PriceTier[];
  event_dates?: EventDate[];
}

export interface PagingMeta {
  total_pages: number;
}

export interface Meta {
  messages: string[];
  paging: PagingMeta;
}

export interface SquadUpApiResponse {
  events: Event[];
  meta: Meta;
}

export interface PriceMismatch {
  eventName: string;
  eventId: number;
  priceTierName: string;
  priceTierId: number;
  price: number;
  squadupFeeDollar: number;
  expectedFee: number;
}
