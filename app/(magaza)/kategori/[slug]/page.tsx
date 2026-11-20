import { notFound } from "next/navigation";
import Link from "next/link";
import Listing from "@/components/Listing";
import { CATEGORIES, category } from "@/lib/catalog";
import { getCatalog } from "@/lib/db";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default async function Kategori({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ firsat?: string }> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const c = category(slug);
  if (!c) notFound();
  const { products: PRODUCTS } = await getCatalog();
  return (
    <div className="shell">
      <nav className="sokaklar" aria-label="Çarşı sokakları" style={{ marginTop: 16 }}>
        {CATEGORIES.map((k) => <Link key={k.slug} href={`/kategori/${k.slug}`} className={`sokak${k.slug === slug ? " on" : ""}`} aria-current={k.slug === slug ? "page" : undefined}>{k.sokak}</Link>)}
      </nav>
      <Listing key={slug} products={PRODUCTS.filter((p) => p.kategori === slug)} title={c.cogul} initialFirsat={sp.firsat === "1"} />
    </div>
  );
}
