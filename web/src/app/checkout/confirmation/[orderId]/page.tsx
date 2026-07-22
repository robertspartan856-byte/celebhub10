import Link from "next/link";
import { notFound } from "next/navigation";

type ConfirmationPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderId } = await params;

  if (!orderId) {
    notFound();
  }

  return (
    <main className="section-shell py-10">
      <div className="glass rounded-xl p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]">Receipt ready</p>
        <h1 className="mt-2 text-3xl font-black">Order {orderId} confirmed</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Your purchase was logged successfully. We’ll send confirmation details to your inbox shortly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/events" className="focus-ring rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black">
            Keep exploring
          </Link>
          <Link href="/account" className="focus-ring rounded-full border border-white/20 px-4 py-2 text-sm">
            View account
          </Link>
        </div>
      </div>
    </main>
  );
}
