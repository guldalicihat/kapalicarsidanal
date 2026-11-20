import Link from "next/link";
import Icon from "@/components/Icon";
import { FIRMA, yakinda } from "@/lib/firma";

export const metadata = { title: "Güvencelerimiz · Kapalıçarşıdan Al" };

const SSS = [
  { s: "Aldığım takının gerçek altın olduğunu nasıl bilirim?", c: "Her takıda ayar damgası (14 ayar için 585, 22 ayar için 916) bulunur. Gramı tartılarak gönderilir ve firma adına e-fatura kesilir. Faturada ayar ve gram yazar; dilediğin kuyumcuda kontrol ettirebilirsin." },
  { s: "Kart bilgilerim güvende mi?", c: "Ödeme Kuveyt Türk'ün güvenli ödeme sayfasında 3D Secure ile yapılır; telefonuna gelen kodla onaylarsın. Kart bilgilerin bize gelmez, bizim sistemimizde tutulmaz." },
  { s: "Takı yolda kaybolursa ya da zarar görürse ne olur?", c: "Gönderi, eline ulaşana kadar sigortalıdır. Kaybolur ya da hasar görürse bedeli ödenir ya da yenisi gönderilir." },
  { s: "Ödeme sırasında altın fiyatı değişirse ne olur?", c: "Ödeme adımına geçtiğinde fiyatın 15 dakika sabitlenir. Bu sürede altın fiyatı değişse de senin fiyatın değişmez." },
  { s: "Bir sorun olursa kime ulaşırım?", c: "Telefon, WhatsApp ya da canlı görüşmeyle doğrudan bize ulaşırsın. İletişim bilgilerimiz sayfanın altında yazar." },
];

export default function Guvencelerimiz() {
  return (
    <div className="shell guv">
      <header className="guv-hero">
        <img src="/carsi/kapi.jpg" alt="Kapalıçarşı'nın taş kemerli tarihi giriş kapısı" />
        <div className="guv-head">
        <span className="eyebrow">Güvencelerimiz</span>
        <h1>Güvenle alışveriş, her adımda.</h1>
        <p>İnternetten altın alırken üç şeyi bilmek istersin: firma gerçek mi, param güvende mi, takı eline sağlam ve hakiki ulaşacak mı? Bu sayfada hepsinin cevabı var.</p>
        <div className="preview-note"><Icon name="info" size={16} />Site önizleme aşamasında. Ödeme, kargo ve sigorta; banka ve kargo anlaşmaları tamamlanınca aktif olur. Henüz tamamlanmayan bilgiler “yakında” olarak işaretli.</div>
        </div>
      </header>

      <section className="guv-grid">
        <article id="firma" className="panel guv-card">
          <Icon name="home" size={26} />
          <h2>Gerçek firma</h2>
          <p>Kayıtlı bir firma olarak satış yaparız. Firma bilgilerimiz açıkça yazar.</p>
          <dl>
            <dt>Unvan</dt><dd>{yakinda(FIRMA.unvan)}</dd>
            <dt>Adres</dt><dd>{yakinda(FIRMA.adres)}</dd>
            <dt>Vergi dairesi / no</dt><dd>{FIRMA.vergiNo ? `${FIRMA.vergiDairesi ?? ""} ${FIRMA.vergiNo}` : "yakında eklenecek"}</dd>
            <dt>MERSİS no</dt><dd>{yakinda(FIRMA.mersisNo)}</dd>
            <dt>ETBİS kaydı</dt><dd>{FIRMA.etbisKarekodUrl ? <a href={FIRMA.etbisKarekodUrl} target="_blank" rel="noopener noreferrer">Kaydı görüntüle</a> : "yakında eklenecek"}</dd>
          </dl>
        </article>
        <article id="odeme" className="panel guv-card">
          <Icon name="lock" size={26} />
          <h2>Güvenli ödeme</h2>
          <p>Ödeme Kuveyt Türk'ün güvenli ödeme sayfasında yapılır. 3D Secure ile telefonuna gelen kodla onaylarsın.</p>
          <ul><li>Kart bilgilerin bize gelmez, saklanmaz.</li><li>Ödeme adımında fiyatın 15 dakika sabitlenir.</li><li>Taksit seçenekleri kartına ve bankana göre, yasal sınırlar içinde gösterilir.</li></ul>
        </article>
        <article id="urun" className="panel guv-card">
          <img className="guv-foto" src="/carsi/tartiyor.jpg" alt="Cevat Usta altın bileziği terazide tartıyor" loading="lazy" />
          <Icon name="gem" size={26} />
          <h2>Gerçek altın, belgeli</h2>
          <p>Takılar Kapalıçarşı'nın atölyelerinden ve kuyum toptancılarından gelir.</p>
          <ul><li>Ayar damgalı: 14 ayar 585, 22 ayar 916.</li><li>Gramı tartılarak gönderilir.</li><li>Her siparişte firma adına e-fatura.</li><li>Pırlantalarda varsa sertifika numarası ürün sayfasında yazar.</li></ul>
        </article>
        <article id="teslimat" className="panel guv-card">
          <img className="guv-foto" src="/carsi/paketliyor.jpg" alt="Cevat Usta yüzüğü kadife kutuya yerleştiriyor, yanında mühürlü paket" loading="lazy" />
          <Icon name="truck" size={26} />
          <h2>Sigortalı teslimat</h2>
          <p>Takın özel, mühürlü kutuda, takip numarasıyla yola çıkar.</p>
          <ul><li>Eline ulaşana kadar sigortalı.</li><li>Kaybolur ya da hasar görürse bedeli ödenir ya da yenisi gönderilir.</li><li>İstanbul'da kuryeyle elden teslim seçeneği.</li></ul>
        </article>
        <article id="iade" className="panel guv-card">
          <Icon name="back" size={26} />
          <h2>İade ve cayma</h2>
          <p>İade şartlarımız sade dille bu bölümde ve ödemeden önce gösterilen ön bilgilendirme formunda yer alır.</p>
          <p className="note">Şartların kesin metni hazırlanıyor; yakında burada yayınlanacak.</p>
        </article>
        <article id="iletisim" className="panel guv-card">
          <Icon name="chat" size={26} />
          <h2>Ulaşılabilir insan</h2>
          <p>Takıldığın her yerde bir insan cevap verir.</p>
          <dl>
            <dt>Telefon</dt><dd>{yakinda(FIRMA.telefon)}</dd>
            <dt>WhatsApp</dt><dd>{yakinda(FIRMA.whatsapp)}</dd>
            <dt>E-posta</dt><dd>{yakinda(FIRMA.eposta)}</dd>
            <dt>Çalışma saatleri</dt><dd>{yakinda(FIRMA.calismaSaatleri)}</dd>
          </dl>
          <p className="note">Ürün sayfasındaki “Canlı görüşme” ile takıyı görüntülü olarak görebilirsin. Yorumlar yalnız gerçek ziyaretçilerden gelir ve kontrol edilerek yayınlanır.</p>
        </article>
      </section>

      <section className="section" aria-labelledby="sss">
        <div className="section-head"><h2 id="sss">Sık sorulanlar</h2></div>
        <div className="panel" style={{ padding: "4px 16px" }}>
          {SSS.map((x) => (
            <details className="acc" key={x.s}>
              <summary><span className="grow">{x.s}</span><span className="chev"><Icon name="down" size={18} /></span></summary>
              <div className="content"><p style={{ margin: 0 }}>{x.c}</p></div>
            </details>
          ))}
        </div>
      </section>

      <section id="yasal" className="section">
        <div className="section-head"><h2>Yasal metinler</h2></div>
        <div className="panel guv-legal">
          {["Ön bilgilendirme formu", "Mesafeli satış sözleşmesi", "KVKK aydınlatma metni", "Çerez politikası"].map((t) => (
            <div key={t}><span>{t}</span><span className="note">hazırlanıyor</span></div>
          ))}
        </div>
        <p className="note" style={{ marginTop: 10 }}>Bu metinler hukuk danışmanı onayıyla yayınlanacak. <Link href="/">Alışverişe dön</Link></p>
      </section>
    </div>
  );
}
