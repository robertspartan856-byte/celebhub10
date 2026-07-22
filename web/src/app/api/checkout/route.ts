import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const items = Array.isArray(body?.items) ? body.items : [];
  const customerEmail = typeof body?.customerEmail === "string" ? body.customerEmail : "";

  if (!stripe) {
    return NextResponse.json({
      ok: true,
      checkoutUrl: "/checkout/confirmation/mock-checkout",
      sessionId: "mock-checkout",
      mocked: true,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail || undefined,
    line_items: items.map((item: { title: string; quantity: number; unitPriceMinor: number; currency: string }) => ({
      price_data: {
        currency: item.currency.toLowerCase() || "usd",
        product_data: { name: item.title },
        unit_amount: item.unitPriceMinor,
      },
      quantity: item.quantity,
    })),
    success_url: `${request.nextUrl.origin}/checkout/confirmation/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${request.nextUrl.origin}/checkout`,
  });

  return NextResponse.json({ ok: true, checkoutUrl: session.url, sessionId: session.id, mocked: false });
}
