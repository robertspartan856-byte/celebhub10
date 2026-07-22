import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product-detail-client";
import { products } from "@/lib/mock-data";
import { ProductRecord } from "@/lib/types";

type FanCardDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function FanCardDetailPage({ params }: FanCardDetailProps) {
  const { slug } = await params;
  const product = products.find((entry) => entry.slug === slug) as ProductRecord | undefined;

  if (!product) {
    notFound();
  }

  return (
    <main className="section-shell py-8">
      <Link href="/fan-cards" className="focus-ring text-sm text-[var(--accent)]">
        ← Back to store
      </Link>
      <div className="mt-4">
        <ProductDetailClient product={product} />
      </div>
    </main>
  );
}
