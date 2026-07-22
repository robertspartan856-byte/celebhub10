"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { ProductRecord } from "@/lib/types";

function money(minor: number) {
  return `$${(minor / 100).toFixed(2)}`;
}

type Props = {
  product: ProductRecord;
};

export function ProductDetailClient({ product }: Props) {
  const { addItem } = useCart();
  const router = useRouter();

  const addToCart = () => {
    addItem({
      id: `fan-${product.id}`,
      itemType: "fan_card",
      itemRef: product.id,
      title: product.name,
      quantity: 1,
      unitPriceMinor: product.priceMinor,
      currency: product.currency,
      metadata: { rarity: product.rarity },
    });
  };

  const buyNow = () => {
    addToCart();
    router.push("/checkout");
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="glass rounded-xl p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]">{product.tag ?? "Collector drop"}</p>
        <h1 className="mt-3 text-3xl font-black">{product.name}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">{product.description}</p>
        <div className="mt-5 rounded-lg border border-white/15 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Edition</p>
          <p className="mt-2 font-semibold">{product.edition}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Authenticity</p>
          <p className="mt-2 font-semibold">{product.authenticityCode}</p>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{product.rarity}</p>
            <p className="text-xs text-[var(--muted)]">{product.stockLabel}</p>
          </div>
          <p className="text-2xl font-black">{money(product.priceMinor)}</p>
        </div>

        <div className="mt-6 space-y-3 rounded-lg border border-white/15 p-4 text-sm">
          <div className="flex justify-between"><span>Delivery</span><span className="text-right text-[var(--muted)]">{product.delivery}</span></div>
          <div className="flex justify-between"><span>Gift-ready</span><span>Yes</span></div>
          <div className="flex justify-between"><span>Instant access</span><span>Included</span></div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addToCart}
            className="focus-ring rounded-full border border-[var(--accent)]/50 px-4 py-2 text-sm font-semibold"
          >
            Add to cart
          </button>
          <button
            type="button"
            onClick={buyNow}
            className="focus-ring rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black"
          >
            Buy now
          </button>
        </div>

        <Link href="/fan-cards" className="focus-ring mt-4 inline-flex text-sm text-[var(--accent)]">
          ← Back to fan-cards
        </Link>
      </div>
    </section>
  );
}
