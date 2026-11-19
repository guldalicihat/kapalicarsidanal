"use client";
import Link from "next/link";
import JewelryArt from "./JewelryArt";
import Icon from "./Icon";
import DealTimer from "./DealTimer";
import { useStore } from "@/lib/useStore";
import { defaultVariant, firsatPrice, variantPrice, type Product } from "@/lib/catalog";
import { gram, tl } from "@/lib/pricing";

export default function ProductCard({ p }: { p: Product }) {
  const { fav, toggleFav } = useStore();
  const v = defaultVariant(p);
  const normal = variantPrice(p, v);
  const firsat = firsatPrice(p, v);
  const on = fav.includes(p.kod);
  return (
    <article className="card">
      <Link href={`/urun/${p.kod}`} aria-label={p.ad}>
        <div className="art"><JewelryArt art={p.art} tone={p.renk} id={`c${p.kod}`} size="82%" /></div>
      </Link>
      {firsat ? <span className="tag tag-sale">Süreli fırsat</span>
        : p.yeni ? <span className="tag tag-new">Yeni</span>
        : p.ustaSecimi ? <span className="tag tag-usta">Ustanın seçimi</span> : null}
      <button className={`fav${on ? " on" : ""}`} onClick={() => toggleFav(p.kod)} aria-pressed={on} aria-label={on ? "Favorilerden çıkar" : "Favorilere ekle"}>
        <Icon name="heart" size={18} />
      </button>
      <Link href={`/urun/${p.kod}`} className="body">
        <span className="name">{p.ad}</span>
        <span className="spec">{p.ayar} ayar · {p.milyem} · {gram(v.netMg)}{p.pirlanta ? ` · ${p.pirlanta.karat}` : ""}</span>
        <span className="price-row">
          <span className="price num">{tl((firsat ?? normal).toplamKurus)}</span>
          {firsat && <span className="price-old num">{tl(normal.toplamKurus)}</span>}
        </span>
        {firsat && <span className="card-timer"><DealTimer label="Bitiyor" bitis={p.firsat?.bitis} /></span>}
      </Link>
    </article>
  );
}
