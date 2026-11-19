// Güven bileşenleri: ana sayfa şeridi, ürün güvence kutusu, satıcı kartı, sayfa altı.
import Link from "next/link";
import Icon from "./Icon";
import { FIRMA } from "@/lib/firma";

export function GuvenSeridi() {
  return (
    <section className="trust-band" aria-labelledby="guven">
      <div className="tb-head">
        <Icon name="shield" size={26} />
        <div>
          <h2 id="guven">Güvenle alışveriş</h2>
          <p>Kayıtlı firma · 3D Secure ödeme · Sigortalı teslimat · Faturalı, damgalı ürün</p>
        </div>
        <Link href="/guvencelerimiz" className="btn btn-gold btn-sm">Güvencelerimiz <Icon name="chevron" size={16} /></Link>
      </div>
      <div className="tb-grid">
        <div><Icon name="check" size={18} /><span><b>Ayar damgalı</b>585 · 916, tartılmış gram</span></div>
        <div><Icon name="check" size={18} /><span><b>E-fatura</b>Firma adına, her siparişte</span></div>
        <div><Icon name="check" size={18} /><span><b>Sigortalı</b>Kapına kadar, takip numaralı</span></div>
        <div><Icon name="check" size={18} /><span><b>Açık iade kuralı</b>Ödemeden önce okursun</span></div>
      </div>
    </section>
  );
}

export function UrunGuvenceleri({ ayar, milyem, gramMetni, pirlantaSertifika }: { ayar: number; milyem: number; gramMetni: string; pirlantaSertifika?: string }) {
  return (
    <div className="pd-guvence">
      <div className="pg-title"><Icon name="shield" size={18} />Bu takının güvenceleri</div>
      <ul>
        <li><Icon name="gem" size={16} />{ayar} ayar · {milyem} damgalı · {gramMetni} tartılı</li>
        {pirlantaSertifika && <li><Icon name="check" size={16} />Pırlanta sertifikası: {pirlantaSertifika}</li>}
        <li><Icon name="box" size={16} />Firma adına e-fatura</li>
        <li><Icon name="lock" size={16} />3D Secure güvenli ödeme</li>
        <li><Icon name="truck" size={16} />Kapına kadar sigortalı teslimat</li>
        <li><Icon name="back" size={16} /><Link href="/guvencelerimiz#iade">İade şartlarını oku</Link></li>
      </ul>
      <div className="pg-seller">
        <span className="note">Satıcı</span>
        <b>{FIRMA.unvan ?? FIRMA.marka}</b>
        <span className="note">{FIRMA.adres ?? "Firma adresi, vergi no ve ETBİS kaydı yakında burada"} · <Link href="/guvencelerimiz#firma">Firma bilgileri</Link></span>
      </div>
    </div>
  );
}

function satir(liste: [string, string | null][], bos: string) {
  const dolu = liste.filter(([, v]) => v);
  return dolu.length ? dolu.map(([k, v]) => <span key={k}>{k}: {v}</span>) : <span>{bos}</span>;
}

export function Altbilgi() {
  return (
    <footer className="site-foot">
      <div className="shell sf-in">
        <div className="sf-brand">
          <b>{FIRMA.unvan ?? FIRMA.marka}</b>
          {satir([["Adres", FIRMA.adres], ["Vergi dairesi / no", FIRMA.vergiNo && `${FIRMA.vergiDairesi ?? ""} ${FIRMA.vergiNo}`.trim()], ["MERSİS no", FIRMA.mersisNo]], "Firma unvanı, adres, vergi ve MERSİS bilgileri yakında burada.")}
        </div>
        <div className="sf-col">
          <b>İletişim</b>
          {satir([["Telefon", FIRMA.telefon], ["WhatsApp", FIRMA.whatsapp], ["E-posta", FIRMA.eposta], ["Çalışma saatleri", FIRMA.calismaSaatleri]], "Telefon, WhatsApp ve e-posta yakında burada.")}
        </div>
        <div className="sf-col">
          <b>Güven</b>
          <Link href="/guvencelerimiz">Güvencelerimiz</Link>
          <Link href="/guvencelerimiz#firma">Biz kimiz</Link>
          <Link href="/guvencelerimiz#iade">İade ve cayma</Link>
          <Link href="/guvencelerimiz#yasal">KVKK · Çerezler · Mesafeli satış</Link>
        </div>
        <div className="sf-col">
          <b>ETBİS</b>
          {FIRMA.etbisKarekodUrl
            ? <a href={FIRMA.etbisKarekodUrl} target="_blank" rel="noopener noreferrer">Ticaret Bakanlığı ETBİS kaydını gör</a>
            : <span>Ticaret Bakanlığı ETBİS karekodu kayıt tamamlanınca burada yer alacak.</span>}
          <span className="sf-pay"><Icon name="lock" size={14} />3D Secure · kart bilgisi saklanmaz</span>
        </div>
      </div>
      <div className="shell sf-bottom">© {new Date().getFullYear()} {FIRMA.marka} · Tasarım önizlemesi</div>
    </footer>
  );
}
