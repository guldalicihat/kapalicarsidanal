"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { useStore } from "@/lib/useStore";
import { ORNEK_HAS_ALTIN_KURUS, tl } from "@/lib/pricing";
import { useProducts } from "./CatalogProvider";

export function PreviewStrip() {
  const has = useProducts()[0]?.hasKurus ?? ORNEK_HAS_ALTIN_KURUS;
  return (
    <div className="preview-strip">
      <div className="shell">
        <span><b>Tasarım önizlemesi</b><span className="hide-sm"> · Ürünler ve fiyatlar örnektir, satış yapılmaz</span></span>
        <span className="gold-price num">Has altın: {tl(has, true)}/g</span>
      </div>
    </div>
  );
}

export function TopBar() {
  const { cartCount, fav } = useStore();
  return (
    <header className="topbar">
      <div className="shell">
        <Link href="/" className="logo" aria-label="Kapalıçarşıdan Al ana sayfa">
          <span className="mark">Kapalıçarşıdan Al</span>
          <span className="sub">Altın · Pırlanta</span>
        </Link>
        <nav className="desk-nav" aria-label="Kategoriler">
          <Link href="/kategori/yuzuk">Yüzükçüler</Link>
          <Link href="/kategori/bileklik">Bileklikçiler</Link>
          <Link href="/kategori/kolye">Kolyeciler</Link>
          <Link href="/kategori/kupe">Küpeciler</Link>
          <Link href="/kategori/pirlanta">Pırlantacılar</Link>
        </nav>
        <span className="spacer" />
        <form className="search" action="/ara" role="search">
          <Icon name="search" size={18} />
          <input name="q" placeholder="Hangi takıyı arıyorsun?" aria-label="Takı ara" />
        </form>
        <Link href="/favoriler" className="icon-btn" aria-label="Favoriler">
          <Icon name="heart" />{fav.length > 0 && <span className="badge">{fav.length}</span>}
        </Link>
        <Link href="/sepet" className="icon-btn" aria-label="Sepet">
          <Icon name="cart" />{cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>
      </div>
      <div className="cini-serit" aria-hidden="true" />
    </header>
  );
}

const TABS = [
  { href: "/", ad: "Ana Sayfa", icon: "home" },
  { href: "/kategori/yuzuk", ad: "Takılar", icon: "gem", match: "/kategori" },
  { href: "/pazarlik", ad: "Pazarlık", icon: "hand" },
  { href: "/siparislerim", ad: "Siparişlerim", icon: "box" },
  { href: "/hesabim", ad: "Hesabım", icon: "user" },
];

export function BottomBar() {
  const path = usePathname();
  return (
    <div className="bottombar">
      <nav aria-label="Ana menü">
        {TABS.map((t) => {
          const on = t.href === "/" ? path === "/" : path.startsWith(t.match ?? t.href);
          return (
            <Link key={t.href} href={t.href} className={on ? "on" : ""} aria-current={on ? "page" : undefined}>
              <Icon name={t.icon} size={22} />
              {t.ad}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
