"use client";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/lib/useStore";
import { PRODUCTS } from "@/lib/catalog";

export default function Favoriler() {
  const { fav } = useStore();
  const list = PRODUCTS.filter((p) => fav.includes(p.kod));
  return (
    <div className="shell">
      <h1 className="page-title">Favorilerim</h1>
      {list.length ? <div className="grid">{list.map((p) => <ProductCard key={p.kod} p={p} />)}</div> : (
        <div className="empty panel">
          <img src="/cevat/urunu-anlatir.jpg" alt="" />
          <p>Henüz favorin yok. Beğendiğin takının kalbine dokun, burada toplansın; fiyatı düşünce haber verelim.</p>
          <Link href="/kategori/yuzuk" className="btn btn-primary">Takılara bak</Link>
        </div>
      )}
    </div>
  );
}
