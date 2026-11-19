"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import JewelryArt from "./JewelryArt";
import Icon from "./Icon";
import { useStore } from "@/lib/useStore";
import { variantPrice, firsatPrice } from "@/lib/catalog";
import { useProducts } from "./CatalogProvider";
import { tl } from "@/lib/pricing";

export default function Cart() {
  const sp = useSearchParams();
  const { cart, removeFromCart } = useStore();
  const urunler = useProducts();
  const product = (kod: string) => urunler.find((x) => x.kod === kod);
  const [hediye, setHediye] = useState(!!sp.get("hediye"));
  const [fiyatsiz, setFiyatsiz] = useState(true);
  const [gonder, setGonder] = useState(false);

  const pz = sp.get("pazarlik");
  const satirlar = cart.map((l) => {
    const p = product(l.kod); if (!p) return null;
    const v = p.varyantlar.find((x) => x.olcu === l.olcu) ?? p.varyantlar[0];
    return { p, v, adet: l.adet, fiyat: (firsatPrice(p, v) ?? variantPrice(p, v)).toplamKurus, pazarlik: false };
  }).filter(Boolean) as { p: NonNullable<ReturnType<typeof product>>; v: { olcu: string }; adet: number; fiyat: number; pazarlik: boolean }[];
  const pzUrun = pz ? product(pz) : undefined;
  if (pzUrun) satirlar.unshift({ p: pzUrun, v: { olcu: sp.get("olcu") ?? "" }, adet: 1, fiyat: Number(sp.get("tutar")) || 0, pazarlik: true });
  if (!satirlar.length && sp.get("hediye")) {
    const p = product(sp.get("hediye")!);
    if (p) satirlar.push({ p, v: { olcu: p.varyantlar[0].olcu }, adet: 1, fiyat: variantPrice(p, p.varyantlar[0]).toplamKurus, pazarlik: false });
  }
  const ara = satirlar.reduce((s, l) => s + l.fiyat * l.adet, 0);

  if (!satirlar.length) return (
    <div className="empty panel">
      <img src="/cevat/hazirlar.jpg" alt="" />
      <p>Sepetin boş. Beğendiğin takıyı sepete ekle, özenle hazırlayalım.</p>
      <Link href="/kategori/yuzuk" className="btn btn-primary">Takılara bak</Link>
    </div>
  );

  if (gonder) return (
    <div className="panel" style={{ padding: 22, textAlign: "center" }}>
      <img src="/cevat/hazirlar.jpg" alt="" style={{ width: 140, height: 140, borderRadius: 999, objectFit: "cover", margin: "0 auto 12px", border: "2px solid var(--gold)" }} />
      <h2 style={{ color: "var(--emerald-2)" }}>Ödeme adımı (önizleme)</h2>
      <p style={{ color: "var(--ink-2)" }}>Canlı sürümde burada Kuveyt Türk 3D Secure ödeme sayfası açılır. Kart bilgileri bizim sistemimizde tutulmaz. Ödeme bankadan doğrulandıktan sonra sipariş oluşur.</p>
      <Link href="/siparislerim" className="btn btn-primary">Örnek sipariş takibini gör</Link>
    </div>
  );

  return (
    <div className="two">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="panel">
          {satirlar.map((l, i) => (
            <div className="line" key={i}>
              <div className="thumb"><JewelryArt art={l.p.art} tone={l.p.renk} id={`s${i}${l.p.kod}`} size="86%" /></div>
              <div className="info">
                <b>{l.p.ad}</b>
                <div className="note">{l.p.olcuTuru ? `Ölçü ${l.v.olcu} · ` : ""}{l.adet} adet{l.pazarlik ? " · Pazarlıkla anlaşıldı" : ""}</div>
                <div className="price num" style={{ fontSize: 16 }}>{tl(l.fiyat * l.adet)}</div>
              </div>
              {!l.pazarlik && <button className="icon-btn" aria-label="Sepetten çıkar" onClick={() => removeFromCart(l.p.kod, l.v.olcu)}><Icon name="x" size={18} /></button>}
            </div>
          ))}
        </div>
        <label className="toggle"><input type="checkbox" id="hediye" checked={hediye} onChange={(e) => setHediye(e.target.checked)} /> <Icon name="gift" size={20} /> Hediye olarak gönder</label>
        {hediye && (
          <div className="panel" style={{ padding: 16, display: "grid", gap: 10 }}>
            <div className="field"><label htmlFor="alici">Alıcının adı</label><input id="alici" /></div>
            <div className="field"><label htmlFor="alici-tel">Alıcının telefonu</label><input id="alici-tel" inputMode="tel" /></div>
            <div className="field"><label htmlFor="not">Hediye notu</label><textarea id="not" placeholder="Nice yıllara…" /></div>
            <label className="toggle" style={{ border: 0, padding: 0 }}><input type="checkbox" id="fiyatsiz" checked={fiyatsiz} onChange={(e) => setFiyatsiz(e.target.checked)} /> Paketin içinde fiyat bilgisi olmasın · fatura bana gelsin</label>
          </div>
        )}
      </div>
      <div className="panel sum">
        <div className="r"><span>Ara toplam</span><span className="num">{tl(ara)}</span></div>
        <div className="r"><span>Sigortalı teslimat</span><span>Adrese göre</span></div>
        <div className="r"><span>Altın Lira</span><span className="pend">Yakında</span></div>
        <div className="r t"><span>Toplam</span><span className="num">{tl(ara)}</span></div>
        <button className="btn btn-primary btn-block" onClick={() => setGonder(true)}>Güvenli ödemeye geç <Icon name="lock" size={18} /></button>
        <p className="note" style={{ margin: 0 }}>Ödeme öncesi ön bilgilendirme formu ve mesafeli satış sözleşmesi gösterilecek. Tutarlar örnektir.</p>
      </div>
    </div>
  );
}
