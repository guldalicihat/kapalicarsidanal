"use client";
import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import Icon from "./Icon";
import { defaultVariant, firsatPrice, variantPrice, type Product } from "@/lib/catalog";

type Sort = "onerilen" | "artan" | "azalan" | "yeni" | "gram" | "begeni";
const SORTS: Record<Sort, string> = { onerilen: "Önerilen", artan: "Fiyat: artan", azalan: "Fiyat: azalan", yeni: "En yeniler", gram: "Gram: hafiften ağıra", begeni: "En çok beğenilen" };

const fiyat = (p: Product) => { const v = defaultVariant(p); return (firsatPrice(p, v) ?? variantPrice(p, v)).toplamKurus; };

export default function Listing({ products, title, initialFirsat = false }: { products: Product[]; title: string; initialFirsat?: boolean }) {
  const [sort, setSort] = useState<Sort>("onerilen");
  const [ayar, setAyar] = useState<number | null>(null);
  const [renk, setRenk] = useState<string | null>(null);
  const [stokta, setStokta] = useState(false);
  const [firsat, setFirsat] = useState(initialFirsat);
  const [olcu, setOlcu] = useState<string | null>(null);

  const ayarlar = [...new Set(products.map((p) => p.ayar))];
  const renkler = [...new Set(products.map((p) => p.renk))];
  const olculer = [...new Set(products.flatMap((p) => p.varyantlar.map((v) => v.olcu)))].filter((o) => o !== "Tek ölçü");

  const list = useMemo(() => {
    let l = products.filter((p) =>
      (ayar === null || p.ayar === ayar) &&
      (renk === null || p.renk === renk) &&
      (!firsat || !!p.firsat) &&
      (olcu === null || p.varyantlar.some((v) => v.olcu === olcu && v.stok !== "yok")) &&
      (!stokta || p.varyantlar.some((v) => v.stok === "kendi")));
    if (sort === "artan") l = [...l].sort((a, b) => fiyat(a) - fiyat(b));
    if (sort === "azalan") l = [...l].sort((a, b) => fiyat(b) - fiyat(a));
    if (sort === "yeni") l = [...l].sort((a, b) => Number(!!b.yeni) - Number(!!a.yeni));
    if (sort === "begeni") l = [...l].sort((a, b) => (b.begeni ?? 0) - (a.begeni ?? 0) || (b.puan ?? 0) - (a.puan ?? 0));
    if (sort === "gram") l = [...l].sort((a, b) => defaultVariant(a).netMg - defaultVariant(b).netMg);
    return l;
  }, [products, ayar, renk, firsat, olcu, stokta, sort]);

  const aktif: [string, () => void][] = [];
  if (ayar !== null) aktif.push([`${ayar} ayar`, () => setAyar(null)]);
  if (renk) aktif.push([renk, () => setRenk(null)]);
  if (olcu) aktif.push([`Ölçü ${olcu}`, () => setOlcu(null)]);
  if (stokta) aktif.push(["Hemen gönderilir", () => setStokta(false)]);
  if (firsat) aktif.push(["Fırsattakiler", () => setFirsat(false)]);

  return (
    <>
      <div className="list-head">
        <div><h1>{title}</h1><span className="count">{list.length} model</span></div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--ink-2)" }}>
          Sırala
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value as Sort)} id="siralama">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </div>
      <div className="chips" role="group" aria-label="Filtreler" style={{ marginBottom: 10 }}>
        {ayarlar.length > 1 && ayarlar.map((a) => <button key={a} className={`chip${ayar === a ? " on" : ""}`} onClick={() => setAyar(ayar === a ? null : a)}>{a} ayar</button>)}
        {renkler.map((r) => <button key={r} className={`chip${renk === r ? " on" : ""}`} onClick={() => setRenk(renk === r ? null : r)}>{r}</button>)}
        <button className={`chip${stokta ? " on" : ""}`} onClick={() => setStokta(!stokta)}>Hemen gönderilir</button>
        <button className={`chip${firsat ? " on" : ""}`} onClick={() => setFirsat(!firsat)}>Fırsattakiler</button>
        {olculer.length > 0 && (
          <select className="select" style={{ height: 36, borderRadius: 999 }} value={olcu ?? ""} onChange={(e) => setOlcu(e.target.value || null)} aria-label="Ölçü" id="olcu-filtre">
            <option value="">Ölçü</option>
            {olculer.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )}
      </div>
      {aktif.length > 0 && (
        <div className="active-filters">
          {aktif.map(([t, f]) => <button key={t} onClick={f}>{t} <Icon name="x" size={14} /></button>)}
          <button onClick={() => { setAyar(null); setRenk(null); setOlcu(null); setStokta(false); setFirsat(false); }} style={{ background: "transparent", textDecoration: "underline" }}>Tümünü temizle</button>
        </div>
      )}
      {list.length ? (
        <div className="grid">{list.map((p) => <ProductCard key={p.kod} p={p} />)}</div>
      ) : (
        <div className="empty">
          <img src="/cevat/isinin-ehli.jpg" alt="" />
          <p>Bu filtrelere uyan takı şu an yok. Filtreleri gevşetmeyi dene ya da WhatsApp'tan sor, toptancılarımızda arayalım.</p>
        </div>
      )}
      <p className="demo-note">Tasarım örneği · Fiyatlar temsilidir</p>
    </>
  );
}
