"use client";
import Link from "next/link";
import { useState } from "react";
import JewelryArt from "./JewelryArt";
import Icon from "./Icon";
import Countdown from "./Countdown";
import Yaziyor from "./Yaziyor";
import { ODEME_SURESI_MS, baslat, kabulEt, teklifVer, vazgec, type Olay, type Pazarlik } from "@/lib/patron";
import { defaultVariant, variantPrice, type Product } from "@/lib/catalog";
import { gram, tl } from "@/lib/pricing";

const binlik = (rakam: string) => (rakam ? new Intl.NumberFormat("tr-TR").format(Number(rakam)) : "");
const saat = (t: number) => new Date(t).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

function satir(o: Olay): string {
  const t = o.tutar ? tl(o.tutar) : "";
  switch (o.tur) {
    case "teklif": return `Teklifim ${t}`;
    case "kabul": return o.kim === "patron" ? `Patron teklifini kabul etti: ${t}` : `Kabul ediyorum: ${t}`;
    case "ret": return "Patron bu teklifi kabul etmedi. Biraz daha yaklaşırsan yeniden iletirim.";
    case "karsi": return `Patron bu fiyatı önerdi: ${t}. Ne dersin?`;
    case "son": return `Patron son sözünü söyledi: ${t}. Karar sende.`;
    case "vazgec": return "Vazgeçtim.";
  }
}

export default function Bargain({ p, olcu }: { p: Product; olcu: string }) {
  const v = p.varyantlar.find((x) => x.olcu === olcu) ?? defaultVariant(p);
  const liste = variantPrice(p, v).toplamKurus;
  const [s, setS] = useState<Pazarlik>(() => baslat(liste));
  const [giris, setGiris] = useState("");
  const [bekle, setBekle] = useState(false);
  const [bitis, setBitis] = useState<number | null>(null);
  const [sureDoldu, setSureDoldu] = useState(false);
  const [hata, setHata] = useState("");

  const gonder = () => {
    const tutar = Number(giris.replace(/\D/g, "")) * 100;
    if (!tutar || tutar < 100) { setHata("Geçerli bir tutar yaz."); return; }
    setHata(""); setBekle(true);
    const zaman = Date.now();
    setTimeout(() => {
      const yeni = teklifVer(s, tutar, zaman);
      setS(yeni); setBekle(false);
      setGiris(yeni.patronTeklif && (yeni.durum === "KARSI_TEKLIF" || yeni.durum === "SON_FIYAT") ? binlik(String(Math.round(yeni.patronTeklif / 100))) : "");
      if (yeni.durum === "ANLASMA") setBitis(Date.now() + ODEME_SURESI_MS);
    }, 900);
  };
  const kabul = () => { setS(kabulEt(s, Date.now())); setBitis(Date.now() + ODEME_SURESI_MS); };

  const acik = s.durum === "BEKLIYOR" || s.durum === "KARSI_TEKLIF";

  return (
    <div className="bz">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="panel bz-product">
          <div className="thumb"><JewelryArt art={p.art} tone={p.renk} id={`bz${p.kod}`} size="88%" /></div>
          <div>
            <h2>{p.ad}</h2>
            <div className="note">{p.olcuTuru ? `Ölçü ${v.olcu} · ` : ""}{gram(v.netMg)} · {p.ayar} ayar · {p.milyem}</div>
            <div className="price num" style={{ fontSize: 22, marginTop: 4 }}>{tl(liste)}</div>
            <div className="note">Liste fiyatı (örnek)</div>
          </div>
        </div>

        {s.durum === "ANLASMA" && bitis && !sureDoldu && (
          <div className="deal" role="status">
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--emerald)", fontWeight: 700 }}><Icon name="check" />Anlaştınız</div>
            <div><div className="note">Anlaşılan fiyat</div><div className="big num">{tl(s.anlasilan!)}</div></div>
            <div className="timer"><Icon name="clock" />Ödeme için kalan süre <Countdown until={bitis} onEnd={() => setSureDoldu(true)} /></div>
            <div className="auto-note"><Icon name="lock" size={14} />Ürün ve fiyat bu süre boyunca senin için ayrıldı.</div>
            <div className="lira-hint"><span className="coin">₺</span><span>Bu alışverişle <b>{tl(Math.floor(s.anlasilan! / 100))}</b> Altın Lira kazanacaksın; bir sonraki alışverişinde kullanabilirsin.</span></div>
            <Link className="btn btn-primary btn-block" href={`/sepet?pazarlik=${p.kod}&olcu=${encodeURIComponent(v.olcu)}&tutar=${s.anlasilan}`}>Ödemeye geç <Icon name="chevron" size={18} /></Link>
            <p className="note" style={{ margin: 0 }}>Önizleme: gerçek sistemde süre ve ayırma sunucuda tutulur; süre dolunca ödeme durumu kontrol edilmeden ürün serbest bırakılmaz.</p>
          </div>
        )}
        {sureDoldu && (
          <div className="panel" style={{ padding: 16 }}>
            <b>Ödeme süresi doldu.</b>
            <p className="note">Ürün yeniden satışa açıldı. İstersen yeni bir pazarlık başlatabilirsin.</p>
            <button className="btn btn-outline btn-sm" onClick={() => { setS(baslat(liste)); setBitis(null); setSureDoldu(false); }}>Yeniden başla</button>
          </div>
        )}
        <div className="panel" style={{ padding: 16 }}>
          <ol className="steps" style={{ margin: 0, padding: 0 }}>
            <li><span><b>Teklifini yaz</b><span>Cevat Usta teklifini patrona iletir.</span></span></li>
            <li><span><b>Patron yanıtlar</b><span>Kabul eder, karşı teklif verir ya da son fiyatını söyler.</span></span></li>
            <li><span><b>Anlaşınca 15 dakika</b><span>Fiyat ve ürün ayrılır, ödemeyi tamamlarsın.</span></span></li>
          </ol>
        </div>
      </div>

      <div className="panel bz-chat" aria-live="polite">
        <div className="msg">
          <img className="av" src="/cevat/portre.jpg" alt="" />
          <div className="b"><Yaziyor metin={`Hoş geldin! ${p.ad}, çok iyi seçim; göz zevkin yerinde. Teklifini yaz, hemen patrona ileteyim.`} gecikme={500} /><small>Cevat Usta</small></div>
        </div>
        {s.olaylar.map((o, i) => o.kim === "musteri" ? (
          <div key={i} className="msg me"><div className="b">{satir(o)}<small>{saat(o.zaman)}</small></div></div>
        ) : (
          <div key={i} className="msg">
            <img className="av" src="/cevat/patrona-iletir.jpg" alt="" />
            <div className="b"><Yaziyor metin={satir(o)} gecikme={400} /><small>Patronun belirlediği kurallara göre otomatik yanıt · {saat(o.zaman)}</small></div>
          </div>
        ))}
        {bekle && (
          <div className="msg"><img className="av" src="/cevat/patrona-iletir.jpg" alt="" /><div className="b"><span className="yz-nokta"><i /><i /><i /><em>Teklifini patrona ilettim, cevap bekleniyor</em></span></div></div>
        )}

        {acik && !bekle && (
          <>
            {(() => {
              const t = Number(giris.replace(/\D/g, "")) * 100 || liste;
              return (
                <div className="lira-hint"><span className="coin">₺</span><span>Bu alışverişten <b>{tl(Math.floor(t / 100))}</b> Altın Lira kazanırsın; bir sonraki alışverişinde kullanırsın.</span></div>
              );
            })()}
            <div className="offer">
              <label className="money" htmlFor="teklif">
                <input id="teklif" inputMode="numeric" placeholder={new Intl.NumberFormat("tr-TR").format(Math.round(liste / 100 * 0.94 / 50) * 50)}
                  value={giris} onChange={(e) => setGiris(binlik(e.target.value.replace(/\D/g, "").slice(0, 9)))} onKeyDown={(e) => e.key === "Enter" && gonder()} />
                <span>TL</span>
              </label>
              <button className="btn btn-primary" onClick={gonder}>{s.musteriTeklifSayisi ? "Yeni teklif" : "Teklif ver"}</button>
            </div>
            {hata && <p className="note" style={{ color: "var(--sale)", margin: 0 }}>{hata}</p>}
            {s.durum === "KARSI_TEKLIF" && (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-gold" style={{ flex: 1 }} onClick={kabul}>{tl(s.patronTeklif!)} kabul et</button>
                <button className="btn btn-ghost" onClick={() => setS(vazgec(s, Date.now()))}>Vazgeç</button>
              </div>
            )}
          </>
        )}
        {s.durum === "SON_FIYAT" && (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-gold" style={{ flex: 1 }} onClick={kabul}>{tl(s.patronTeklif!)} kabul et</button>
            <button className="btn btn-ghost" onClick={() => setS(vazgec(s, Date.now()))}>Reddet</button>
          </div>
        )}
        {s.durum === "ANLASMA" && bitis && !sureDoldu && (
          <div className="msg">
            <img className="av" src="/cevat/hazirlar.jpg" alt="" />
            <div className="b"><Yaziyor metin="Anlaştınız, hayırlı olsun! Ürün 15 dakika senin için ayrıldı." gecikme={300} /><small>Cevat Usta</small>
              <Link className="btn btn-primary btn-sm" style={{ marginTop: 8 }} href={`/sepet?pazarlik=${p.kod}&olcu=${encodeURIComponent(v.olcu)}&tutar=${s.anlasilan}`}>Ödemeye geç · <Countdown until={bitis} /></Link>
            </div>
          </div>
        )}
        {s.durum === "KAPANDI" && (
          <div className="msg"><img className="av" src="/cevat/hos-geldin.jpg" alt="" /><div className="b"><Yaziyor metin="Olsun, kapımız her zaman açık. Başka bir takıya bakalım mı?" gecikme={400} /><small>Cevat Usta</small></div></div>
        )}
        <div className="auto-note"><Icon name="info" size={14} />Patron yanıtları, patronun önceden belirlediği kurallarla otomatik verilir. İndirim garantisi yoktur.</div>
      </div>
    </div>
  );
}
