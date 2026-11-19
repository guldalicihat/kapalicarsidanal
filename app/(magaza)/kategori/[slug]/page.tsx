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
      <div className="chips" style={{ marginTop: 16 }}>
        {CATEGORIES.map((k) => <Link key={k.slug} href={`/kategori/${k.slug}`} className={`chip${k.slug === slug ? " on" : ""}`}>{k.ad}</Link>)}
      </div>
      <Listing key={slug} products={PRODUCTS.filter((p) => p.kategori === slug)} title={c.cogul} initialFirsat={sp.firsat === "1"} />
    </div>
  );
}
