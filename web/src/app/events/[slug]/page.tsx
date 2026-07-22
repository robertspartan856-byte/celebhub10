import { notFound } from "next/navigation";
import { EventDetailClient } from "@/components/event-detail-client";
import { EventRecord } from "@/lib/types";

type EventDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function EventDetailPage({ params }: EventDetailProps) {
  const { slug } = await params;
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    "https://celebhub10-production.up.railway.app";
  const response = await fetch(`${apiBaseUrl}/api/events/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    notFound();
  }

  const payload = (await response.json()) as { data: EventRecord };

  return (
    <main className="section-shell py-8">
      <EventDetailClient event={payload.data} />
    </main>
  );
}
