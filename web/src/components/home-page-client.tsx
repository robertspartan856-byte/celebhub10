"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { CartPill } from "@/components/cart-pill";
import { useCart } from "@/components/cart-provider";
import { EventRecord, ProductRecord } from "@/lib/types";

type ApplicationState = {
  name: string;
  email: string;
  celebrity: string;
  tier: string;
  notes: string;
};

type HomePageClientProps = {
  events: EventRecord[];
  fanCards: ProductRecord[];
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMoney(minor: number) {
  return `$${(minor / 100).toFixed(2)}`;
}

export default function HomePageClient({ events, fanCards }: HomePageClientProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cityFilter, setCityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [application, setApplication] = useState<ApplicationState>({
    name: "",
    email: "",
    celebrity: "",
    tier: "VIP",
    notes: "",
  });
  const [applicationStatus, setApplicationStatus] = useState("");
  const { addItem } = useCart();

  const nearestEvent = useMemo(
    () => [...events].sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt))[0],
    [events],
  );

  const cities = useMemo(() => ["all", ...new Set(events.map((e) => e.city))], [events]);

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const cityMatches = cityFilter === "all" || event.city === cityFilter;
        const dateMatches = !dateFilter || event.startAt.slice(0, 10) >= dateFilter;
        return cityMatches && dateMatches;
      }),
    [events, cityFilter, dateFilter],
  );

  const addFanCardToCart = (card: ProductRecord) => {
    addItem({
      id: `fan-${card.id}`,
      itemType: "fan_card",
      itemRef: card.id,
      title: card.name,
      quantity: 1,
      unitPriceMinor: card.priceMinor,
      currency: card.currency,
      metadata: { rarity: card.rarity },
    });
  };

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setNewsletterStatus("Please enter a valid email address.");
      return;
    }
    if (!consent) {
      setNewsletterStatus("Please confirm consent to receive updates.");
      return;
    }

    localStorage.setItem(
      "celebhub-newsletter",
      JSON.stringify({ email, consent, subscribedAt: new Date().toISOString() }),
    );
    setNewsletterStatus("Subscribed. You are now first to hear about tickets and drops.");
    setEmail("");
    setConsent(false);
  };

  const handleApplicationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApplicationStatus("Submitting your application...");

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(application),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setApplicationStatus(payload.error || "Unable to submit application.");
      return;
    }

    setApplicationStatus("Application received. Our team will review it shortly.");
    setApplication({ name: "", email: "", celebrity: "", tier: "VIP", notes: "" });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,rgba(245,179,66,0.18),transparent_35%),linear-gradient(135deg,#0b0907_0%,#1a120e_100%)] text-[var(--foreground)]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090c13]/90 backdrop-blur">
        <div className="section-shell flex items-center justify-between py-3">
          <Link href="/" className="focus-ring text-xl font-extrabold tracking-tight text-[var(--accent)]">
            celebhub
          </Link>
          <button
            type="button"
            className="focus-ring rounded-md border border-white/25 px-3 py-1 text-sm md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            Menu
          </button>
          <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="Main navigation">
            <Link className="focus-ring hover:text-[var(--accent)]" href="/events">Events</Link>
            <Link className="focus-ring hover:text-[var(--accent)]" href="/fan-cards">Fan-Cards</Link>
            <Link className="focus-ring hover:text-[var(--accent)]" href="/celebrities">Celebrities</Link>
            <Link className="focus-ring hover:text-[var(--accent)]" href="/community">Community</Link>
            <Link className="focus-ring hover:text-[var(--accent)]" href="/help">Help</Link>
            <div className="flex items-center gap-2 pl-3">
              <CartPill />
              <Link className="focus-ring rounded-full border border-[var(--accent)]/55 px-4 py-2 text-xs" href="/login">Login</Link>
              <Link className="focus-ring rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-black" href="/signup">Sign Up</Link>
            </div>
          </nav>
        </div>
        {mobileNavOpen ? (
          <nav className="section-shell flex flex-col gap-3 border-t border-white/10 pb-4 pt-3 md:hidden" aria-label="Mobile navigation">
            <Link className="focus-ring py-1" href="/events">Events</Link>
            <Link className="focus-ring py-1" href="/fan-cards">Fan-Cards</Link>
            <Link className="focus-ring py-1" href="/celebrities">Celebrities</Link>
            <Link className="focus-ring py-1" href="/community">Community</Link>
            <Link className="focus-ring py-1" href="/help">Help</Link>
            <div className="mt-2 flex gap-2">
              <CartPill />
              <Link className="focus-ring rounded-full border border-[var(--accent)]/55 px-4 py-2 text-xs" href="/login">Login</Link>
              <Link className="focus-ring rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-black" href="/signup">Sign Up</Link>
            </div>
          </nav>
        ) : null}
      </header>

      <main>
        <section className="section-shell grid gap-6 pt-7 pb-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass relative overflow-hidden rounded-3xl border border-[#f5b342]/30 bg-[linear-gradient(135deg,rgba(245,179,66,0.18),rgba(255,255,255,0.04))] p-6 md:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(236,116,71,0.35),transparent_70%)]" aria-hidden="true" />
            <p className="text-xs uppercase tracking-[0.24em] text-[#ffe7b1]">Hollywood + AI VIP access</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight md:text-6xl">
              Reserve your place at the next elite fan experience.
            </h1>
            <p className="visually-muted mt-4 max-w-xl text-sm md:text-base">
              Book priority tickets, collect premiere fan-cards, and unlock exclusive drops with one seamless membership flow.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="focus-ring rounded-full bg-[#f5b342] px-5 py-3 text-sm font-bold text-black" href={nearestEvent ? `/events/${nearestEvent.slug}` : "/events"}>
                Get Tickets
              </Link>
              <Link className="focus-ring rounded-full border border-[#f5b342]/40 px-5 py-3 text-sm font-semibold text-[#fce0a8]" href="/fan-cards">
                Explore Collectibles
              </Link>
            </div>
          </div>

          <div className="glass rounded-3xl border border-[#f5b342]/20 bg-[#12100d]/80 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">VIP membership</p>
            <h2 className="mt-2 text-2xl font-extrabold">Priority entry and curated perks</h2>
            <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <li>• Early access to premium events and collector drops.</li>
              <li>• Concierge checkout with saved preferences and loyalty rewards.</li>
              <li>• Direct application review for celebrity fan-card programs.</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="focus-ring rounded-full border border-[#f5b342]/40 px-4 py-2 text-sm" href="/signup">Join now</Link>
              <Link className="focus-ring rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black" href="/account">View account</Link>
            </div>
          </div>
        </section>

        <section className="section-shell pb-9">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">Upcoming events</h2>
            <div className="flex flex-wrap gap-2 text-xs">
              <label className="flex items-center gap-2">
                <span className="visually-muted">City</span>
                <select className="focus-ring rounded-md border border-white/20 bg-[var(--surface)] px-2 py-1" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city === "all" ? "All" : city}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2">
                <span className="visually-muted">Date</span>
                <input className="focus-ring rounded-md border border-white/20 bg-[var(--surface)] px-2 py-1" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
              </label>
            </div>
          </div>
          {filteredEvents.length > 0 ? (
            <div className="scroll-row" aria-label="Upcoming events carousel">
              {filteredEvents.map((event) => (
                <article key={event.slug} className="glass card-tilt rounded-xl p-4">
                  <p className="text-xs uppercase tracking-widest text-[var(--accent)]">{formatDate(event.startAt)}</p>
                  <h3 className="mt-2 text-lg font-bold">{event.title}</h3>
                  <p className="visually-muted mt-1 text-sm">{event.city} · {event.venueName}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <Link className="focus-ring text-sm underline decoration-[var(--accent)]" href={`/events/${event.slug}`}>View details</Link>
                    <Link className="focus-ring rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-black" href={`/events/${event.slug}`}>Buy ticket</Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="glass rounded-xl p-6 text-sm">No events match your filters right now.</div>
          )}
        </section>

        <section className="section-shell pb-9">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-bold">Featured fan-cards</h2>
            <Link className="focus-ring text-sm underline decoration-[var(--accent)]" href="/fan-cards">View all</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fanCards.map((item) => (
              <article key={item.id} className="glass card-tilt rounded-xl p-4">
                <div className="mb-3 h-36 rounded-lg bg-[conic-gradient(from_20deg_at_20%_20%,#f49a45,#f16d58,#2eb8c7,#1a2540,#f49a45)] opacity-80" aria-hidden="true" />
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]">
                  <span className="rounded-full border border-[var(--accent)]/45 px-2 py-1 text-[var(--accent)]">{item.rarity}</span>
                  {item.tag ? <span className="rounded-full bg-[var(--accent-2)]/15 px-2 py-1 text-[var(--accent-2)]">{item.tag}</span> : null}
                </div>
                <h3 className="mt-3 font-semibold">{item.name}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold">{formatMoney(item.priceMinor)}</span>
                  <button type="button" onClick={() => addFanCardToCart(item)} className="focus-ring rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-black">
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell pb-9">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="glass rounded-xl p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Fan-card application</p>
              <h2 className="mt-2 text-2xl font-bold">Apply for elite celebrity access</h2>
              <p className="visually-muted mt-2 text-sm">Submit your details and our team will review your request for curated member-only fan-card programs.</p>
              <form className="mt-4 grid gap-3" onSubmit={handleApplicationSubmit}>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm">
                    <span className="mb-1 block">Full name</span>
                    <input className="focus-ring w-full rounded-lg border border-white/20 bg-[var(--surface)] px-3 py-2" value={application.name} onChange={(event) => setApplication((prev) => ({ ...prev, name: event.target.value }))} required />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block">Email</span>
                    <input className="focus-ring w-full rounded-lg border border-white/20 bg-[var(--surface)] px-3 py-2" type="email" value={application.email} onChange={(event) => setApplication((prev) => ({ ...prev, email: event.target.value }))} required />
                  </label>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm">
                    <span className="mb-1 block">Celebrity interest</span>
                    <input className="focus-ring w-full rounded-lg border border-white/20 bg-[var(--surface)] px-3 py-2" value={application.celebrity} onChange={(event) => setApplication((prev) => ({ ...prev, celebrity: event.target.value }))} placeholder="Aria Vel" required />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block">Tier</span>
                    <select className="focus-ring w-full rounded-lg border border-white/20 bg-[var(--surface)] px-3 py-2" value={application.tier} onChange={(event) => setApplication((prev) => ({ ...prev, tier: event.target.value }))}>
                      <option value="VIP">VIP</option>
                      <option value="Diamond">Diamond</option>
                      <option value="Founder">Founder</option>
                    </select>
                  </label>
                </div>
                <label className="text-sm">
                  <span className="mb-1 block">Why you should be considered</span>
                  <textarea className="focus-ring min-h-24 w-full rounded-lg border border-white/20 bg-[var(--surface)] px-3 py-2" value={application.notes} onChange={(event) => setApplication((prev) => ({ ...prev, notes: event.target.value }))} placeholder="Share your passion, community, or experience." />
                </label>
                <button type="submit" className="focus-ring rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black">Submit application</button>
              </form>
              {applicationStatus ? <p className="mt-3 text-sm text-[var(--accent-2)]">{applicationStatus}</p> : null}
            </article>

            <article className="glass rounded-xl p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Featured talent</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-white/10 p-4">
                  <h3 className="text-lg font-bold">Aria Vel</h3>
                  <p className="visually-muted mt-1 text-sm">Silver-screen energy, sold-out headline shows, and intentional collector drops.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link className="focus-ring rounded-full border border-white/20 px-3 py-1 text-xs" href="/events?celebrity=aria-vel">Events</Link>
                    <Link className="focus-ring rounded-full border border-white/20 px-3 py-1 text-xs" href="/fan-cards?celebrity=aria-vel">Merch</Link>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 p-4">
                  <h3 className="text-lg font-bold">Nova Rae</h3>
                  <p className="visually-muted mt-1 text-sm">A cinematic performer with immersive fan-first experiences and early access perks.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link className="focus-ring rounded-full border border-white/20 px-3 py-1 text-xs" href="/events?celebrity=nova-rae">Events</Link>
                    <Link className="focus-ring rounded-full border border-white/20 px-3 py-1 text-xs" href="/fan-cards?celebrity=nova-rae">Merch</Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="section-shell pb-12">
          <div className="glass rounded-xl p-6">
            <h2 className="text-2xl font-bold">Stay in the loop</h2>
            <p className="visually-muted mt-2 text-sm">Join the list for launch alerts, VIP invitations, and collectible previews.</p>
            <form className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]" onSubmit={handleNewsletterSubmit} noValidate>
              <label className="text-sm">
                <span className="mb-1 block">Email</span>
                <input className="focus-ring w-full rounded-lg border border-white/20 bg-[var(--surface)] px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </label>
              <button className="focus-ring mt-6 h-10 rounded-full bg-[var(--accent)] px-5 text-sm font-bold text-black" type="submit">Subscribe</button>
              <label className="flex items-start gap-2 text-xs md:col-span-2">
                <input type="checkbox" className="mt-0.5" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span className="visually-muted">I agree to receive product and event updates and understand I can unsubscribe at any time.</span>
              </label>
            </form>
            {newsletterStatus ? <p className="mt-2 text-sm text-[var(--accent-2)]">{newsletterStatus}</p> : null}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#070a11] py-7">
        <div className="section-shell flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
          <p className="visually-muted">celebhub · Fan tickets and collectible marketplace.</p>
          <nav className="flex flex-wrap gap-3" aria-label="Footer links">
            <Link className="focus-ring hover:text-[var(--accent)]" href="/legal/privacy">Privacy Policy</Link>
            <Link className="focus-ring hover:text-[var(--accent)]" href="/legal/terms">Terms</Link>
            <Link className="focus-ring hover:text-[var(--accent)]" href="/legal/refunds-resale">Refund and Resale Policy</Link>
            <Link className="focus-ring hover:text-[var(--accent)]" href="/help">Help Center</Link>
          </nav>
          <div className="flex items-center gap-3 text-xs">
            <a className="focus-ring" href="#" aria-label="Open social X">X</a>
            <a className="focus-ring" href="#" aria-label="Open social Instagram">IG</a>
            <a className="focus-ring" href="mailto:support@realcassinigloballimited.com">support@realcassinigloballimited.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
