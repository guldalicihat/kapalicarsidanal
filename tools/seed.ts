// Örnek katalogdan (lib/catalog.ts) veritabanına başlangıç verisi üretir: SQL çıktısı.
import { CATEGORIES, PRODUCTS } from "../lib/catalog.ts";
const q = (v: unknown) => v === null || v === undefined ? "null" : typeof v === "number" || typeof v === "boolean" ? String(v) : `'${String(v).replace(/'/g, "''")}'`;
const out: string[] = ["begin;"];
CATEGORIES.forEach((c, i) => out.push(`insert into kategoriler(slug,ad,cogul,sira) values (${q(c.slug)},${q(c.ad)},${q(c.cogul)},${i}) on conflict (slug) do update set ad=excluded.ad, cogul=excluded.cogul, sira=excluded.sira;`));
out.push(`insert into tedarikciler(id, ad, not_) values ('00000000-0000-0000-0000-000000000001','Örnek Toptancı','Tasarım önizlemesi için örnek kayıt') on conflict do nothing;`);
for (const p of PRODUCTS) {
  out.push(`insert into urunler(kod,tedarikci_id,tedarikci_kod,ad,kategori,ayar,milyem,renk,iscilik_milyem,olcu_turu,aciklama,usta_notu,pirlanta,firsat_iscilik_indirim,yeni,usta_secimi,yayinda) values (${[p.kod,"00000000-0000-0000-0000-000000000001",p.tedarikciKod,p.ad,p.kategori,p.ayar,p.milyem,p.renk,p.iscilikMilyem,p.olcuTuru,p.aciklama,p.ustaNotu].map(q).join(",")},${p.pirlanta ? q(JSON.stringify(p.pirlanta)) + "::jsonb" : "null"},${q(p.firsat?.iscilikIndirimYuzde ?? null)},${p.yeni ?? false},${p.ustaSecimi ?? false},true) on conflict (kod) do nothing;`);
  for (const v of p.varyantlar)
    out.push(`insert into varyantlar(urun_kod,olcu,net_mg,kendi_stok,tedarikci_stok_teyitli,tedarik_gun) values (${q(p.kod)},${q(v.olcu)},${v.netMg},${v.stok === "kendi" ? 1 : 0},${v.stok === "tedarikci"},${v.stok === "tedarikci" ? 2 : "null"}) on conflict (urun_kod,olcu) do nothing;`);
}
out.push(`insert into ayarlar(anahtar,deger,aciklama) values
 ('fiyat','{"satisPayiBinde":60,"kdvBinde":200,"yuvarlamaKurus":1000,"formulSurumu":"ornek-1"}','ÖRNEK: işletme ve mali müşavirle kesinleşecek'),
 ('pazarlik','{"kabulBinde":960,"tabanBinde":920,"sonFiyatBinde":950,"cokDusukBinde":800,"enCokTeklif":3,"odemeDakika":15}','ÖRNEK pazarlık oranları'),
 ('altin','{"kaynak":"Harem Altın","guncellemeDakika":15,"bayatlikDakika":30}','Fiyat kaynağı; veri anlaşması bekliyor')
 on conflict (anahtar) do nothing;`);
out.push(`insert into altin_fiyatlari(kaynak,has_satis_kurus) select 'ornek',585000 where not exists (select 1 from altin_fiyatlari);`);
out.push("commit;");
console.log(out.join("\n"));
