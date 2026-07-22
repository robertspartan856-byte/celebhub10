"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { EventRecord, TicketTier } from "@/lib/types";

function money(minor: number) {
  return `$${(minor / 100).toFixed(2)}`;
}

type Props = {
  event: EventRecord;
};

export function EventDetailClient({ event }: Props) {
  const [selectedTierId, setSelectedTierId] = useState(event.ticketTiers[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [statusMessage, setStatusMessage] = useState("");
  const { addItem } = useCart();
  const router = useRouter();

  const selectedTier = useMemo<TicketTier | undefined>(
    () => event.ticketTiers.find((tier) => tier.id === selectedTierId),
    [event.ticketTiers, selectedTierId],
  );

  const soldOut = !selectedTier || selectedTier.quantityAvailable < 1;
  const totalMinor = (selectedTier?.priceMinor ?? 0) + (selectedTier?.feeMinor ?? 0) + (selectedTier?.vatMinor ?? 0);

  const addTicketToCart = () => {
    if (!selectedTier || soldOut) {
      setStatusMessage("This tier is sold out. Join waitlist notifications.");
      return;
    }

    addItem({
      id: `${event.id}-${selectedTier.id}`,
      itemType: "ticket",
      itemRef: `${event.id}:${selectedTier.id}`,
      title: `${event.title} · ${selectedTier.name}`,
      quantity,
      unitPriceMinor: totalMinor,
      currency: "USD",
      metadata: {
        eventSlug: event.slug,
      },
    });
    setStatusMessage("Ticket added to cart.");
  };

  const handleBuyNow = () => {
    if (!selectedTier || soldOut) {
      setStatusMessage("This tier is sold out. Join waitlist notifications.");
      return;
    }

    addItem({
      id: `${event.id}-${selectedTier.id}`,
      itemType: "ticket",
      itemRef: `${event.id}:${selectedTier.id}`,
      title: `${event.title} · ${selectedTier.name}`,
      quantity,
      unitPriceMinor: totalMinor,
      currency: "USD",
      metadata: {
        eventSlug: event.slug,
      },
    });
    router.push("/checkout");
  };

  return (
    <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <article className="glass rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-[var(--accent)]">{new Date(event.startAt).toLocaleString("en-US")}</p>
        <h1 className="mt-2 text-3xl font-black">{event.title}</h1>
        <p className="visually-muted mt-2 text-sm">{event.city} · {event.venueName}</p>
        <p className="mt-1 text-xs text-[var(--accent-2)]">{event.celebrity}</p>

        <h2 className="mt-6 text-lg font-bold">Select Ticket Tier</h2>
        <div className="mt-3 grid gap-2" role="radiogroup" aria-label="Ticket tiers">
          {event.ticketTiers.map((tier) => {
            const tierSoldOut = tier.quantityAvailable < 1;
            const checked = tier.id === selectedTierId;
            return (
              <label key={tier.id} className={`focus-ring flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 ${checked ? "border-[var(--accent)]" : "border-white/20"}`}>
                <span>
                  <span className="block font-semibold">{tier.name}</span>
                  <span className="visually-muted block text-xs">{tierSoldOut ? "Sold out" : `${tier.quantityAvailable} left`}</span>
                </span>
                <span className="text-right">
                  <span className="block text-sm font-semibold">{money(tier.priceMinor)}</span>
                  <input
                    type="radio"
                    name="ticket-tier"
                    className="mt-1"
                    checked={checked}
                    aria-label={`Select ${tier.name} tier`}
                    onChange={() => setSelectedTierId(tier.id)}
                  />
                </span>
              </label>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-end gap-3">
          <label className="text-xs">
            Quantity
            <input
              type="number"
              min={1}
              max={Math.max(1, selectedTier?.quantityAvailable ?? 1)}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="focus-ring mt-1 w-24 rounded-md border border-white/20 bg-[#0f1420] px-2 py-2"
            />
          </label>
          <button
            type="button"
            disabled={soldOut}
            onClick={addTicketToCart}
            className="focus-ring h-10 rounded-full border border-[var(--accent)]/50 px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-55"
          >
            Add to cart
          </button>
          <button
            type="button"
            disabled={soldOut}
            onClick={handleBuyNow}
            className="focus-ring h-10 rounded-full bg-[var(--accent)] px-4 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-55"
          >
            Buy now
          </button>
        </div>
        {statusMessage ? <p className="mt-2 text-xs text-[var(--accent-2)]">{statusMessage}</p> : null}
      </article>

      <aside className="glass rounded-xl p-5">
        <h2 className="text-lg font-bold">Price Breakdown</h2>
        {selectedTier ? (
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between"><span>Base price</span><span>{money(selectedTier.priceMinor)}</span></li>
            <li className="flex justify-between"><span>Service fee</span><span>{money(selectedTier.feeMinor)}</span></li>
            <li className="flex justify-between"><span>VAT</span><span>{money(selectedTier.vatMinor)}</span></li>
            <li className="flex justify-between border-t border-white/15 pt-2 font-semibold"><span>Total</span><span>{money(totalMinor)}</span></li>
          </ul>
        ) : null}

        <div className="mt-5 rounded-lg border border-white/15 p-3">
          <h3 className="text-sm font-semibold">Refund Policy</h3>
          <p className="visually-muted mt-1 text-xs">{event.refundPolicy}</p>
          <h3 className="mt-3 text-sm font-semibold">Resale Policy</h3>
          <p className="visually-muted mt-1 text-xs">{event.resalePolicy}</p>
        </div>
      </aside>
    </section>
  );
}