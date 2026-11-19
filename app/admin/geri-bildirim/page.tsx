import Link from "next/link";
import AdminTop from "../AdminTop";
import { geriBildirimDurum } from "../actions";
import { requireAdmin } from "@/lib/admin";
import { serviceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const KONU: Record<string, string> = { tasarim: "Tasarım", hata: "Hata", fiyat: "Fiyat", pazarlik: "Pazarlık", oneri: "Öneri", diger: "Diğer" };
const DURUM: Record<string, string> = { yeni: "Yeni", okundu: "Okundu", yapildi: "Yapıldı" };
type G = { id: number; konu: string; puan: number | null; metin: string; ad: string | null; iletisim: string | null; sayfa: string | null; cihaz_bilgi: string | null; cihaz: string; durum: string; olusturma: string };

const cihazOzet = (ua: string | null) => !ua ? "" : /iPhone|iPad/.test(ua) ? "iPhone/iPad" : /Android/.test(ua) ? "Android" : /Mac/.test(ua) ? "Mac" : /Windows/.test(ua) ? "Windows" : "Diğer";

export default async function GeriBildirim({ searchParams }: { searchParams: Promise<{ d?: string; k?: string }> }) {
  const admin = await requireAdmin();
  const { d = "acik", k } = await searchParams;
  let q = serviceClient().from("geri_bildirimler").select("*").order("olusturma", { ascending: false }).limit(300);
  if (d === "acik") q = q.neq("durum", "yapildi");
  if (k) q = q.eq("konu", k);
  const { data, error } = await q;
  const rows = (data ?? []) as G[];
  const { data: tum } = await serviceClient().from("geri_bildirimler").select("puan,cihaz,durum");
  const hepsi = (tum ?? []) as { puan: number | null; cihaz: string; durum: string }[];
  const puanlar = hepsi.map((x) => x.puan).filter((x): x is number => !!x);
  const ort = puanlar.length ? (puanlar.reduce((a, b) => a + b, 0) / puanlar.length).toLocaleString("tr-TR", { maximumFractionDigits: 1 }) : "—";
  return (
    <>
      <AdminTop eposta={admin.eposta} />
      <div className="adm-main">
        <div className="adm-head"><div><h1>Test kullanıcılarından geri bildirim</h1>
          <span className="note">{hepsi.length} bildirim · {new Set(hepsi.map((x) => x.cihaz)).size} farklı kişi/cihaz · {hepsi.filter((x) => x.durum === "yeni").length} yeni · ortalama site puanı {ort}</span></div></div>
        <div className="chips" style={{ marginBottom: 8 }}>
          {[["acik", "Açık olanlar"], ["hepsi", "Hepsi"]].map(([x, a]) => <Link key={x} href={`/admin/geri-bildirim?d=${x}${k ? `&k=${k}` : ""}`} className={`chip${d === x ? " on" : ""}`}>{a}</Link>)}
        </div>
        <div className="chips" style={{ marginBottom: 12 }}>
          <Link href={`/admin/geri-bildirim?d=${d}`} className={`chip${!k ? " on" : ""}`}>Tüm konular</Link>
          {Object.entries(KONU).map(([x, a]) => <Link key={x} href={`/admin/geri-bildirim?d=${d}&k=${x}`} className={`chip${k === x ? " on" : ""}`}>{a}</Link>)}
        </div>
        {error && <div className="notice err">Bildirimler okunamadı: {error.message}</div>}
        {!rows.length && <div className="adm-card note">Henüz bildirim yok. Test kullanıcıları sitedeki “Geri bildirim” düğmesiyle yazar.</div>}
        <div className="adm-list">
          {rows.map((g) => (
            <div key={g.id} className="adm-card" style={{ display: "grid", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <b>{KONU[g.konu] ?? g.konu}{g.puan ? ` · ${"★".repeat(g.puan)}` : ""}</b>
                <span className={`pill ${g.durum === "yeni" ? "warn" : g.durum === "yapildi" ? "on" : "off"}`}>{DURUM[g.durum]}</span>
              </div>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{g.metin}</p>
              <span className="note">
                {g.ad || "İsimsiz"}{g.iletisim ? ` · ${g.iletisim}` : ""} · {new Date(g.olusturma).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}
                {g.sayfa ? <> · sayfa <Link href={g.sayfa} target="_blank">{g.sayfa} ↗</Link></> : null}
                {g.cihaz_bilgi ? ` · ${cihazOzet(g.cihaz_bilgi)}` : ""}
              </span>
              <form action={geriBildirimDurum} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input type="hidden" name="id" value={g.id} />
                {Object.entries(DURUM).filter(([x]) => x !== g.durum).map(([x, a]) => <button key={x} className="btn btn-ghost btn-sm" name="durum" value={x}>{a} olarak işaretle</button>)}
              </form>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
