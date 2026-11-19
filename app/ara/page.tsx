import Listing from "@/components/Listing";
import { PRODUCTS, CATEGORIES } from "@/lib/catalog";

const norm = (s: string) => s.toLocaleLowerCase("tr-TR");

export default async function Ara({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = norm((await searchParams).q ?? "").trim();
  const found = q
    ? PRODUCTS.filter((p) => norm(`${p.ad} ${p.kod} ${p.renk} ${CATEGORIES.find((c) => c.slug === p.kategori)?.ad}`).includes(q))
    : PRODUCTS;
  return <div className="shell"><Listing key={q} products={found} title={q ? `“${q}” için sonuçlar` : "Tüm takılar"} /></div>;
}
