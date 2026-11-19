import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import JewelryArt from "@/components/JewelryArt";
import Icon from "@/components/Icon";
import DealTimer from "@/components/DealTimer";
import { getCatalog } from "@/lib/db";
import { GuvenSeridi } from "@/components/Guvence";

const MANIFESTO = [
  { b: "Aracısız", s: "Takı, araya kimse girmeden atölyeden ve toptancıdan sana gelir. Aracı payı fiyata binmez." },
  { b: "Atölyeden", s: "Kapalıçarşı'nın üretici atölyelerinde yapılan modeller, ilk elden." },
  { b: "Toptancıdan", s: "Kuyum toptancılarının kataloglarından, toptan fiyatına yakın alım." },
  { b: "Çarşının çeşidi tek ekranda", s: "Çarşıyı tek tek gezmeden, toptancı kataloglarının tamamından seç." },
];

export default async function Home() {
  const { categories: CATEGORIES, products: PRODUCTS } = await getCatalog();
  const firsatlar = PRODUCTS.filter((p) => p.firsat);
  const secki = PRODUCTS.filter((p) => p.ustaSecimi);
  const yeniler = PRODUCTS.filter((p) => p.yeni);
  const begenilen = PRODUCTS.filter((p) => (p.begeni ?? 0) > 0 || (p.yorumSayisi ?? 0) > 0)
    .sort((a, b) => (b.begeni ?? 0) - (a.begeni ?? 0) || (b.puan ?? 0) - (a.puan ?? 0)).slice(0, 8);
  const enYakin = firsatlar.map((p) => p.firsat?.bitis).filter(Boolean).sort()[0];
  return (
    <div className="shell">
      <section className="hero hero-promise">
        <img src="/cevat/hos-geldin.jpg" alt="Cevat Usta, Kapalıçarşı'daki tezgâhında müşterisini karşılıyor" />
        <div className="copy">
          <span className="eyebrow" style={{ color: "#d9b96c" }}>Kapalıçarşıdan Al</span>
          <h1>Çarşıdan aracısız.</h1>
          <p className="lead-copy">Kapalıçarşı'nın atölyelerinden ve toptancılarından, ilk elden kapına. Aracı payı fiyata binmez.</p>
          <div className="cta">
            {firsatlar.length > 0 && <a href="#firsat" className="btn btn-gold">Süreli fırsatlar <Icon name="clock" size={18} /></a>}
            <Link href="/kategori/yuzuk" className="btn btn-outline">Takıları keşfet</Link>
          </div>
          <p className="tagline">“Ürünü anlatırım, pazarlığı sana bırakırım.” — Cevat Usta</p>
        </div>
      </section>

      <div className="promise-strip">
        <div><Icon name="gem" /><span><b>Geniş çeşit</b>Toptancı kataloglarından</span></div>
        <div><Icon name="coin" /><span><b>Güncel altın fiyatı</b>15 dakikada bir</span></div>
        <div><Icon name="hand" /><span><b>Pazarlık var</b>Teklifini patrona ilet</span></div>
        <div><Icon name="truck" /><span><b>Sigortalı teslimat</b>Takip numarasıyla</span></div>
      </div>

      <GuvenSeridi />

      {firsatlar.length > 0 && (
        <section className="section deals" id="firsat" aria-labelledby="fir">
          <div className="deals-head">
            <div>
              <span className="eyebrow" style={{ color: "#f1dca7" }}>Süreli fırsatlar</span>
              <h2 id="fir">Süre bitmeden yakala</h2>
              <p>Süre dolunca fiyat normale döner. Sayaç herkes için aynı.</p>
            </div>
            <div className="deals-timer"><DealTimer label="En yakın bitiş" bitis={enYakin} /></div>
          </div>
          <div className="rail">{firsatlar.map((p) => <div className="rail-item" key={p.kod}><ProductCard p={p} /></div>)}</div>
        </section>
      )}

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

      <section className="section manifesto" aria-labelledby="man">
        <div className="man-copy">
          <span className="eyebrow">Neden daha uygun?</span>
          <h2 id="man">Aracısız, ilk elden.</h2>
          <p>Takıyı Kapalıçarşı'nın atölyelerinden ve kuyum toptancılarından alıp, araya kimse girmeden sigortalı olarak kapına getiriyoruz. Aracı payı olmadığı için fiyat avantajı senin cebinde kalır.</p>
          <div className="usta" style={{ marginTop: 16 }}>
            <img className="avatar" src="/cevat/isinin-ehli.jpg" alt="" />
            <div className="bubble">Çeşit bende, karar sende. Beğendiğine teklif ver, patrona ileteyim.<small>— Cevat Usta</small></div>
          </div>
        </div>
        <ol className="man-list">
          {MANIFESTO.map((m, i) => (
            <li key={m.b}><span className="n">{i + 1}</span><span><b>{m.b}</b>{m.s}</span></li>
          ))}
        </ol>
      </section>

      {secki.length > 0 && (
        <section className="section" aria-labelledby="sec">
          <div className="section-head"><h2 id="sec">Ustanın seçkisi</h2><Link href="/kategori/yuzuk">Tümünü gör</Link></div>
          <div className="grid">{secki.map((p) => <ProductCard key={p.kod} p={p} />)}</div>
        </section>
      )}

      <section className="section" aria-labelledby="beg">
        <div className="section-head"><h2 id="beg">En çok beğenilenler</h2>{begenilen.length > 0 && <Link href="/kategori/yuzuk">Tümünü gör</Link>}</div>
        {begenilen.length > 0 ? (
          <div className="grid">{begenilen.map((p) => <ProductCard key={p.kod} p={p} />)}</div>
        ) : (
          <div className="panel empty-likes">
            <Icon name="heart" size={26} stroke="var(--sale)" />
            <p><b>Beğendiğin takının kalbine dokun.</b> Ziyaretçilerin en çok favorilediği ve en yüksek puan verdiği takılar burada sıralanır.</p>
          </div>
        )}
      </section>

      <section className="section">
        <div className="bargain-band">
          <img src="/cevat/pazarlik.jpg" alt="" />
          <div>
            <h3>Fiyatta anlaşalım.</h3>
            <p>Beğendiğin takıya teklif ver; patron kabul eder ya da karşı teklif yapar. Anlaşınca ürün 15 dakika senin için ayrılır.</p>
            <Link href="/pazarlik" className="btn btn-gold btn-sm">Pazarlık nasıl olur? <Icon name="chevron" size={16} /></Link>
          </div>
        </div>
      </section>

      {yeniler.length > 0 && (
        <section className="section" aria-labelledby="yen">
          <div className="section-head"><h2 id="yen">Yeni gelenler</h2></div>
          <div className="grid">{yeniler.map((p) => <ProductCard key={p.kod} p={p} />)}</div>
        </section>
      )}

      <section className="section">
        <div className="duo">
          <div className="panel">
            <Icon name="coin" size={30} stroke="var(--gold-2)" />
            <div>
              <h3>Her alışverişte %1 Altın Lira</h3>
              <p>Aldığın her takının %1'i Altın Lira olarak hesabına geçer; bir sonraki alışverişinde indirim olarak kullanırsın.</p>
            </div>
          </div>
          <div className="panel">
            <Icon name="chat" size={30} stroke="var(--emerald)" />
            <div>
              <h3>Takıldığın yerde Cevat Usta'ya sor</h3>
              <p>Ürün kodu ve ölçünle WhatsApp'tan yaz; ölçü, gram ve modeli anlatalım.</p>
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
        <p className="demo-note">Tasarım önizlemesi · Ürünler ve görseller temsilidir</p>
      </section>
    </div>
  );
}
