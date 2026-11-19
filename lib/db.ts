// Katalog verisini Supabase'den okur (sunucu tarafı). Bağlantı yoksa ya da hata olursa
// örnek kataloğa düşer; böylece önizleme hiçbir zaman boş sayfa göstermez.
import "server-only";
import { CATEGORIES, PRODUCTS, type Art, type CategorySlug, type Product, type Stok } from "./catalog";

export type Catalog = { categories: typeof CATEGORIES; products: Product[]; kaynak: "veritabani" | "ornek" };

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

type Row = {
  kod: string; tedarikci_kod: string | null; ad: string; kategori: CategorySlug; ayar: 14 | 22; milyem: number;
  renk: Product["renk"]; iscilik_milyem: number; olcu_turu: Product["olcuTuru"]; aciklama: string | null;
  usta_notu: string | null; pirlanta: Product["pirlanta"] | null; firsat_iscilik_indirim: number | null; firsat_bitis: string | null;
  yeni: boolean; usta_secimi: boolean;
  varyantlar: { olcu: string; net_mg: number; kendi_stok: number; tedarikci_stok_teyitli: boolean }[];
};

const ART: Record<string, Art> = Object.fromEntries(PRODUCTS.map((p) => [p.kod, p.art]));
const KAT_ART: Record<CategorySlug, Art> = { yuzuk: "burgu", bilezik: "bilezik", bileklik: "bileklik", kolye: "kolye", kupe: "kupe", pirlanta: "tektas" };

const stok = (v: Row["varyantlar"][number]): Stok => (v.kendi_stok > 0 ? "kendi" : v.tedarikci_stok_teyitli ? "tedarikci" : "yok");

function toProduct(r: Row): Product {
  return {
    kod: r.kod, tedarikciKod: r.tedarikci_kod ?? "", ad: r.ad, kategori: r.kategori,
    art: ART[r.kod] ?? KAT_ART[r.kategori], ayar: r.ayar, milyem: r.milyem, renk: r.renk,
    iscilikMilyem: r.iscilik_milyem, olcuTuru: r.olcu_turu, aciklama: r.aciklama ?? "", ustaNotu: r.usta_notu ?? "",
    pirlanta: r.pirlanta ?? undefined,
    firsat: r.firsat_iscilik_indirim && (!r.firsat_bitis || Date.parse(r.firsat_bitis) > Date.now())
      ? { iscilikIndirimYuzde: r.firsat_iscilik_indirim, bitis: r.firsat_bitis ?? undefined } : undefined,
    yeni: r.yeni, ustaSecimi: r.usta_secimi,
    varyantlar: [...r.varyantlar].sort((a, b) => a.net_mg - b.net_mg).map((v) => ({ olcu: v.olcu, netMg: v.net_mg, stok: stok(v) })),
  };
}

export async function getCatalog(): Promise<Catalog> {
  if (!URL_ || !KEY) return { categories: CATEGORIES, products: PRODUCTS, kaynak: "ornek" };
  try {
    const res = await fetch(`${URL_}/rest/v1/urunler?select=*,varyantlar(olcu,net_mg,kendi_stok,tedarikci_stok_teyitli)&yayinda=eq.true&order=kod`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = (await res.json()) as Row[];
    if (!rows.length) return { categories: CATEGORIES, products: PRODUCTS, kaynak: "ornek" };
    const a = await fetch(`${URL_}/rest/v1/altin_fiyatlari?select=has_satis_kurus,zaman&order=zaman.desc&limit=1`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }, next: { revalidate: 60 },
    });
    const altin = a.ok ? ((await a.json()) as { has_satis_kurus: number; zaman: string }[])[0] : undefined;
    const ilgi = await getIlgi();
    const products = rows.map((r) => ({ ...toProduct(r), hasKurus: altin?.has_satis_kurus, fiyatZamani: altin?.zaman, ...ilgi[r.kod] }));
    return { categories: CATEGORIES, products, kaynak: "veritabani" };
  } catch (e) {
    console.error("[katalog] veritabanı okunamadı, örnek katalog kullanılıyor:", e instanceof Error ? e.message : e);
    return { categories: CATEGORIES, products: PRODUCTS, kaynak: "ornek" };
  }
}

type Ilgi = { begeni: number; yorumSayisi: number; puan?: number };

/** Beğeni ve onaylı yorum sayıları — gerçek kayıtlardan; yoksa boş. */
async function getIlgi(): Promise<Record<string, Ilgi>> {
  const gizli = process.env.SUPABASE_SECRET_KEY;
  if (!URL_ || !gizli) return {};
  try {
    const r = await fetch(`${URL_}/rest/v1/urun_ilgi?select=kod,begeni,yorum,puan`, {
      headers: { apikey: gizli, Authorization: `Bearer ${gizli}` }, next: { revalidate: 60, tags: ["ilgi"] },
    });
    if (!r.ok) return {};
    const rows = (await r.json()) as { kod: string; begeni: number; yorum: number; puan: number | null }[];
    return Object.fromEntries(rows.map((x) => [x.kod, { begeni: x.begeni, yorumSayisi: x.yorum, puan: x.puan ?? undefined }]));
  } catch { return {}; }
}

export type Yorum = { id: number; ad: string; puan: number; metin: string; olusturma: string };

/** Ürünün onaylı yorumları (en yeni üstte). */
export async function getYorumlar(kod: string): Promise<Yorum[]> {
  const gizli = process.env.SUPABASE_SECRET_KEY;
  if (!URL_ || !gizli || !/^[A-Z0-9-]{3,20}$/.test(kod)) return [];
  try {
    const r = await fetch(`${URL_}/rest/v1/yorumlar?select=id,ad,puan,metin,olusturma&urun_kod=eq.${kod}&onayli=eq.true&order=olusturma.desc&limit=50`, {
      headers: { apikey: gizli, Authorization: `Bearer ${gizli}` }, next: { revalidate: 60, tags: ["ilgi"] },
    });
    return r.ok ? ((await r.json()) as Yorum[]) : [];
  } catch { return []; }
}
