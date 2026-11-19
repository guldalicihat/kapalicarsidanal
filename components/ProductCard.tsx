"use client";
import Link from "next/link";
import JewelryArt from "./JewelryArt";
import Icon from "./Icon";
import DealTimer from "./DealTimer";
import Stars from "./Stars";
import { useStore } from "@/lib/useStore";
import { defaultVariant, firsatPrice, variantPrice, type Product } from "@/lib/catalog";
import { gram, tl } from "@/lib/pricing";

const ilkCumle = (t: string) => (t.match(/^.*?[.!?](\s|$)/)?.[0] ?? t).trim();

export default function ProductCard({ p, usta }: { p: Product; usta?: boolean }) {
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
        : p.ustaSecimi ? <span className="tag tag-usta"><img src="/cevat/portre.jpg" alt="" />Ustanın seçimi</span> : null}
      <button className={`fav${on ? " on" : ""}`} onClick={() => toggleFav(p.kod)} aria-pressed={on} aria-label={on ? "Favorilerden çıkar" : "Favorilere ekle"}>
        <Icon name="heart" size={18} />
      </button>
      <Link href={`/urun/${p.kod}`} className="body">
        <span className="name">{p.ad}</span>
        {(p.yorumSayisi || p.begeni) ? (
          <span className="card-social">
            {p.yorumSayisi ? <><Stars deger={p.puan ?? 0} size={12} /><span className="num">{(p.puan ?? 0).toLocaleString("tr-TR")} ({p.yorumSayisi})</span></> : null}
            {p.begeni ? <span className="likes"><Icon name="heart" size={12} />{p.begeni}</span> : null}
          </span>
        ) : null}
        <span className="spec">{p.ayar} ayar · {p.milyem} · {gram(v.netMg)}{p.pirlanta ? ` · ${p.pirlanta.karat}` : ""}</span>
        {usta && p.ustaNotu && (
          <span className="card-usta"><img src="/cevat/portre.jpg" alt="" /><span>“{ilkCumle(p.ustaNotu)}”</span></span>
        )}
        <span className="price-row">
          <span className="price num">{tl((firsat ?? normal).toplamKurus)}</span>
          {firsat && <span className="price-old num">{tl(normal.toplamKurus)}</span>}
        </span>
        {firsat && <span className="card-timer"><DealTimer label="Bitiyor" bitis={p.firsat?.bitis} /></span>}
      </Link>
    </article>
  );
}
