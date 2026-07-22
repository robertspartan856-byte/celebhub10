import { NextResponse } from "next/server";
import { events } from "@/lib/mock-data";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;
  const event = events.find((item) => item.slug === slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: event,
    seatMap: {
      mapType: event.eventType === "reserved_seating" ? "reserved" : "general_admission",
      lastUpdatedAt: new Date().toISOString(),
    },
  });
}