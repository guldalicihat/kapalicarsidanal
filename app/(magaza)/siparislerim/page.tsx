import Link from "next/link";
import JewelryArt from "@/components/JewelryArt";
import Icon from "@/components/Icon";
import { variantPrice } from "@/lib/catalog";
import { getCatalog } from "@/lib/db";
import { gram, tl } from "@/lib/pricing";

const ADIMLAR = [
  { ad: "Sipariş alındı", saat: "09:12", durum: "ok" },
  { ad: "Ödeme bankadan doğrulandı", saat: "09:13", durum: "ok" },
  { ad: "Tartım, ayar kontrolü ve paketleme", saat: "10:03", durum: "ok" },
  { ad: "Kuryeye teslim edildi", saat: "11:26", durum: "ok" },
  { ad: "Dağıtımda", saat: "12:10", durum: "now" },
  { ad: "Teslim edildi", saat: "", durum: "todo" },
];

export default async function Siparislerim() {
  const { products } = await getCatalog();
  const p = products.find((x) => x.kod === "KA-Y014") ?? products[0];
  const v = p.varyantlar.find((x) => x.olcu === "16") ?? p.varyantlar[0];
  return (
    <div className="shell" style={{ maxWidth: 760 }}>
      <h1 className="page-title">Sipariş takibi</h1>
      <div className="status-hero">
        <Icon name="truck" size={40} stroke="#f1dca7" />
        <div><h2>Siparişin dağıtımda</h2><p>Tahmini teslimat: bugün 14:00–17:00 · Örnek teslimat bilgisi</p></div>
      </div>
      <div className="panel line" style={{ marginTop: 14 }}>
        <div className="thumb"><JewelryArt art={p.art} tone={p.renk} id="sip" size="86%" /></div>
        <div className="info">
          <b>{p.ad}</b>
          <div className="note">Ölçü {v.olcu} · {gram(v.netMg)} · Sipariş KA-1048</div>
          <div className="price num" style={{ fontSize: 17 }}>{tl(variantPrice(p, v).toplamKurus)}</div>
        </div>
      </div>
      <div className="panel" style={{ padding: "8px 20px", marginTop: 14 }}>
        <ol className="timeline">
          {ADIMLAR.map((a) => (
            <li key={a.ad} className={a.durum === "now" ? "now" : a.durum === "todo" ? "todo" : ""}>
              <span className="c">{a.durum === "now" ? <Icon name="truck" size={18} /> : <Icon name="check" size={18} />}</span>
              <span style={{ fontWeight: a.durum === "todo" ? 500 : 600, color: a.durum === "todo" ? "var(--ink-3)" : "var(--ink)" }}>{a.ad}</span>
              <span className="note num">{a.saat}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="panel" style={{ padding: 16, marginTop: 14, display: "flex", gap: 12 }}>
        <Icon name="pin" stroke="var(--emerald)" />
        <div><b>Teslimat adresi</b><div className="note">A*** K. · Kadıköy / İstanbul</div>
          <div className="note" style={{ marginTop: 6 }}><Icon name="lock" size={14} /> Teslim kodunu yalnız kurye kapıdayken paylaş.</div></div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button className="btn btn-primary" style={{ flex: 1 }}>Kargo hareketleri</button>
        <Link href="/hesabim" className="btn btn-outline" style={{ flex: 1 }}>Destek al</Link>
      </div>
      <div className="usta" style={{ marginTop: 20 }}>
        <img className="avatar" src="/cevat/hazirlar.jpg" alt="" />
        <div className="bubble">Takın yolda, özenle paketledik. Buradan takip edebilirsin.<small>— Cevat Usta</small></div>
      </div>
      <p className="demo-note">Tasarım örneği · Sipariş ve teslimat bilgileri temsilidir</p>
    </div>
  );
}
