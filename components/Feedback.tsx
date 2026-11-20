"use client";
// Test kullanıcıları için her sayfada "Geri bildirim" düğmesi. Bildirim, hangi sayfada yazıldığıyla birlikte admin paneline düşer.
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import Stars from "./Stars";
import { cihazId } from "@/lib/useStore";
import { geriBildirimGonder } from "@/app/(magaza)/actions";

const KONULAR = [
  { k: "tasarim", ad: "Tasarım" }, { k: "hata", ad: "Hata / çalışmıyor" }, { k: "fiyat", ad: "Fiyat" },
  { k: "pazarlik", ad: "Pazarlık" }, { k: "oneri", ad: "Öneri" }, { k: "diger", ad: "Diğer" },
];

export default function Feedback() {
  const yol = usePathname();
  const [acik, setAcik] = useState(false);
  const [konu, setKonu] = useState("tasarim");
  const [puan, setPuan] = useState(0);
  const [metin, setMetin] = useState("");
  const [ad, setAd] = useState("");
  const [iletisim, setIletisim] = useState("");
  const [bekle, setBekle] = useState(false);
  const [sonuc, setSonuc] = useState<{ ok: boolean; mesaj: string } | null>(null);
  useEffect(() => { try { setAd(localStorage.getItem("ka.gb.ad") ?? ""); } catch { /* */ } }, []);

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setBekle(true);
    try { localStorage.setItem("ka.gb.ad", ad); } catch { /* */ }
    const s = await geriBildirimGonder({ cihaz: cihazId(), konu, puan: puan || undefined, metin, ad, iletisim, sayfa: `${yol}${location.search}` })
      .catch(() => ({ ok: false, mesaj: "Bağlantı sorunu; tekrar dene." }));
    setBekle(false); setSonuc(s);
    if (s.ok) { setMetin(""); setPuan(0); }
  };

  return (
    <>
      <button className="fb-btn" onClick={() => { setAcik(true); setSonuc(null); }} aria-label="Geri bildirim gönder">
        <Icon name="chat" size={18} /><span>Geri bildirim</span>
      </button>
      {acik && (
        <div className="modal-bg" onClick={() => setAcik(false)}>
          <form className="modal" role="dialog" aria-modal="true" aria-labelledby="fb-baslik" onClick={(e) => e.stopPropagation()} onSubmit={gonder}>
            <div className="row-between"><h2 id="fb-baslik">Görüşün bizim için değerli</h2><button type="button" className="icon-btn" onClick={() => setAcik(false)} aria-label="Kapat"><Icon name="x" /></button></div>
            {sonuc?.ok ? (
              <>
                <p style={{ color: "var(--emerald)", fontWeight: 600 }}>{sonuc.mesaj}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={() => setSonuc(null)}>Bir tane daha yaz</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setAcik(false)}>Kapat</button>
                </div>
              </>
            ) : (
              <>
                <p className="note" style={{ marginTop: 0 }}>Beğendiğin, beğenmediğin, takıldığın her şeyi yaz. Bu sayfa ({yol}) bildirimine otomatik eklenir.</p>
                <div className="label" style={{ marginTop: 4 }}>Konu</div>
                <div className="chips">{KONULAR.map((x) => <button type="button" key={x.k} className={`chip${konu === x.k ? " on" : ""}`} onClick={() => setKonu(x.k)}>{x.ad}</button>)}</div>
                <div className="label">Siteyi genel olarak nasıl buldun? <span className="note">(isteğe bağlı)</span></div>
                <Stars deger={puan} size={28} secim={setPuan} etiket="Genel puan" />
                <label className="note" htmlFor="fb-metin" style={{ display: "block", marginTop: 10 }}>Görüşün</label>
                <textarea id="fb-metin" className="select" rows={4} maxLength={2000} required value={metin} onChange={(e) => setMetin(e.target.value)} placeholder="Örn. Pazarlık ekranında teklif düğmesi küçük kaldı…" style={{ width: "100%" }} />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input className="select" style={{ flex: 1, minWidth: 0 }} maxLength={60} value={ad} onChange={(e) => setAd(e.target.value)} placeholder="Adın (isteğe bağlı)" aria-label="Adın" />
                  <input className="select" style={{ flex: 1, minWidth: 0 }} maxLength={80} value={iletisim} onChange={(e) => setIletisim(e.target.value)} placeholder="Telefon/e-posta (isteğe bağlı)" aria-label="İletişim" />
                </div>
                {sonuc && !sonuc.ok && <p className="note" style={{ color: "var(--sale)" }}>{sonuc.mesaj}</p>}
                <button className="btn btn-primary btn-block" style={{ marginTop: 12 }} disabled={bekle}>{bekle ? "Gönderiliyor…" : "Gönder"}</button>
              </>
            )}
          </form>
        </div>
      )}
    </>
  );
}
