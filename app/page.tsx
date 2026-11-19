import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import JewelryArt from "@/components/JewelryArt";
import Icon from "@/components/Icon";
import DealTimer from "@/components/DealTimer";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";

export default function Home() {
  const firsatlar = PRODUCTS.filter((p) => p.firsat);
  const secki = PRODUCTS.filter((p) => p.ustaSecimi);
  const yeniler = PRODUCTS.filter((p) => p.yeni);
  return (
    <div className="shell">
      <section className="hero">
        <img src="/cevat/hos-geldin.jpg" alt="Cevat Usta, Kapalıçarşı'daki tezgâhında müşterisini karşılıyor" />
        <div className="copy">
          <span className="eyebrow" style={{ color: "#d9b96c" }}>Cevat Usta karşılıyor</span>
          <h1>Çarşıya hoş geldin.</h1>
          <p className="tagline">“Ürünü anlatırım, pazarlığı sana bırakırım.”</p>
          <div className="cta">
            <Link href="/kategori/yuzuk" className="btn btn-gold">Takıları keşfet <Icon name="chevron" size={18} /></Link>
            <Link href="/pazarlik" className="btn btn-outline">Pazarlık nasıl olur?</Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="kat">
        <div className="section-head"><h2 id="kat">Ne arıyorsun?</h2></div>
        <div className="cats">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/kategori/${c.slug}`} className="cat">
              <span className="disc"><JewelryArt art={c.art} tone={c.slug === "pirlanta" ? "Beyaz altın" : "Sarı altın"} id={`k${c.slug}`} size="78%" /></span>
              {c.ad}
            </Link>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="fir">
        <div className="section-head"><h2 id="fir">Süreli fırsatlar</h2><Link href="/kategori/yuzuk?firsat=1">Tümü</Link></div>
        <div className="deal-head">
          <p><strong>İşçilikte indirim</strong> · Altın kısmı güncel fiyattan hesaplanır.</p>
          <DealTimer />
        </div>
        <div className="grid">{firsatlar.map((p) => <ProductCard key={p.kod} p={p} />)}</div>
      </section>

      <section className="section">
        <div className="bargain-band">
          <img src="/cevat/pazarlik.jpg" alt="" />
          <div>
            <h3>Beğendiğin takıya teklif ver.</h3>
            <p>Teklifini patrona iletirim. Anlaşırsanız ürün 15 dakika senin için ayrılır.</p>
            <Link href="/pazarlik" className="btn btn-gold btn-sm">Pazarlık nasıl olur? <Icon name="chevron" size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="sec">
        <div className="section-head"><h2 id="sec">Ustanın seçkisi</h2><Link href="/kategori/yuzuk">Tümünü gör</Link></div>
        <div className="grid">{secki.map((p) => <ProductCard key={p.kod} p={p} />)}</div>
      </section>

      <section className="section" aria-labelledby="yen">
        <div className="section-head"><h2 id="yen">Yeni gelenler</h2></div>
        <div className="grid">{yeniler.map((p) => <ProductCard key={p.kod} p={p} />)}</div>
      </section>

      <section className="section">
        <div className="duo">
          <div className="panel">
            <Icon name="coin" size={30} stroke="var(--gold-2)" />
            <div>
              <span className="soon">Yakında</span>
              <h3>Altın Lira</h3>
              <p>Her alışverişte puan kazan, sonraki alışverişinde kullan. Oranlar ve şartlar açılışta duyurulacak.</p>
            </div>
          </div>
          <div className="panel">
            <Icon name="chat" size={30} stroke="var(--emerald)" />
            <div>
              <h3>Takıldığın yerde Cevat Usta'ya sor</h3>
              <p>Ürün kodu ve ölçünle birlikte WhatsApp'tan yaz; ölçü, gram ve işçiliği anlatalım.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="trust">
          <div><Icon name="ruler" /><span><b>Ölçü rehberi</b>Yüzük ölçünü evde bul.</span></div>
          <div><Icon name="truck" /><span><b>Sigortalı teslimat</b>Takip numarasıyla kapına.</span></div>
          <div><Icon name="lock" /><span><b>Güvenli ödeme</b>3D Secure, kart bilgin bizde tutulmaz.</span></div>
          <div><Icon name="check" /><span><b>Ayar garantisi</b>Damgalı, faturalı ürün.</span></div>
        </div>
        <p className="demo-note">Tasarım örneği · Ürünler, görseller ve fiyatlar temsilidir</p>
      </section>
    </div>
  );
}
