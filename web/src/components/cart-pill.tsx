"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";

export function CartPill() {
  const { itemCount, subtotalMinor } = useCart();

  return (
    <Link
      href="/cart"
      className="focus-ring rounded-full border border-white/25 px-3 py-1 text-xs"
      aria-label={`Open cart with ${itemCount} items`}
    >
      Cart {itemCount} · ${(subtotalMinor / 100).toFixed(2)}
    </Link>
  );
}