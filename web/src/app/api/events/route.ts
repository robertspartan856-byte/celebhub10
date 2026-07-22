import { NextRequest, NextResponse } from "next/server";
import { events, getLowestEventPrice } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams;
  const city = search.get("city")?.toLowerCase() ?? "";
  const dateFrom = search.get("dateFrom") ?? "";
  const dateTo = search.get("dateTo") ?? "";
  const celebrity = search.get("celebrity")?.toLowerCase() ?? "";
  const searchText = search.get("search")?.toLowerCase() ?? "";
  const priceMinInput = Number(search.get("priceMin") ?? "0");
  const priceMaxInput = Number(search.get("priceMax") ?? "0");
  const priceMin = Number.isFinite(priceMinInput) && priceMinInput > 0 ? priceMinInput : 0;
  const priceMax = Number.isFinite(priceMaxInput) && priceMaxInput > 0 ? priceMaxInput : 0;
  const ticketType = search.get("ticketType") ?? "";
  const availability = search.get("availability") ?? "all";
  const pageInput = Number(search.get("page") ?? "1");
  const pageSizeInput = Number(search.get("pageSize") ?? "6");
  const page = Number.isFinite(pageInput) && pageInput > 0 ? Math.floor(pageInput) : 1;
  const pageSize = Number.isFinite(pageSizeInput) && pageSizeInput > 0 ? Math.floor(pageSizeInput) : 6;

  const filtered = events.filter((event) => {
    const eventDate = event.startAt.slice(0, 10);
    const lowestPrice = getLowestEventPrice(event);
    const totalAvailability = event.ticketTiers.reduce((sum, tier) => sum + tier.quantityAvailable, 0);

    const cityOk = !city || event.city.toLowerCase() === city;
    const dateFromOk = !dateFrom || eventDate >= dateFrom;
    const dateToOk = !dateTo || eventDate <= dateTo;
    const celebOk = !celebrity || event.celebrity.toLowerCase().includes(celebrity);
    const searchOk =
      !searchText ||
      event.title.toLowerCase().includes(searchText) ||
      event.city.toLowerCase().includes(searchText) ||
      event.venueName.toLowerCase().includes(searchText);
    const minOk = !priceMin || lowestPrice >= priceMin;
    const maxOk = !priceMax || lowestPrice <= priceMax;
    const typeOk = !ticketType || event.eventType === ticketType;
    const availabilityOk =
      availability === "all" || (availability === "available" ? totalAvailability > 0 : totalAvailability === 0);

    return cityOk && dateFromOk && dateToOk && celebOk && searchOk && minOk && maxOk && typeOk && availabilityOk;
  });

  const total = filtered.length;
  const start = (Math.max(page, 1) - 1) * Math.max(pageSize, 1);
  const paged = filtered.slice(start, start + pageSize);

  return NextResponse.json({
    data: paged,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / Math.max(pageSize, 1))),
    },
  });
}