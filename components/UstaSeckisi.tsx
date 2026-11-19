import Link from "next/link";
import ProductCard from "./ProductCard";
import Icon from "./Icon";
import type { Product } from "@/lib/catalog";

/** Cevat Usta'nın seçtikleri: ustanın yüzü, kısa bir söz ve her takıda onun notu. */
export default function UstaSeckisi({ urunler, toplam, tumu = true }: { urunler: Product[]; toplam: number; tumu?: boolean }) {
  return (
    <section className="section usta-secki" aria-labelledby="usta-secki">
      <div className="us-head">
        <img src="/cevat/isinin-ehli.jpg" alt="Cevat Usta" className="us-face" />
        <div className="us-copy">
          <span className="eyebrow">Cevat Usta'nın seçkisi</span>
          <h2 id="usta-secki">Sizin için seçtiklerim</h2>
          <div className="us-bubble">Çarşıyı tezgâh tezgâh dolaştım, en beğendiklerimi ayırdım. Her birinin neden güzel olduğunu altına yazdım; gönlün hangisine akarsa.<small>— Cevat Usta</small></div>
        </div>
      </div>
      <div className="grid">{urunler.map((p) => <ProductCard key={p.kod} p={p} usta />)}</div>
      {tumu && toplam > urunler.length && (
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <Link href="/ustanin-secimi" className="btn btn-outline">Cevat Usta'nın tüm seçtikleri ({toplam}) <Icon name="chevron" size={16} /></Link>
        </div>
      )}
    </section>
  );
}
