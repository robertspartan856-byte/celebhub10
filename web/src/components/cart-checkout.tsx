"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { CartItem } from "@/lib/types";

function money(minor: number) {
  return `$${(minor / 100).toFixed(2)}`;
}

type Props = {
  mode?: "cart" | "checkout";
};

export function CartCheckout({ mode = "checkout" }: Props) {
  const { items, subtotalMinor, updateQuantity, removeItem, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");

  const serviceFeeMinor = Math.round(subtotalMinor * 0.08);
  const totalMinor = subtotalMinor + serviceFeeMinor + 500;

  const summary = useMemo(() => {
    return items.map((item) => ({
      ...item,
      lineMinor: item.quantity * item.unitPriceMinor,
    }));
  }, [items]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0) {
      return;
    }

    const nextOrderId = `ORD-${Date.now().toString().slice(-6)}`;
    setOrderId(nextOrderId);
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <div className="glass rounded-xl p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]">Order confirmed</p>
        <h1 className="mt-2 text-3xl font-black">Thanks, {customerName || "friend"}!</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Your order {orderId} is reserved and a receipt will be emailed to {email || "your inbox"}.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/events" className="focus-ring rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black">
            Browse events
          </Link>
          <Link href="/fan-cards" className="focus-ring rounded-full border border-white/20 px-4 py-2 text-sm">
            Shop fan-cards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="glass rounded-xl p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]">{mode === "cart" ? "Cart" : "Checkout"}</p>
            <h1 className="mt-2 text-3xl font-black">{mode === "cart" ? "Your cart" : "Complete your purchase"}</h1>
          </div>
          {items.length > 0 ? (
            <button
              type="button"
              onClick={() => clearCart()}
              className="focus-ring rounded-full border border-white/20 px-3 py-2 text-xs"
            >
              Clear cart
            </button>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-white/20 p-5 text-sm text-[var(--muted)]">
            Your cart is empty. Add tickets or fan-cards to get started.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {summary.map((item) => (
              <div key={item.id} className="rounded-lg border border-white/15 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{item.itemType === "ticket" ? "Event ticket" : "Fan-card"}</p>
                  </div>
                  <p className="font-semibold">{money(item.lineMinor)}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <label className="text-xs">
                    Qty
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.id, Number(event.target.value) || 1)}
                      className="focus-ring ml-2 w-16 rounded-md border border-white/20 bg-[#0f1420] px-2 py-1"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="focus-ring rounded-full border border-white/20 px-3 py-1 text-xs"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="glass rounded-xl p-5">
        <h2 className="text-lg font-bold">Order summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotalMinor)}</span></div>
          <div className="flex justify-between"><span>Service fee</span><span>{money(serviceFeeMinor)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>{money(500)}</span></div>
          <div className="flex justify-between border-t border-white/15 pt-2 font-semibold"><span>Total</span><span>{money(totalMinor)}</span></div>
        </div>

        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <label className="block text-sm">
            Full name
            <input
              required
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="focus-ring mt-1 w-full rounded-md border border-white/20 bg-[#0f1420] px-3 py-2"
              placeholder="Alicia Moore"
            />
          </label>
          <label className="block text-sm">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="focus-ring mt-1 w-full rounded-md border border-white/20 bg-[#0f1420] px-3 py-2"
              placeholder="you@example.com"
            />
          </label>
          <label className="block text-sm">
            Delivery notes
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="focus-ring mt-1 min-h-24 w-full rounded-md border border-white/20 bg-[#0f1420] px-3 py-2"
              placeholder="Gate code, digital delivery preference, or special requests"
            />
          </label>
          <button
            type="submit"
            disabled={items.length === 0}
            className="focus-ring w-full rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            Complete purchase
          </button>
        </form>

        {mode === "cart" ? (
          <Link href="/checkout" className="focus-ring mt-3 inline-flex w-full justify-center rounded-full border border-[var(--accent)]/40 px-4 py-2 text-sm">
            Continue to checkout
          </Link>
        ) : null}
      </section>
    </div>
  );
}
