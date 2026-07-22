import Link from "next/link";
import { headers } from "next/headers";
import { EventRecord } from "@/lib/types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const dynamic = "force-dynamic";

type EventsPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = searchParams;
  const pageInput = typeof params.page === "string" ? Number.parseInt(params.page, 10) : 1;
  const page = Number.isFinite(pageInput) && pageInput > 0 ? pageInput : 1;
  const pageSize = 6;

  const query = new URLSearchParams();
  const passthrough = [
    "city",
    "dateFrom",
    "dateTo",
    "celebrity",
    "priceMin",
    "priceMax",
    "ticketType",
    "availability",
    "search",
  ] as const;

  passthrough.forEach((key) => {
    const raw = params[key];
    if (typeof raw === "string" && raw.length > 0) {
      query.set(key, raw);
    }
  });

  query.set("page", String(page));
  query.set("pageSize", String(pageSize));

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `${protocol}://${host}`;

  const response = await fetch(`${baseUrl}/api/events?${query.toString()}`, {
    cache: "no-store",
  });
  const payload = (await response.json()) as {
    data: EventRecord[];
    meta: { total: number; page: number; pageSize: number; totalPages: number };
  };

  const hasData = payload.data.length > 0;

  const makePageHref = (nextPage: number) => {
    const nextParams = new URLSearchParams(query);
    nextParams.set("page", String(nextPage));
    return `/events?${nextParams.toString()}`;
  };

  const isFirstPage = payload.meta.page <= 1;
  const isLastPage = payload.meta.page >= payload.meta.totalPages;

  return (
    <main className="section-shell py-8">
      <h1 className="text-3xl font-black">Events Catalog</h1>
      <p className="visually-muted mt-2 text-sm">Find shows by city, date, celebrity, ticket type, and availability.</p>

      <form className="glass mt-5 grid gap-3 rounded-xl p-4 md:grid-cols-4" action="/events" method="get" aria-label="Event filters">
        <label className="text-xs">
          City
          <input name="city" defaultValue={typeof params.city === "string" ? params.city : ""} className="focus-ring mt-1 w-full rounded-md border border-white/20 bg-[#0f1420] px-2 py-2" />
        </label>
        <label className="text-xs">
          Date from
          <input name="dateFrom" type="date" defaultValue={typeof params.dateFrom === "string" ? params.dateFrom : ""} className="focus-ring mt-1 w-full rounded-md border border-white/20 bg-[#0f1420] px-2 py-2" />
        </label>
        <label className="text-xs">
          Date to
          <input name="dateTo" type="date" defaultValue={typeof params.dateTo === "string" ? params.dateTo : ""} className="focus-ring mt-1 w-full rounded-md border border-white/20 bg-[#0f1420] px-2 py-2" />
        </label>
        <label className="text-xs">
          Celebrity
          <input name="celebrity" defaultValue={typeof params.celebrity === "string" ? params.celebrity : ""} className="focus-ring mt-1 w-full rounded-md border border-white/20 bg-[#0f1420] px-2 py-2" />
        </label>
        <label className="text-xs">
          Price Min
          <input name="priceMin" type="number" min="0" defaultValue={typeof params.priceMin === "string" ? params.priceMin : ""} className="focus-ring mt-1 w-full rounded-md border border-white/20 bg-[#0f1420] px-2 py-2" />
        </label>
        <label className="text-xs">
          Price Max
          <input name="priceMax" type="number" min="0" defaultValue={typeof params.priceMax === "string" ? params.priceMax : ""} className="focus-ring mt-1 w-full rounded-md border border-white/20 bg-[#0f1420] px-2 py-2" />
        </label>
        <label className="text-xs">
          Ticket Type
          <select name="ticketType" defaultValue={typeof params.ticketType === "string" ? params.ticketType : ""} className="focus-ring mt-1 w-full rounded-md border border-white/20 bg-[#0f1420] px-2 py-2">
            <option value="">Any</option>
            <option value="reserved_seating">Reserved Seating</option>
            <option value="general_admission">General Admission</option>
          </select>
        </label>
        <label className="text-xs">
          Availability
          <select name="availability" defaultValue={typeof params.availability === "string" ? params.availability : "all"} className="focus-ring mt-1 w-full rounded-md border border-white/20 bg-[#0f1420] px-2 py-2">
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="sold_out">Sold Out</option>
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button className="focus-ring h-10 rounded-full bg-[var(--accent)] px-4 text-xs font-bold text-black" type="submit">
            Apply Filters
          </button>
          <Link href="/events" className="focus-ring h-10 rounded-full border border-white/25 px-4 py-2 text-xs">
            Reset
          </Link>
        </div>
      </form>

      {hasData ? (
        <>
          <p className="mt-4 text-xs text-[var(--muted)]" aria-live="polite">
            Showing {payload.data.length} of {payload.meta.total} events
          </p>
          <section className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3" aria-label="Event result list">
            {payload.data.map((event) => {
              const totalAvailability = event.ticketTiers.reduce((sum, tier) => sum + tier.quantityAvailable, 0);
              return (
                <article key={event.id} className="glass card-tilt rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-[var(--accent)]">{formatDate(event.startAt)}</p>
                  <h2 className="mt-2 text-lg font-bold">{event.title}</h2>
                  <p className="visually-muted mt-1 text-sm">{event.city} · {event.venueName}</p>
                  <p className="mt-1 text-xs text-[var(--accent-2)]">{event.celebrity}</p>
                  <p className="mt-2 text-xs">Availability: {totalAvailability > 0 ? `${totalAvailability} tickets` : "Sold out"}</p>
                  <Link className="focus-ring mt-3 inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-black" href={`/events/${event.slug}`}>
                    Open Event Detail
                  </Link>
                </article>
              );
            })}
          </section>

          <nav className="mt-6 flex items-center gap-2" aria-label="Pagination">
            <Link
              href={makePageHref(Math.max(1, payload.meta.page - 1))}
              className={`focus-ring rounded-full border border-white/25 px-3 py-1 text-xs ${isFirstPage ? "pointer-events-none opacity-40" : ""}`}
              aria-disabled={isFirstPage}
              tabIndex={isFirstPage ? -1 : undefined}
            >
              Previous
            </Link>
            <span className="text-xs text-[var(--muted)]">
              Page {payload.meta.page} of {payload.meta.totalPages}
            </span>
            <Link
              href={makePageHref(Math.min(payload.meta.totalPages, payload.meta.page + 1))}
              className={`focus-ring rounded-full border border-white/25 px-3 py-1 text-xs ${isLastPage ? "pointer-events-none opacity-40" : ""}`}
              aria-disabled={isLastPage}
              tabIndex={isLastPage ? -1 : undefined}
            >
              Next
            </Link>
          </nav>
        </>
      ) : (
        <div className="glass mt-5 rounded-xl p-6 text-sm">No events match your filters. Try broadening city, date, or ticket type.</div>
      )}
    </main>
  );
}
