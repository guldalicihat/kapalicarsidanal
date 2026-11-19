import Link from "next/link";
import Bargain from "@/components/Bargain";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, product } from "@/lib/catalog";

export default async function PazarlikSayfasi({ searchParams }: { searchParams: Promise<{ urun?: string; olcu?: string }> }) {
  const sp = await searchParams;
  const p = sp.urun ? product(sp.urun) : undefined;
  if (p && !p.firsat) {
    return (
      <div className="shell">
        <div className="list-head"><div><span className="eyebrow">Pazarlık masası</span><h1>Teklifini patrona iletelim</h1></div>
          <Link href={`/urun/${p.kod}`} className="link">Ürüne dön</Link></div>
        <Bargain key={`${p.kod}-${sp.olcu}`} p={p} olcu={sp.olcu ?? ""} />
        <p className="demo-note">Tasarım örneği · Kurallar ve fiyatlar temsilidir</p>
      </div>
    );
  }
  const adaylar = PRODUCTS.filter((x) => !x.firsat).slice(0, 8);
  return (
    <div className="shell">
      <section className="hero" style={{ minHeight: 260 }}>
        <img src="/cevat/pazarlik.jpg" alt="Cevat Usta pazarlık için hazır" />
        <div className="copy">
          <span className="eyebrow" style={{ color: "#d9b96c" }}>Çarşı usulü</span>
          <h1>Pazarlık nasıl olur?</h1>
          <p className="tagline">Beğendiğin takıya teklif ver, patron değerlendirsin.</p>
        </div>
      </section>
      <section className="section panel" style={{ padding: 18 }}>
        <ol className="steps" style={{ margin: 0, padding: 0 }}>
          <li><span><b>Ürününü ve ölçünü seç</b><span>Ürün sayfasında “Pazarlık Et”e dokun.</span></span></li>
          <li><span><b>Teklifini yaz</b><span>Cevat Usta teklifini patrona iletir.</span></span></li>
          <li><span><b>Patron yanıtlar</b><span>Kabul eder, karşı teklif verir; ikinci turda son fiyatını söyler.</span></span></li>
          <li><span><b>Anlaşınca 15 dakika</b><span>Fiyat ve ürün senin için ayrılır, ödemeyi tamamlarsın.</span></span></li>
        </ol>
        <p className="note" style={{ marginBottom: 0 }}>Süreli fırsattaki ürünlerde pazarlık yapılmaz. Patron yanıtları önceden belirlenen kurallarla otomatik verilir.</p>
      </section>
      <section className="section">
        <div className="section-head"><h2>Pazarlığa açık takılar</h2></div>
        <div className="grid">{adaylar.map((x) => <ProductCard key={x.kod} p={x} />)}</div>
      </section>
    </div>
  );
}
