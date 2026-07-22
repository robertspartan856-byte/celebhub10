import { CartCheckout } from "@/components/cart-checkout";

export default function CheckoutPage() {
  return (
    <main className="section-shell py-8">
      <CartCheckout mode="checkout" />
    </main>
  );
}
