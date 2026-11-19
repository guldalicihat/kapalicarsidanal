"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import JewelryArt from "./JewelryArt";
import Icon from "./Icon";
import DealTimer from "./DealTimer";
import { useStore } from "@/lib/useStore";
import { STOK_METNI, defaultVariant, firsatPrice, variantPrice, type Product } from "@/lib/catalog";
import { gram, tl } from "@/lib/pricing";

const ILCELER = ["Kadıköy", "Beşiktaş", "Şişli", "Üsküdar", "Fatih", "Bakırköy", "Ataşehir", "Esenyurt", "Pendik", "Sarıyer", "İstanbul dışı"];
const UZAK = new Set(["Esenyurt", "Pendik", "Sarıyer"]);
const STOK_RENK = { kendi: "#2f9e6b", tedarikci: "#c99a3c", yok: "#b6bcb9" } as const;

// Türkiye'de yaygın kullanılan yüzük numarası ≈ iç çevre (mm) − 40 varsayımı; örnek tablo.
const OLCU_TABLO = [12, 14, 16, 18, 20].map((n) => ({ n, cevre: n + 40, cap: ((n + 40) / Math.PI).toFixed(1).replace(".", ",") }));

function lastUpdate(): string {
  const d = new Date();
  d.setMinutes(Math.floor(d.getMinutes() / 15) * 15, 0, 0);
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export default function ProductView({ p, similar }: { p: Product; similar: React.ReactNode }) {
  const router = useRouter();
  const { fav, toggleFav, addToCart } = useStore();
  const [v, setV] = useState(defaultVariant(p));
  const [view, setView] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [rehber, setRehber] = useState(false);
  const [canli, setCanli] = useState(false);
  const [ilce, setIlce] = useState("");
  const [toast, setToast] = useState("");
  const [saat, setSaat] = useState("");
  useEffect(() => setSaat(p.fiyatZamani ? new Date(p.fiyatZamani).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : lastUpdate()), [p.fiyatZamani]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2600); return () => clearTimeout(t); }, [toast]);

  const normal = variantPrice(p, v);
  const firsat = firsatPrice(p, v);
  const fiyat = firsat ?? normal;
  const yok = v.stok === "yok";
  const on = fav.includes(p.kod);
  const kazanilacak = Math.floor(fiyat.toplamKurus / 100); // %1 örnek
  const waText = `Merhaba Cevat Usta, ${p.ad} (${p.kod})${p.olcuTuru ? `, ${p.olcuTuru.toLowerCase()} ${v.olcu}` : ""} hakkında bilgi almak istiyorum.`;

  const share = async () => {
    const url = `${location.origin}/urun/${p.kod}${p.olcuTuru ? `?olcu=${encodeURIComponent(v.olcu)}` : ""}`;
    try {
      if (navigator.share) { await navigator.share({ title: p.ad, text: `${p.ad} · Kapalıçarşıdan Al`, url }); return; }
      await navigator.clipboard.writeText(url); setToast("Bağlantı kopyalandı");
    } catch { /* kullanıcı vazgeçti */ }
  };
  const copyWa = async () => {
    try { await navigator.clipboard.writeText(waText); setToast("Mesaj kopyalandı · WhatsApp numarası açılışta eklenecek"); }
    catch { setToast("Mesaj: " + waText); }
  };

  const delivery = !ilce ? null
    : ilce === "İstanbul dışı" ? "Sigortalı kargo · 1–3 iş günü (örnek)"
    : v.stok === "kendi" && !UZAK.has(ilce) ? "Yarın teslim · uygun saatlerde 2–3 saatlik kurye seçeneği (örnek)"
    : "Sigortalı kargo · 1–2 iş günü (örnek)";

  const thumbs = [
    <JewelryArt key="a" art={p.art} tone={p.renk} id={`t1${p.kod}`} size="86%" />,
    <img key="b" src="/cevat/urunu-anlatir.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />,
    <span key="c" className="stamp">{p.milyem}</span>,
    <JewelryArt key="d" art={p.art} tone={p.renk} id={`t2${p.kod}`} size="140%" />,
  ];

  return (
    <div className="pd-page">
      <div className="pd">
        <div className="gallery">
          <div className={`main${zoom ? " zoom" : ""}`}>
            {view === 1 ? (
              <img src="/cevat/urunu-anlatir.jpg" alt="Cevat Usta ürünü anlatıyor" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : view === 2 ? (
              <div style={{ textAlign: "center" }}><div className="stamp" style={{ fontFamily: "var(--serif)", fontSize: 64, color: "var(--gold-2)", fontWeight: 700 }}>{p.milyem}</div><p className="note">Ayar damgası · gerçek fotoğraf gelecek</p></div>
            ) : (
              <button onClick={() => setZoom(!zoom)} aria-label={zoom ? "Yakınlaştırmayı kapat" : "Yakınlaştır"} style={{ border: 0, background: "none", width: "100%", display: "grid", placeItems: "center" }}>
                <JewelryArt art={p.art} tone={p.renk} id={`m${p.kod}`} size={view === 3 ? "120%" : "78%"} />
              </button>
            )}
            {firsat && <span className="tag tag-sale">Süreli fırsat</span>}
            <button className={`fav${on ? " on" : ""}`} onClick={() => toggleFav(p.kod)} aria-pressed={on} aria-label="Favori"><Icon name="heart" size={18} /></button>
          </div>
          <div className="thumbs">
            {thumbs.map((t, i) => <button key={i} className={view === i ? "on" : ""} onClick={() => { setView(i); setZoom(false); }} aria-label={`Görsel ${i + 1}`}>{t}</button>)}
          </div>
        </div>

        <div className="pd-info">
          <span className="eyebrow">{p.ayar} ayar · {p.renk}{p.pirlanta ? " · Pırlanta" : ""}</span>
          <h1>{p.ad}</h1>
          <div className="pd-code">Ürün kodu {p.kod}</div>
          <div className="pd-price">
            <span className="price num">{tl(fiyat.toplamKurus)}</span>
            {firsat && <span className="price-old num">{tl(normal.toplamKurus)}</span>}
          </div>
          {firsat && <div style={{ marginTop: 8 }}><DealTimer label="Fırsatın bitmesine" bitis={p.firsat?.bitis} /></div>}
          <div className="updated"><span className="dot" />Fiyatlar altın kuruna göre 15 dakikada bir güncellenir · Son güncelleme {saat || "--:--"}</div>

          <div className="facts">
            <div>Ağırlık<b className="num">{gram(v.netMg)}</b></div>
            <div>Ayar<b>{p.ayar} · {p.milyem}</b></div>
            <div>{p.pirlanta ? "Taş" : "Renk"}<b>{p.pirlanta ? p.pirlanta.karat : p.renk}</b></div>
          </div>

          {p.olcuTuru && (
            <>
              <div className="row-between">
                <div className="label">{p.olcuTuru}</div>
                {p.olcuTuru === "Yüzük ölçüsü" && <button className="link" onClick={() => setRehber(true)} style={{ marginTop: 20 }}>Ölçümü bilmiyorum</button>}
              </div>
              <div className="sizes" role="radiogroup" aria-label={p.olcuTuru}>
                {p.varyantlar.map((x) => (
                  <button key={x.olcu} role="radio" aria-checked={x.olcu === v.olcu} className={`size${x.olcu === v.olcu ? " on" : ""}${x.stok === "yok" ? " out" : ""}`} onClick={() => setV(x)}>
                    {x.olcu}{x.stok === "tedarikci" && <span className="dot" title="Atölyede" />}
                  </button>
                ))}
              </div>
              <p className="note" style={{ marginTop: 8 }}>Ölçüye göre gram ve fiyat değişir.</p>
            </>
          )}
          <div className="stock-line"><span className="pip" style={{ background: STOK_RENK[v.stok] }} />{STOK_METNI[v.stok]}</div>

          <div className="usta" style={{ marginTop: 18 }}>
            <img className="avatar" src="/cevat/portre.jpg" alt="Cevat Usta" />
            <div className="bubble">{p.ustaNotu}<small>— Cevat Usta</small></div>
          </div>

          <div style={{ marginTop: 18 }}>
            <details className="acc">
              <summary><Icon name="info" /><span className="grow">Ürün bilgileri</span><span className="chev"><Icon name="down" size={18} /></span></summary>
              <div className="content">
                <p style={{ marginTop: 0 }}>{p.aciklama}</p>
                {p.pirlanta && (
                  <table className="breakdown"><tbody>
                    <tr><td>Pırlanta türü</td><td>{p.pirlanta.tur}</td></tr>
                    <tr><td>Karat</td><td>{p.pirlanta.karat}</td></tr>
                    <tr><td>Renk / berraklık</td><td>{p.pirlanta.renk} / {p.pirlanta.berraklik}</td></tr>
                    <tr><td>Kesim</td><td>{p.pirlanta.kesim}</td></tr>
                    <tr><td>Sertifika</td><td>{p.pirlanta.sertifika ?? "Yok"}</td></tr>
                  </tbody></table>
                )}
              </div>
            </details>
            <details className="acc">
              <summary><Icon name="truck" /><span className="grow">Teslimat, iade ve bakım</span><span className="chev"><Icon name="down" size={18} /></span></summary>
              <div className="content">
                <label htmlFor="ilce" className="note">Teslimat ilçeni seç</label>
                <select id="ilce" className="select" style={{ width: "100%", marginTop: 6 }} value={ilce} onChange={(e) => setIlce(e.target.value)}>
                  <option value="">İlçe seç</option>
                  {ILCELER.map((i) => <option key={i}>{i}</option>)}
                </select>
                {delivery && <p style={{ marginBottom: 0, color: "var(--emerald-2)", fontWeight: 600 }}>{delivery}</p>}
                <p>İade ve cayma koşulları, ön bilgilendirme formunda yer alacak. Altın takıyı yumuşak bir bezle silin; parfüm ve klordan uzak tutun.</p>
              </div>
            </details>
          </div>

          <div className="actions-mini">
            <button className="btn btn-ghost btn-sm" onClick={share}><Icon name="share" size={17} />Paylaş</button>
            <button className="btn btn-ghost btn-sm" onClick={copyWa}><Icon name="chat" size={17} />WhatsApp'tan sor</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setCanli(true)}><Icon name="video" size={17} />Canlı görmek istiyorum</button>
            <Link className="btn btn-ghost btn-sm" href={`/sepet?hediye=${p.kod}`}><Icon name="gift" size={17} />Hediye olarak gönder</Link>
          </div>
          <p className="note" style={{ marginTop: 10 }}>Bu alışverişten yaklaşık <b>{tl(kazanilacak)}</b> Altın Lira kazanırsın (örnek oran %1, kesinleşmedi).</p>
        </div>
      </div>

      {similar}

      <div className="sticky-buy">
        <div className="shell">
          <div className="p"><b className="num">{tl(fiyat.toplamKurus)}</b><span>{p.olcuTuru ? `Ölçü ${v.olcu} · ` : ""}{gram(v.netMg)}</span></div>
          <div className="btns">
            <button className="btn btn-primary" disabled={yok} onClick={() => { addToCart(p.kod, v.olcu); router.push("/sepet"); }}>Hemen Al</button>
            <button className="btn btn-outline" disabled={yok || !!firsat} title={firsat ? "Fırsat ürünlerinde pazarlık yapılmaz" : undefined}
              onClick={() => router.push(`/pazarlik?urun=${p.kod}&olcu=${encodeURIComponent(v.olcu)}`)}>Pazarlık Et</button>
          </div>
        </div>
      </div>

      {rehber && (
        <div className="modal-bg" onClick={() => setRehber(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="rehber-baslik" onClick={(e) => e.stopPropagation()}>
            <div className="row-between"><h2 id="rehber-baslik">Yüzük ölçünü bul</h2><button className="icon-btn" onClick={() => setRehber(false)} aria-label="Kapat"><Icon name="x" /></button></div>
            <ol style={{ paddingLeft: 18, color: "var(--ink-2)", fontSize: 14 }}>
              <li>Parmağını tam oturan bir yüzüğünün iç çapını cetvelle ölç.</li>
              <li>Ya da ince bir kâğıt şeridi parmağına sar, birleştiği yeri işaretle, uzunluğu ölç (iç çevre).</li>
              <li>Aşağıdaki tablodan numarayı bul. İki ölçü arasındaysan büyüğünü seç.</li>
            </ol>
            <table className="sizetable"><thead><tr><th>Numara</th><th>İç çevre</th><th>İç çap</th></tr></thead>
              <tbody>{OLCU_TABLO.map((r) => <tr key={r.n}><td>{r.n}</td><td>{r.cevre} mm</td><td>{r.cap} mm</td></tr>)}</tbody></table>
            <p className="note">Örnek tablo; kesin tablo toptancı ölçü standardıyla doğrulanacak.</p>
          </div>
        </div>
      )}

      {canli && (
        <div className="modal-bg" onClick={() => setCanli(false)}>
          <form className="modal" role="dialog" aria-modal="true" aria-labelledby="canli-baslik" onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => { e.preventDefault(); setCanli(false); setToast("Talebin alındı (önizleme) · Berat seni arayacak"); }}>
            <div className="row-between"><h2 id="canli-baslik">Canlı görmek istiyorum</h2><button type="button" className="icon-btn" onClick={() => setCanli(false)} aria-label="Kapat"><Icon name="x" /></button></div>
            <p style={{ color: "var(--ink-2)", fontSize: 14 }}>{p.ad} ({p.kod}) için görüntülü gösterim randevusu. Uygun saatinde WhatsApp görüntülü aramayla gösteririz.</p>
            <label className="note" htmlFor="canli-gun">Gün</label>
            <select id="canli-gun" className="select" style={{ width: "100%", margin: "4px 0 10px" }}><option>Bugün</option><option>Yarın</option><option>Bu hafta</option></select>
            <label className="note" htmlFor="canli-saat">Saat aralığı</label>
            <select id="canli-saat" className="select" style={{ width: "100%", margin: "4px 0 10px" }}><option>10:00–13:00</option><option>13:00–17:00</option><option>17:00–20:00</option></select>
            <label className="note" htmlFor="canli-tel">Telefon</label>
            <input id="canli-tel" className="select" style={{ width: "100%", margin: "4px 0 16px" }} inputMode="tel" placeholder="05xx xxx xx xx" />
            <button className="btn btn-primary btn-block" type="submit">Randevu iste</button>
          </form>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
