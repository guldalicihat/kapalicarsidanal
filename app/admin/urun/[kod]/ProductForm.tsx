"use client";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { saveProduct } from "../../actions";
import { priceOf, tl } from "@/lib/pricing";

export type FormUrun = {
  kod: string; ad: string; kategori: string; tedarikci_kod: string | null; ayar: number; milyem: number; renk: string;
  iscilik_milyem: number; olcu_turu: string | null; aciklama: string | null; usta_notu: string | null;
  pirlanta: { tur: string; karat: string; renk: string; berraklik: string; kesim: string; sertifika: string | null; tasKurus: number } | null;
  firsat_iscilik_indirim: number | null; firsat_bitis: string | null; yeni: boolean; usta_secimi: boolean; yayinda: boolean; gorseller: string[];
  varyantlar: { olcu: string; net_mg: number; kendi_stok: number; tedarikci_stok_teyitli: boolean; tedarik_gun: number | null }[];
};

const MILYEM: Record<number, number> = { 8: 333, 14: 585, 18: 750, 22: 916, 24: 995 };
type V = { olcu: string; gram: string; stok: string; ted: boolean; gun: string };
const bos: V = { olcu: "", gram: "", stok: "0", ted: false, gun: "" };
const yerel = (iso: string | null) => (iso ? new Date(new Date(iso).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "");

export default function ProductForm({ urun, kategoriler, hasKurus, altinKaynak }: { urun: FormUrun | null; kategoriler: { slug: string; ad: string }[]; hasKurus: number; altinKaynak: string }) {
  const [s, act, bekle] = useActionState(saveProduct, null);
  const [kategori, setKategori] = useState(urun?.kategori ?? "yuzuk");
  const [ayar, setAyar] = useState(urun?.ayar ?? 14);
  const [iscilik, setIscilik] = useState(String(urun?.iscilik_milyem ?? 90));
  const [tas, setTas] = useState(urun?.pirlanta ? String(urun.pirlanta.tasKurus / 100) : "");
  const [firsat, setFirsat] = useState(urun?.firsat_iscilik_indirim ? String(urun.firsat_iscilik_indirim) : "");
  const [gorseller, setGorseller] = useState<string[]>(urun?.gorseller ?? []);
  const [secilen, setSecilen] = useState<string[]>([]);
  const [v, setV] = useState<V[]>(
    urun?.varyantlar.length
      ? [...urun.varyantlar].sort((a, b) => a.net_mg - b.net_mg).map((x) => ({ olcu: x.olcu, gram: String(x.net_mg / 1000), stok: String(x.kendi_stok), ted: x.tedarikci_stok_teyitli, gun: x.tedarik_gun ? String(x.tedarik_gun) : "" }))
      : [{ ...bos }],
  );
  const pirlanta = kategori === "pirlanta" || !!urun?.pirlanta;
  const ornek = useMemo(() => {
    const g = Number(v.find((x) => Number(x.gram) > 0)?.gram);
    if (!(g > 0)) return null;
    const temel = { netMg: Math.round(g * 1000), ayarMilyem: MILYEM[ayar], hasKurus, tasKurus: pirlanta ? Math.round(Number(tas || 0) * 100) : 0 };
    const normal = priceOf({ ...temel, iscilikMilyem: Number(iscilik) || 0 });
    const f = Number(firsat);
    const indirimli = f >= 1 && f <= 90 ? priceOf({ ...temel, iscilikMilyem: Math.round(((Number(iscilik) || 0) * (100 - f)) / 100) }) : null;
    return { g, normal, indirimli };
  }, [v, ayar, iscilik, tas, firsat, hasKurus, pirlanta]);
  const set = (i: number, p: Partial<V>) => setV(v.map((x, j) => (j === i ? { ...x, ...p } : x)));

  return (
    <form action={act}>
      <div className="adm-head">
        <div>
          <Link href="/admin" className="note">← Ürünler</Link>
          <h1>{urun ? urun.ad : "Yeni ürün"}</h1>
        </div>
        {urun && <Link href={`/urun/${urun.kod}`} target="_blank" className="btn btn-ghost btn-sm">Sitede gör ↗</Link>}
      </div>
      {s && !s.ok && <div className="notice err" role="alert">{s.mesaj}</div>}
      <input type="hidden" name="eskiKod" value={urun?.kod ?? ""} />

      <section className="adm-card">
        <h2>Temel bilgiler</h2>
        <div className="fgrid">
          <label className="f">Ürün kodu<input name="kod" defaultValue={urun?.kod ?? ""} readOnly={!!urun} required placeholder="KA-Y050" style={{ textTransform: "uppercase" }} /><span className="hint">Örn. KA-Y050 · sonradan değişmez</span></label>
          <label className="f span2">Ürün adı<input name="ad" defaultValue={urun?.ad ?? ""} required placeholder="Burgu Altın Yüzük" /></label>
          <label className="f">Kategori
            <select name="kategori" value={kategori} onChange={(e) => setKategori(e.target.value)}>{kategoriler.map((k) => <option key={k.slug} value={k.slug}>{k.ad}</option>)}</select>
          </label>
          <label className="f">Tedarikçi model kodu<input name="tedarikciKod" defaultValue={urun?.tedarikci_kod ?? ""} placeholder="Toptancının kodu" /></label>
          <label className="f">Renk
            <select name="renk" defaultValue={urun?.renk ?? "Sarı altın"}><option>Sarı altın</option><option>Beyaz altın</option><option>Rose altın</option></select>
          </label>
          <label className="f">Ayar
            <select name="ayar" value={ayar} onChange={(e) => setAyar(Number(e.target.value))}>{[8, 14, 18, 22, 24].map((a) => <option key={a} value={a}>{a} ayar ({MILYEM[a]})</option>)}</select>
            <input type="hidden" name="milyem" value={MILYEM[ayar]} />
          </label>
          <label className="f">İşçilik milyemi<input name="iscilik" inputMode="numeric" value={iscilik} onChange={(e) => setIscilik(e.target.value)} /><span className="hint">Toptancının verdiği işçilik (binde)</span></label>
          <label className="f">Ölçü türü
            <select name="olcuTuru" defaultValue={urun?.olcu_turu ?? (kategori === "yuzuk" || kategori === "pirlanta" ? "Yüzük ölçüsü" : "")}>
              <option value="">Ölçü yok (tek ölçü)</option><option>Yüzük ölçüsü</option><option>Uzunluk</option><option>Çap</option>
            </select>
          </label>
          <label className="f span3">Açıklama<textarea name="aciklama" defaultValue={urun?.aciklama ?? ""} placeholder="Model, işçilik, kullanım…" /></label>
          <label className="f span3">Cevat Usta'nın notu<textarea name="ustaNotu" defaultValue={urun?.usta_notu ?? ""} placeholder="Ürünü tanıtan, öven samimi bir söz. Örn: Bu burgu tam bir klasik! Işığı her açıdan yakalar…" /></label>
        </div>
      </section>

      <section className="adm-card">
        <h2>Ölçüler, gram ve stok</h2>
        <div className="vrow vhead"><span>Ölçü</span><span>Net gram</span><span>Kendi stok</span><span>Atölyede</span><span>Tedarik (gün)</span><span /></div>
        <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
          {v.map((x, i) => (
            <div className="vrow" key={i}>
              <input name="v_olcu" aria-label="Ölçü" placeholder="16 / 45 cm / Tek ölçü" value={x.olcu} onChange={(e) => set(i, { olcu: e.target.value })} />
              <input name="v_gram" aria-label="Net gram" inputMode="decimal" placeholder="3,20" value={x.gram} onChange={(e) => set(i, { gram: e.target.value })} />
              <input name="v_stok" aria-label="Kendi stok" inputMode="numeric" value={x.stok} onChange={(e) => set(i, { stok: e.target.value })} />
              <label className="chk"><input type="checkbox" name="v_ted" value={i} checked={x.ted} onChange={(e) => set(i, { ted: e.target.checked })} />var</label>
              <input name="v_gun" aria-label="Tedarik günü" inputMode="numeric" placeholder="2" value={x.gun} onChange={(e) => set(i, { gun: e.target.value })} />
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setV(v.length > 1 ? v.filter((_, j) => j !== i) : [{ ...bos }])} aria-label="Satırı sil">Sil</button>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => setV([...v, { ...bos }])}>+ Ölçü ekle</button>
        <p className="note" style={{ marginBottom: 0 }}>“Atölyede var”: kendi stoğumuzda yok ama toptancı stok teyidi verdi. Teyit zamanı kaydedilir.</p>
      </section>

      {pirlanta && (
        <section className="adm-card">
          <h2>Pırlanta bilgileri</h2>
          <div className="fgrid">
            <label className="f">Tür<select name="p_tur" defaultValue={urun?.pirlanta?.tur ?? "Doğal"}><option>Doğal</option><option>Laboratuvar</option></select></label>
            <label className="f">Karat<input name="p_karat" defaultValue={urun?.pirlanta?.karat ?? ""} placeholder="0,30 ct" /></label>
            <label className="f">Taş bedeli (TL)<input name="p_tas" inputMode="decimal" value={tas} onChange={(e) => setTas(e.target.value)} placeholder="32500" /></label>
            <label className="f">Renk<input name="p_renk" defaultValue={urun?.pirlanta?.renk ?? ""} placeholder="G" /></label>
            <label className="f">Berraklık<input name="p_berraklik" defaultValue={urun?.pirlanta?.berraklik ?? ""} placeholder="VS2" /></label>
            <label className="f">Kesim<input name="p_kesim" defaultValue={urun?.pirlanta?.kesim ?? ""} placeholder="Çok iyi" /></label>
            <label className="f span3">Sertifika (no / kurum)<input name="p_sertifika" defaultValue={urun?.pirlanta?.sertifika ?? ""} placeholder="Yoksa boş bırakın" /></label>
          </div>
        </section>
      )}

      <section className="adm-card">
        <h2>Fotoğraflar</h2>
        <div className="photos">
          {gorseller.map((u) => (
            <div className="photo" key={u}><img src={u} alt="" /><input type="hidden" name="gorsel" value={u} />
              <button type="button" aria-label="Fotoğrafı kaldır" onClick={() => setGorseller(gorseller.filter((x) => x !== u))}>×</button></div>
          ))}
          {secilen.map((n) => <div className="photo" key={n} style={{ display: "grid", placeItems: "center", fontSize: 11, padding: 6, textAlign: "center" }}>{n}<br />(kaydedince yüklenir)</div>)}
        </div>
        <label className="f" style={{ marginTop: 12 }}>Fotoğraf ekle
          <input type="file" name="dosya" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => setSecilen(Array.from(e.target.files ?? []).map((f) => f.name))} style={{ height: "auto", padding: 10 }} />
          <span className="hint">JPG/PNG/WEBP, en fazla 8 MB. İlk fotoğraf vitrinde görünür.</span>
        </label>
      </section>

      <section className="adm-card">
        <h2>Vitrin ve fırsat</h2>
        <div className="fgrid">
          <label className="f">Süreli fırsat: işçilik indirimi (%)<input name="firsat" inputMode="numeric" value={firsat} onChange={(e) => setFirsat(e.target.value)} placeholder="Boş = fırsat yok" /></label>
          <label className="f">Fırsat bitiş zamanı<input type="datetime-local" name="firsatBitis" defaultValue={yerel(urun?.firsat_bitis ?? null)} /><span className="hint">Sayaç herkes için bu ana sayar</span></label>
          <div className="f" style={{ justifyContent: "flex-end", gap: 10 }}>
            <label className="chk"><input type="checkbox" name="yeni" defaultChecked={urun?.yeni} />Yeni geldi</label>
            <label className="chk"><input type="checkbox" name="ustaSecimi" defaultChecked={urun?.usta_secimi} />Ustanın seçimi</label>
          </div>
        </div>
        {ornek && (
          <div className="preview" style={{ marginTop: 12 }}>
            İlk ölçü ({String(ornek.g).replace(".", ",")} g) için tahmini satış fiyatı: <b className="num">{tl((ornek.indirimli ?? ornek.normal).toplamKurus)}</b>
            {ornek.indirimli && <> <span className="price-old num">{tl(ornek.normal.toplamKurus)}</span></>}
            <div className="note">Has altın {tl(hasKurus, true)}/g ({altinKaynak}) · örnek formül, işletmeyle kesinleşecek</div>
          </div>
        )}
      </section>

      <div className="savebar">
        <label className="chk" style={{ marginRight: "auto" }}><input type="checkbox" name="yayinda" defaultChecked={urun?.yayinda} />Sitede yayınla</label>
        <Link href="/admin" className="btn btn-ghost">Vazgeç</Link>
        <button className="btn btn-primary" disabled={bekle}>{bekle ? "Kaydediliyor…" : "Kaydet"}</button>
      </div>
    </form>
  );
}
