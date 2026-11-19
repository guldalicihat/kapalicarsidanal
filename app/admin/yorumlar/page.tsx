import Link from "next/link";
import AdminTop from "../AdminTop";
import { yorumIslem } from "../actions";
import { requireAdmin } from "@/lib/admin";
import { serviceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Y = { id: number; urun_kod: string; puan: number; ad: string; metin: string; onayli: boolean; olusturma: string; urunler: { ad: string } | null };

export default async function Yorumlar({ searchParams }: { searchParams: Promise<{ d?: string }> }) {
  const admin = await requireAdmin();
  const { d = "bekleyen" } = await searchParams;
  let q = serviceClient().from("yorumlar").select("id,urun_kod,puan,ad,metin,onayli,olusturma,urunler(ad)").order("olusturma", { ascending: false }).limit(200);
  if (d === "bekleyen") q = q.eq("onayli", false);
  if (d === "yayinda") q = q.eq("onayli", true);
  const { data, error } = await q;
  const rows = (data ?? []) as unknown as Y[];
  const { count: bekleyen } = await serviceClient().from("yorumlar").select("*", { count: "exact", head: true }).eq("onayli", false);
  return (
    <>
      <AdminTop eposta={admin.eposta} />
      <div className="adm-main">
        <div className="adm-head"><div><h1>Yorumlar</h1><span className="note">{bekleyen ?? 0} yorum onay bekliyor. Onaylanan yorum bir dakika içinde ürün sayfasında görünür.</span></div></div>
        <div className="chips" style={{ marginBottom: 12 }}>
          {[["bekleyen", "Onay bekleyen"], ["yayinda", "Yayında"], ["hepsi", "Hepsi"]].map(([k, a]) => <Link key={k} href={`/admin/yorumlar?d=${k}`} className={`chip${d === k ? " on" : ""}`}>{a}</Link>)}
        </div>
        {error && <div className="notice err">Yorumlar okunamadı: {error.message}</div>}
        {!rows.length && <div className="adm-card note">Bu listede yorum yok.</div>}
        <div className="adm-list">
          {rows.map((y) => (
            <div key={y.id} className="adm-card" style={{ display: "grid", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <b>{"★".repeat(y.puan)}<span style={{ color: "#ddd" }}>{"★".repeat(5 - y.puan)}</span> · {y.ad}</b>
                <span className={`pill ${y.onayli ? "on" : "warn"}`}>{y.onayli ? "Yayında" : "Onay bekliyor"}</span>
              </div>
              <span className="note"><Link href={`/urun/${y.urun_kod}`} target="_blank">{y.urunler?.ad ?? y.urun_kod} ({y.urun_kod}) ↗</Link> · {new Date(y.olusturma).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</span>
              {y.metin ? <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{y.metin}</p> : <span className="note">(yalnız puan)</span>}
              <form action={yorumIslem} style={{ display: "flex", gap: 8 }}>
                <input type="hidden" name="id" value={y.id} />
                {y.onayli
                  ? <button className="btn btn-outline btn-sm" name="islem" value="gizle">Yayından kaldır</button>
                  : <button className="btn btn-primary btn-sm" name="islem" value="onayla">Onayla, yayınla</button>}
                <button className="btn btn-ghost btn-sm" name="islem" value="sil">Sil</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
