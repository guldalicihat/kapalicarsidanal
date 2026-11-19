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
        <div className="adm-card adm-tbl-wrap" style={{ padding: 0 }}>
          <table className="adm-table">
            <thead><tr><th></th><th>Kod</th><th>Ürün</th><th>Kategori</th><th>Stok</th><th>Durum</th><th></th></tr></thead>
            <tbody>
              {rows.map((r) => {
                const kendi = r.varyantlar.reduce((s, v) => s + v.kendi_stok, 0);
                const ted = r.varyantlar.filter((v) => v.tedarikci_stok_teyitli).length;
                return (
                  <tr key={r.kod}>
                    <td style={{ width: 52 }}>{r.gorseller?.[0] ? <img src={r.gorseller[0]} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} /> : <span className="pill off">foto yok</span>}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{r.kod}</td>
                    <td>{r.ad}<div className="note">{r.ayar} ayar{r.firsat_iscilik_indirim ? ` · İşçilik −%${r.firsat_iscilik_indirim}` : ""}</div></td>
                    <td>{kat[r.kategori] ?? r.kategori}</td>
                    <td className="num">{kendi} adet{ted ? <div className="note">{ted} ölçü atölyede</div> : null}{!kendi && !ted ? <div><span className="pill warn">stok yok</span></div> : null}</td>
                    <td><span className={`pill ${r.yayinda ? "on" : "off"}`}>{r.yayinda ? "Yayında" : "Taslak"}</span></td>
                    <td><Link href={`/admin/urun/${r.kod}`} className="btn btn-ghost btn-sm">Düzenle</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
