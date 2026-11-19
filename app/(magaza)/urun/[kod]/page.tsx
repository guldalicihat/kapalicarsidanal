import { notFound } from "next/navigation";
import Link from "next/link";
import ProductView from "@/components/ProductView";
import ProductCard from "@/components/ProductCard";
import Icon from "@/components/Icon";
import { PRODUCTS as ORNEK, category } from "@/lib/catalog";
import Reviews from "@/components/Reviews";
import { getCatalog, getYorumlar } from "@/lib/db";

export function generateStaticParams() {
  return ORNEK.map((p) => ({ kod: p.kod }));
}

export default async function Urun({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const { products: PRODUCTS } = await getCatalog();
  const p = PRODUCTS.find((x) => x.kod === kod);
  if (!p) notFound();
  const c = category(p.kategori)!;
  const yorumlar = await getYorumlar(p.kod);
  const benzer = PRODUCTS.filter((x) => x.kategori === p.kategori && x.kod !== p.kod).slice(0, 4);
  const tamamlayici = PRODUCTS.filter((x) => x.kategori !== p.kategori && x.renk === p.renk).slice(0, 4);
  return (
    <div className="shell">
      <nav className="crumbs" aria-label="Sayfa yolu">
        <Link href="/">Ana sayfa</Link><Icon name="chevron" size={14} />
        <Link href={`/kategori/${c.slug}`}>{c.cogul}</Link><Icon name="chevron" size={14} />
        <span>{p.ad}</span>
      </nav>
      <ProductView
        p={p}
        similar={
          <>
            <Reviews kod={p.kod} ad={p.ad} yorumlar={yorumlar} />
            {benzer.length > 0 && (
              <section className="section"><div className="section-head"><h2>Benzer modeller</h2></div>
                <div className="grid">{benzer.map((x) => <ProductCard key={x.kod} p={x} />)}</div></section>
            )}
            {tamamlayici.length > 0 && (
              <section className="section"><div className="section-head"><h2>Yanına yakışır</h2></div>
                <div className="grid">{tamamlayici.map((x) => <ProductCard key={x.kod} p={x} />)}</div></section>
            )}
          </>
        }
      />
    </div>
  );
}
