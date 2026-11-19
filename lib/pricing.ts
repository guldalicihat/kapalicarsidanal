// ÖRNEK fiyat hesabı — işletmeyle kesinleşmiş formül DEĞİLDİR.
// Varsayım (toptancı listelerinde yaygın kullanım, teyit edilecek):
//   has karşılığı (g) = net gram × (ayar milyemi + işçilik milyemi) / 1000
//   satış (KDV hariç) = has karşılığı × has altın fiyatı × (1 + satış payı)
//   KDV, altın bedeli düşülerek kalan kısım üzerinden (özel matrah) — müşavir teyidi bekliyor.
// Tüm hesaplar tam sayı ile yapılır: gram → miligram, para → kuruş, oran → binde.

export const ORNEK_HAS_ALTIN_KURUS = 585_000; // 5.850,00 TL / g has altın (örnek veri)
export const ORNEK_SATIS_PAYI_BINDE = 60; // %6 (örnek)
export const ORNEK_KDV_BINDE = 200; // %20 (doğrulanacak)

export type PriceInput = {
  netMg: number; // net ağırlık, miligram
  ayarMilyem: number; // 14 ayar = 585
  iscilikMilyem: number; // toptancı işçiliği, binde
  hasKurus?: number; // 1 g has altın, kuruş
  satisPayiBinde?: number;
  tasKurus?: number; // pırlanta / taş bedeli, kuruş (KDV'ye tabi)
};

export type PriceBreakdown = {
  altinKurus: number; // ürünün içindeki saf altın bedeli
  iscilikKurus: number;
  payKurus: number;
  tasKurus: number;
  kdvKurus: number;
  toplamKurus: number;
};

const div = (a: number, b: number) => Math.round(a / b);

export function priceOf(p: PriceInput): PriceBreakdown {
  const has = p.hasKurus ?? ORNEK_HAS_ALTIN_KURUS;
  const pay = p.satisPayiBinde ?? ORNEK_SATIS_PAYI_BINDE;
  const altinKurus = div(p.netMg * p.ayarMilyem * has, 1000 * 1000);
  const iscilikKurus = div(p.netMg * p.iscilikMilyem * has, 1000 * 1000);
  const tasKurus = p.tasKurus ?? 0;
  const payKurus = div((altinKurus + iscilikKurus + tasKurus) * pay, 1000);
  const matrah = iscilikKurus + payKurus + tasKurus; // altın bedeli düşülmüş kısım
  const kdvKurus = div(matrah * ORNEK_KDV_BINDE, 1000);
  const ham = altinKurus + matrah + kdvKurus;
  const toplamKurus = Math.ceil(ham / 1000) * 1000; // 10 TL'ye yukarı yuvarla
  return { altinKurus, iscilikKurus, payKurus, tasKurus, kdvKurus, toplamKurus };
}

export function tl(kurus: number, kesirli = false): string {
  return (
    new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: kesirli ? 2 : 0,
      maximumFractionDigits: kesirli ? 2 : 0,
    }).format(kurus / 100) + " TL"
  );
}

export function gram(mg: number): string {
  return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(mg / 1000) + " g";
}
