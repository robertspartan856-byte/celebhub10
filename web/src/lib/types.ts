export type TicketTier = {
  id: string;
  name: string;
  priceMinor: number;
  feeMinor: number;
  vatMinor: number;
  quantityAvailable: number;
};

export type EventRecord = {
  id: string;
  slug: string;
  title: string;
  city: string;
  celebrity: string;
  startAt: string;
  venueName: string;
  eventType: "reserved_seating" | "general_admission";
  status: "published" | "sold_out";
  refundPolicy: string;
  resalePolicy: string;
  imageAlt: string;
  ticketTiers: TicketTier[];
};

export type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  rarity: string;
  priceMinor: number;
  currency: string;
  tag?: string;
  description: string;
  edition: string;
  authenticityCode: string;
  delivery: string;
  stockLabel: string;
};

export type CartItem = {
  id: string;
  itemType: "ticket" | "fan_card";
  itemRef: string;
  title: string;
  quantity: number;
  unitPriceMinor: number;
  currency: string;
  metadata?: Record<string, string>;
};