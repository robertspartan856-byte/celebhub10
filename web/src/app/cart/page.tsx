import { CartCheckout } from "@/components/cart-checkout";

export default function CartPage() {
  return (
    <main className="section-shell py-8">
      <CartCheckout mode="cart" />
    </main>
  );
}
