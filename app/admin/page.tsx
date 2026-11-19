import Link from "next/link";
import AdminTop from "./AdminTop";
import { setGoldPrice } from "./actions";
import { tl } from "@/lib/pricing";
import { requireAdmin } from "@/lib/admin";
import { serviceClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type R = { kod: string; ad: string; kategori: string; ayar: number; yayinda: boolean; firsat_iscilik_indirim: number | null; gorseller: string[]; guncelleme: string; varyantlar: { kendi_stok: number; tedarikci_stok_teyitli: boolean }[] };

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ kaydedildi?: string; k?: string; altin?: string; hata?: string }> }) {
  const admin = await requireAdmin();
  const sp = await searchParams;
  let q = serviceClient().from("urunler").select("kod,ad,kategori,ayar,yayinda,firsat_iscilik_indirim,gorseller,guncelleme,varyantlar(kendi_stok,tedarikci_stok_teyitli)").order("guncelleme", { ascending: false });
  if (sp.k) q = q.eq("kategori", sp.k);
  const { data, error } = await q;
  const rows = (data ?? []) as R[];
  const { data: altin } = await serviceClient().from("altin_fiyatlari").select("kaynak,has_satis_kurus,zaman").order("zaman", { ascending: false }).limit(1).maybeSingle();
  const kat = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.ad]));
  return (
    <>
      <AdminTop eposta={admin.eposta} />
      <div className="adm-main">
        {sp.kaydedildi && <div className="notice ok">{sp.kaydedildi} kaydedildi. Site bir dakika içinde güncellenir.</div>}
        {sp.altin && <div className="notice ok">Altın fiyatı güncellendi; bütün ürün fiyatları yeniden hesaplanıyor.</div>}
        {sp.hata === "altin" && <div className="notice err">Altın fiyatı geçersiz. Örnek: 6150</div>}
        <form action={setGoldPrice} className="adm-card" style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ flex: "1 1 220px" }}>
            <div style={{ fontWeight: 600 }}>Has altın satış fiyatı</div>
            <div className="note">Şu an: {altin ? `${tl(altin.has_satis_kurus, true)}/g · ${altin.kaynak} · ${new Date(altin.zaman).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}` : "yok"}. Harem Altın bağlantısı kurulana kadar elle girilir.</div>
          </div>
          <label className="f" style={{ flex: "0 1 160px" }}>Yeni fiyat (TL/g)<input name="has" inputMode="decimal" placeholder="6150" required /></label>
          <button className="btn btn-primary">Güncelle</button>
        </form>
        {error && <div className="notice err">Ürünler okunamadı: {error.message}</div>}
        <div className="adm-head">
          <div><h1>Ürünler</h1><span className="note">{rows.length} ürün · {rows.filter((r) => r.yayinda).length} yayında</span></div>
          <Link href="/admin/urun/yeni" className="btn btn-primary">+ Yeni ürün</Link>
        </div>
        <div className="chips" style={{ marginBottom: 12 }}>
          <Link href="/admin" className={`chip${!sp.k ? " on" : ""}`}>Tümü</Link>
          {CATEGORIES.map((c) => <Link key={c.slug} href={`/admin?k=${c.slug}`} className={`chip${sp.k === c.slug ? " on" : ""}`}>{c.ad}</Link>)}
        </div>
        <div className="adm-list">
          {rows.map((r) => {
            const kendi = r.varyantlar.reduce((s, v) => s + v.kendi_stok, 0);
            const ted = r.varyantlar.filter((v) => v.tedarikci_stok_teyitli).length;
            return (
              <Link key={r.kod} href={`/admin/urun/${r.kod}`} className="adm-item">
                <span className="thumb">{r.gorseller?.[0] ? <img src={r.gorseller[0]} alt="" /> : <span>foto<br />yok</span>}</span>
                <span className="body">
                  <span className="t">{r.ad}</span>
                  <span className="note">{r.kod} · {kat[r.kategori] ?? r.kategori} · {r.ayar} ayar</span>
                  <span className="meta">
                    <span className={`pill ${r.yayinda ? "on" : "off"}`}>{r.yayinda ? "Yayında" : "Taslak"}</span>
                    {r.firsat_iscilik_indirim ? <span className="pill warn">Fırsat</span> : null}
                    <span className="note">{kendi} adet{ted ? ` · ${ted} ölçü atölyede` : ""}</span>
                    {!kendi && !ted ? <span className="pill warn">stok yok</span> : null}
                  </span>
                </span>
                <span className="go">Düzenle ›</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
