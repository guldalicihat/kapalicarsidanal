// ÖRNEK "Patron Masası" kural motoru. Oranlar tasarım önizlemesi içindir, işletme kararı değildir.
// Gerçek sistemde bu hesap sunucuda yapılır; taban fiyat müşterinin cihazına hiç gönderilmez.

export type Durum = "BEKLIYOR" | "KARSI_TEKLIF" | "SON_FIYAT" | "ANLASMA" | "KAPANDI";
export type Olay = { kim: "musteri" | "patron"; tur: "teklif" | "kabul" | "ret" | "karsi" | "son" | "vazgec"; tutar?: number; zaman: number };
export type Pazarlik = { liste: number; durum: Durum; patronTeklif?: number; anlasilan?: number; musteriTeklifSayisi: number; olaylar: Olay[] };

export const KURAL = { kabulOrani: 960, tabanOrani: 920, sonFiyatOrani: 950, cokDusukOrani: 800, enCokTeklif: 3 } as const; // binde

const yuvarla = (k: number) => Math.round(k / 5000) * 5000; // 50 TL adım
const oran = (liste: number, binde: number) => Math.round((liste * binde) / 1000);

export function baslat(liste: number): Pazarlik {
  return { liste, durum: "BEKLIYOR", musteriTeklifSayisi: 0, olaylar: [] };
}

export function teklifVer(s: Pazarlik, tutar: number, zaman: number): Pazarlik {
  if (s.durum !== "BEKLIYOR" && s.durum !== "KARSI_TEKLIF") throw new Error("Bu aşamada teklif verilemez");
  if (!Number.isFinite(tutar) || tutar <= 0) throw new Error("Geçersiz tutar");
  const sayi = s.musteriTeklifSayisi + 1;
  const olaylar: Olay[] = [...s.olaylar, { kim: "musteri", tur: "teklif", tutar, zaman }];
  const base = { ...s, musteriTeklifSayisi: sayi };
  const taban = oran(s.liste, KURAL.tabanOrani);

  if (tutar >= Math.min(s.liste, oran(s.liste, KURAL.kabulOrani)) || (s.patronTeklif !== undefined && tutar >= s.patronTeklif)) {
    const anlasilan = Math.min(tutar, s.liste);
    return { ...base, durum: "ANLASMA", anlasilan, olaylar: [...olaylar, { kim: "patron", tur: "kabul", tutar: anlasilan, zaman }] };
  }
  const ikinciTur = s.durum === "KARSI_TEKLIF" || sayi >= KURAL.enCokTeklif;
  if (ikinciTur) {
    const son = Math.max(yuvarla(Math.max(taban, (tutar + (s.patronTeklif ?? s.liste)) / 2)), oran(s.liste, KURAL.sonFiyatOrani) - 5000 * 2);
    const sonFiyat = Math.min(son, s.patronTeklif ?? s.liste);
    return { ...base, durum: "SON_FIYAT", patronTeklif: sonFiyat, olaylar: [...olaylar, { kim: "patron", tur: "son", tutar: sonFiyat, zaman }] };
  }
  if (tutar < oran(s.liste, KURAL.cokDusukOrani)) {
    return { ...base, durum: "BEKLIYOR", olaylar: [...olaylar, { kim: "patron", tur: "ret", zaman }] };
  }
  const karsi = yuvarla(tutar >= taban ? (tutar + s.liste) / 2 : oran(s.liste, 970));
  return { ...base, durum: "KARSI_TEKLIF", patronTeklif: karsi, olaylar: [...olaylar, { kim: "patron", tur: "karsi", tutar: karsi, zaman }] };
}

export function kabulEt(s: Pazarlik, zaman: number): Pazarlik {
  if ((s.durum !== "KARSI_TEKLIF" && s.durum !== "SON_FIYAT") || s.patronTeklif === undefined) throw new Error("Kabul edilecek teklif yok");
  return { ...s, durum: "ANLASMA", anlasilan: s.patronTeklif, olaylar: [...s.olaylar, { kim: "musteri", tur: "kabul", tutar: s.patronTeklif, zaman }] };
}

export function vazgec(s: Pazarlik, zaman: number): Pazarlik {
  return { ...s, durum: "KAPANDI", olaylar: [...s.olaylar, { kim: "musteri", tur: "vazgec", zaman }] };
}

export const ODEME_SURESI_MS = 15 * 60 * 1000;
