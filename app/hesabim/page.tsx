import Link from "next/link";
import Icon from "@/components/Icon";

const MENU = [
  { icon: "box", ad: "Siparişlerim", href: "/siparislerim" },
  { icon: "hand", ad: "Tekliflerim", href: "/pazarlik" },
  { icon: "heart", ad: "Favorilerim", href: "/favoriler" },
  { icon: "pin", ad: "Adreslerim", href: "#" },
  { icon: "chat", ad: "Destek ve iade talepleri", href: "#" },
  { icon: "lock", ad: "Bildirim ve ileti izinleri", href: "#" },
];

export default function Hesabim() {
  return (
    <div className="shell" style={{ maxWidth: 760 }}>
      <h1 className="page-title">Hesabım</h1>
      <div className="panel" style={{ padding: 18, display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ width: 54, height: 54, borderRadius: 999, background: "var(--emerald-tint)", display: "grid", placeItems: "center", color: "var(--emerald)" }}><Icon name="user" size={28} /></div>
        <div><b style={{ fontFamily: "var(--serif)", fontSize: 18 }}>Örnek Müşteri</b><div className="note">Tasarım önizlemesi · giriş sistemi henüz yok</div></div>
      </div>

      <section className="section panel" style={{ padding: 18 }}>
        <div className="row-between"><h2 style={{ fontSize: 20, color: "var(--emerald-2)" }}>Altın Lira</h2><span className="soon">Yakında</span></div>
        <p className="note">Kazanılan, bekleyen, harcanan ve geri alınan hareketler ayrı görünecek. Oranlar ve şartlar kesinleşmedi; aşağıdaki satırlar örnektir.</p>
        <table className="ledger" style={{ width: "100%", borderCollapse: "collapse" }}><tbody>
          <tr><td>Sipariş KA-1048 · teslim sonrası kullanılabilir</td><td className="pend">+ bekliyor</td></tr>
          <tr><td>Hoş geldin kampanyası (örnek)</td><td className="pos">+ kazanıldı</td></tr>
          <tr><td>Sipariş KA-0991 · kullanıldı</td><td className="neg">− harcandı</td></tr>
        </tbody></table>
      </section>

      <section className="section panel">
        {MENU.map((m) => (
          <Link key={m.ad} href={m.href} className="line" style={{ display: "flex" }}>
            <Icon name={m.icon} /><span style={{ flex: 1 }}>{m.ad}</span><Icon name="chevron" size={18} />
          </Link>
        ))}
      </section>
      <p className="note" style={{ textAlign: "center", marginTop: 16 }}>Hesabı silme seçeneği burada yer alacak (Apple kuralı gereği uygulama içinde de zorunlu).</p>
    </div>
  );
}
