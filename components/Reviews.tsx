"use client";
import { useState } from "react";
import Stars from "./Stars";
import Icon from "./Icon";
import { cihazId } from "@/lib/useStore";
import { yorumGonder } from "@/app/(magaza)/actions";
import type { Yorum } from "@/lib/db";

const PUAN_METNI = ["", "Beğenmedim", "İdare eder", "Güzel", "Çok güzel", "Bayıldım"];

export default function Reviews({ kod, ad, yorumlar }: { kod: string; ad: string; yorumlar: Yorum[] }) {
  const [puan, setPuan] = useState(0);
  const [isim, setIsim] = useState("");
  const [metin, setMetin] = useState("");
  const [durum, setDurum] = useState<{ ok: boolean; mesaj: string } | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [acik, setAcik] = useState(false);

  const n = yorumlar.length;
  const ort = n ? yorumlar.reduce((s, y) => s + y.puan, 0) / n : 0;
  const dagilim = [5, 4, 3, 2, 1].map((p) => ({ p, c: yorumlar.filter((y) => y.puan === p).length }));

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setGonderiliyor(true);
    const s = await yorumGonder({ kod, cihaz: cihazId(), puan, ad: isim, metin }).catch(() => ({ ok: false, mesaj: "Bağlantı sorunu; tekrar dene." }));
    setGonderiliyor(false); setDurum(s);
    if (s.ok) { setPuan(0); setMetin(""); setAcik(false); }
  };

  return (
    <section className="section reviews" id="yorumlar" aria-labelledby="yorum-baslik">
      <div className="section-head"><h2 id="yorum-baslik">Değerlendirmeler</h2></div>
      <div className="rv-grid">
        <div className="panel rv-summary">
          {n ? (
            <>
              <div className="rv-big num">{ort.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}</div>
              <Stars deger={ort} size={20} />
              <div className="note">{n} değerlendirme</div>
              <div className="rv-bars">
                {dagilim.map((d) => (
                  <div key={d.p} className="rv-bar"><span>{d.p}</span><i><b style={{ width: `${(d.c / n) * 100}%` }} /></i><span className="note">{d.c}</span></div>
                ))}
              </div>
            </>
          ) : (
            <>
              <Stars deger={0} size={22} />
              <p style={{ margin: "8px 0 0", fontWeight: 600 }}>Henüz değerlendirme yok</p>
              <p className="note" style={{ margin: "4px 0 0" }}>{ad} için ilk puanı sen ver.</p>
            </>
          )}
          {!acik && <button className="btn btn-primary btn-block" style={{ marginTop: 14 }} onClick={() => { setAcik(true); setDurum(null); }}><Icon name="star" size={18} />Puan ver, yorum yaz</button>}
          {durum && <p className="note" role="status" style={{ marginTop: 10, color: durum.ok ? "var(--emerald)" : "var(--sale)" }}>{durum.mesaj}</p>}
        </div>

        <div className="rv-list">
          {acik && (
            <form className="panel rv-form" onSubmit={gonder}>
              <div className="label" style={{ marginTop: 0 }}>Puanın</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Stars deger={puan} size={30} secim={setPuan} etiket="Puan seç" />
                <span className="note">{PUAN_METNI[puan]}</span>
              </div>
              <label className="note" htmlFor="rv-ad">Adın ya da rumuzun</label>
              <input id="rv-ad" className="select" maxLength={40} value={isim} onChange={(e) => setIsim(e.target.value)} placeholder="Örn. Ayşe K." />
              <label className="note" htmlFor="rv-metin">Yorumun (isteğe bağlı)</label>
              <textarea id="rv-metin" className="select" rows={4} maxLength={1000} value={metin} onChange={(e) => setMetin(e.target.value)} placeholder="Takıyı nasıl buldun? Duruşu, parlaklığı, paketlemesi…" />
              {durum && !durum.ok && <p className="note" style={{ color: "var(--sale)", margin: 0 }}>{durum.mesaj}</p>}
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} disabled={gonderiliyor}>{gonderiliyor ? "Gönderiliyor…" : "Gönder"}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setAcik(false)}>Vazgeç</button>
              </div>
              <p className="note" style={{ margin: 0 }}>Yorumlar kontrol edildikten sonra yayınlanır. Adın dışında kişisel bilgi paylaşma.</p>
            </form>
          )}
          {yorumlar.map((y) => (
            <article key={y.id} className="panel rv-item">
              <div className="row-between">
                <b>{y.ad}</b>
                <span className="note">{new Date(y.olusturma).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
              <Stars deger={y.puan} size={15} />
              {y.metin && <p style={{ margin: "6px 0 0" }}>{y.metin}</p>}
            </article>
          ))}
          {!n && !acik && <div className="panel rv-item note">Yorumlar burada görünecek.</div>}
        </div>
      </div>
    </section>
  );
}
