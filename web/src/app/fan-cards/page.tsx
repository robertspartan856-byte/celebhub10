"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { ProductRecord } from "@/lib/types";
import { products } from "@/lib/mock-data";

function money(minor: number) {
  return `$${(minor / 100).toFixed(2)}`;
}

export default function FanCardsPage() {
  const [selectedRarity, setSelectedRarity] = useState("all");
  const { addItem } = useCart();

  const rarities = useMemo(() => ["all", ...new Set(products.map((product) => product.rarity))], []);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => selectedRarity === "all" || product.rarity === selectedRarity);
  }, [selectedRarity]);

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

  return (
    <main className="section-shell py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Fan-Card Store</h1>
          <p className="visually-muted mt-3 text-sm">Browse limited editions and add collector drops to your cart.</p>
        </div>
        <Link href="/cart" className="focus-ring rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black">
          View Cart
        </Link>
      </div>

      <label className="mt-6 block text-sm">
        Rarity
        <select
          value={selectedRarity}
          onChange={(event) => setSelectedRarity(event.target.value)}
          className="focus-ring mt-2 w-full max-w-xs rounded-md border border-white/20 bg-[#0f1420] px-3 py-2"
        >
          {rarities.map((rarity) => (
            <option key={rarity} value={rarity}>
              {rarity === "all" ? "All rarities" : rarity}
            </option>
          ))}
        </select>
      </label>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Fan card catalog">
        {visibleProducts.map((product) => (
          <article key={product.id} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">{product.tag ?? "Collector"}</p>
              <span className="rounded-full border border-white/15 px-2 py-1 text-[10px] uppercase tracking-[0.2em]">
                {product.rarity}
              </span>
            </div>
            <h2 className="mt-3 text-lg font-bold">{product.name}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{product.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-semibold">{money(product.priceMinor)}</span>
              <div className="flex gap-2">
                <Link href={`/fan-cards/${product.slug}`} className="focus-ring rounded-full border border-white/20 px-3 py-2 text-sm">
                  Details
                </Link>
                <button
                  type="button"
                  onClick={() => addFanCardToCart(product)}
                  className="focus-ring rounded-full bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-black"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
