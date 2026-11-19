// ÖRNEK katalog — tasarım önizlemesi için. Ürünler, gramlar ve fiyatlar gerçek değildir.
import { priceOf, type PriceBreakdown } from "./pricing";

export type CategorySlug = "yuzuk" | "bilezik" | "bileklik" | "kolye" | "kupe" | "pirlanta";

export const CATEGORIES: { slug: CategorySlug; ad: string; cogul: string; art: Art }[] = [
  { slug: "yuzuk", ad: "Yüzük", cogul: "Altın yüzükler", art: "burgu" },
  { slug: "bilezik", ad: "Bilezik", cogul: "Altın bilezikler", art: "bilezik" },
  { slug: "bileklik", ad: "Bileklik", cogul: "Altın bileklikler", art: "bileklik" },
  { slug: "kolye", ad: "Kolye", cogul: "Altın kolyeler", art: "kolye" },
  { slug: "kupe", ad: "Küpe", cogul: "Altın küpeler", art: "kupe" },
  { slug: "pirlanta", ad: "Pırlanta", cogul: "Pırlanta takılar", art: "tektas" },
];

export type Art =
  | "burgu" | "cizgili" | "dovme" | "capraz" | "orgu" | "toplu"
  | "bilezik" | "hasir" | "bileklik" | "kolye" | "halat" | "kupe" | "halka" | "tektas" | "bestas";

export type Stok = "kendi" | "tedarikci" | "yok";

export type Variant = { olcu: string; netMg: number; stok: Stok };

export type Pirlanta = {
  tur: "Doğal" | "Laboratuvar";
  karat: string;
  renk: string;
  berraklik: string;
  kesim: string;
  sertifika: string | null;
  tasKurus: number;
};

export type Product = {
  kod: string;
  tedarikciKod: string;
  ad: string;
  kategori: CategorySlug;
  art: Art;
  ayar: 14 | 22;
  milyem: number;
  renk: "Sarı altın" | "Beyaz altın" | "Rose altın";
  iscilikMilyem: number;
  olcuTuru: "Yüzük ölçüsü" | "Uzunluk" | "Çap" | null;
  varyantlar: Variant[];
  aciklama: string;
  ustaNotu: string;
  pirlanta?: Pirlanta;
  firsat?: { iscilikIndirimYuzde: number };
  yeni?: boolean;
  ustaSecimi?: boolean;
};

const r = (olcu: string, g: number, stok: Stok = "kendi"): Variant => ({ olcu, netMg: Math.round(g * 1000), stok });

export const PRODUCTS: Product[] = [
  {
    kod: "KA-Y014", tedarikciKod: "T1-BRG-320", ad: "Burgu Altın Yüzük", kategori: "yuzuk", art: "burgu",
    ayar: 14, milyem: 585, renk: "Sarı altın", iscilikMilyem: 90, olcuTuru: "Yüzük ölçüsü",
    varyantlar: [r("12", 2.95), r("14", 3.05), r("16", 3.2), r("18", 3.3, "tedarikci"), r("20", 3.45, "yok")],
    aciklama: "İki telin birbirine sarılmasıyla oluşan klasik burgu form. Günlük kullanıma uygun, ince ve hafif.",
    ustaNotu: "Burgu işçiliği ışığı her açıdan yakalar. Tek başına da, başka yüzükle üst üste de güzel durur.",
    ustaSecimi: true,
  },
  {
    kod: "KA-Y022", tedarikciKod: "T1-CZG-410", ad: "Çizgili Altın Yüzük", kategori: "yuzuk", art: "cizgili",
    ayar: 14, milyem: 585, renk: "Sarı altın", iscilikMilyem: 85, olcuTuru: "Yüzük ölçüsü",
    varyantlar: [r("14", 3.9), r("16", 4.1), r("18", 4.25, "tedarikci")],
    aciklama: "Paralel kanallarla işlenmiş geniş yüzey. Parlak ve mat çizgiler dönüşümlü.",
    ustaNotu: "Geniş model; parmağı ince olanlarda bir numara büyük tercih edilir.",
    firsat: { iscilikIndirimYuzde: 40 },
  },
  {
    kod: "KA-Y031", tedarikciKod: "T2-DVM-360", ad: "Dövme Dokulu Yüzük", kategori: "yuzuk", art: "dovme",
    ayar: 14, milyem: 585, renk: "Sarı altın", iscilikMilyem: 110, olcuTuru: "Yüzük ölçüsü",
    varyantlar: [r("12", 3.35), r("14", 3.45), r("16", 3.6), r("18", 3.75)],
    aciklama: "Çekiçle dövülmüş el işi yüzey. Her parçada doku biraz farklıdır.",
    ustaNotu: "El dövmesi; çizilmeye karşı yüzeyi affedicidir, zamanla daha da güzelleşir.",
    yeni: true,
  },
  {
    kod: "KA-Y035", tedarikciKod: "T2-CPZ-340", ad: "Çapraz Altın Yüzük", kategori: "yuzuk", art: "capraz",
    ayar: 14, milyem: 585, renk: "Rose altın", iscilikMilyem: 95, olcuTuru: "Yüzük ölçüsü",
    varyantlar: [r("14", 3.25), r("16", 3.4), r("18", 3.55, "tedarikci")],
    aciklama: "Ortada kesişen iki hat; sonsuzluk hissi veren sade bir form.",
    ustaNotu: "Rose altının sıcak tonu ten rengiyle çok iyi uyum sağlar.",
    yeni: true,
  },
  {
    kod: "KA-Y040", tedarikciKod: "T3-ORG-420", ad: "Örgü Altın Yüzük", kategori: "yuzuk", art: "orgu",
    ayar: 14, milyem: 585, renk: "Sarı altın", iscilikMilyem: 120, olcuTuru: "Yüzük ölçüsü",
    varyantlar: [r("14", 4.0), r("16", 4.2), r("18", 4.35)],
    aciklama: "Üç telin örülmesiyle yapılan dolgun model.",
    ustaNotu: "Örgüde tel sayısı arttıkça işçilik artar; bu model üç tel.",
    ustaSecimi: true,
  },
  {
    kod: "KA-Y044", tedarikciKod: "T3-TPL-310", ad: "Toplu Altın Yüzük", kategori: "yuzuk", art: "toplu",
    ayar: 14, milyem: 585, renk: "Sarı altın", iscilikMilyem: 100, olcuTuru: "Yüzük ölçüsü",
    varyantlar: [r("12", 2.95), r("14", 3.0), r("16", 3.1)],
    aciklama: "Küçük altın topların sıralandığı ince model.",
    ustaNotu: "Üst üste takılan yüzüklerin arasında çok iyi durur.",
  },
  {
    kod: "KA-B101", tedarikciKod: "T4-BRM-1250", ad: "Burma Altın Bilezik", kategori: "bilezik", art: "bilezik",
    ayar: 22, milyem: 916, renk: "Sarı altın", iscilikMilyem: 25, olcuTuru: "Çap",
    varyantlar: [r("60 mm", 12.1), r("62 mm", 12.5), r("64 mm", 12.9, "tedarikci")],
    aciklama: "22 ayar, geleneksel burma işçilik. Yatırım ile takıyı bir arada isteyenler için.",
    ustaNotu: "22 ayarda işçilik düşüktür; bileziğin değeri büyük ölçüde altınından gelir.",
    ustaSecimi: true,
  },
  {
    kod: "KA-B108", tedarikciKod: "T4-HSR-1580", ad: "Hasır Altın Bilezik", kategori: "bilezik", art: "hasir",
    ayar: 22, milyem: 916, renk: "Sarı altın", iscilikMilyem: 30, olcuTuru: "Çap",
    varyantlar: [r("60 mm", 15.4), r("62 mm", 15.8)],
    aciklama: "Hasır örgü yüzey, tam kapalı kilit.",
    ustaNotu: "Hasır desen sık ve düzgünse işçilik iyidir; bu model elde örülüyor.",
    firsat: { iscilikIndirimYuzde: 30 },
  },
  {
    kod: "KA-K201", tedarikciKod: "T5-TPL-410", ad: "Altın Toplu Bileklik", kategori: "bileklik", art: "bileklik",
    ayar: 14, milyem: 585, renk: "Sarı altın", iscilikMilyem: 70, olcuTuru: "Uzunluk",
    varyantlar: [r("17 cm", 3.9), r("19 cm", 4.1)],
    aciklama: "İnce zincir üzerinde aralıklı altın toplar.",
    ustaNotu: "Bileğinizi ölçüp üzerine 1,5–2 cm ekleyin; rahat durur.",
    yeni: true,
  },
  {
    kod: "KA-C301", tedarikciKod: "T5-DML-780", ad: "Damla Motifli Kolye", kategori: "kolye", art: "kolye",
    ayar: 14, milyem: 585, renk: "Sarı altın", iscilikMilyem: 95, olcuTuru: "Uzunluk",
    varyantlar: [r("42 cm", 7.6), r("45 cm", 7.8)],
    aciklama: "Telkari esintili damla uç, ince zincirle.",
    ustaNotu: "Uç ile zincir birlikte satılır; zincir boyu iki seçenekli.",
    ustaSecimi: true,
  },
  {
    kod: "KA-C305", tedarikciKod: "T5-HLT-750", ad: "Altın Halat Zincir", kategori: "kolye", art: "halat",
    ayar: 14, milyem: 585, renk: "Sarı altın", iscilikMilyem: 60, olcuTuru: "Uzunluk",
    varyantlar: [r("45 cm", 7.5), r("50 cm", 8.3, "tedarikci")],
    aciklama: "Halat örgü zincir, sağlam kilit.",
    ustaNotu: "Halat örgü kopmaya karşı en dayanıklı zincirlerden biridir.",
  },
  {
    kod: "KA-E401", tedarikciKod: "T6-TOP-460", ad: "Top Motifli Küpe", kategori: "kupe", art: "kupe",
    ayar: 14, milyem: 585, renk: "Sarı altın", iscilikMilyem: 110, olcuTuru: null,
    varyantlar: [r("Tek ölçü", 4.6)],
    aciklama: "Kafes işi top sallantılı küpe.",
    ustaNotu: "Kafes işi hafiftir; görünenden daha az gram tutar.",
    yeni: true,
  },
  {
    kod: "KA-E405", tedarikciKod: "T6-HLK-380", ad: "Altın Halka Küpe", kategori: "kupe", art: "halka",
    ayar: 14, milyem: 585, renk: "Sarı altın", iscilikMilyem: 80, olcuTuru: null,
    varyantlar: [r("Tek ölçü", 3.8)],
    aciklama: "Elmas kesim yüzeyli orta boy halka.",
    ustaNotu: "Elmas kesim, düz halkaya göre çok daha fazla ışık verir.",
    firsat: { iscilikIndirimYuzde: 35 },
  },
  {
    kod: "KA-P501", tedarikciKod: "T7-TKT-030", ad: "Pırlanta Tektaş Yüzük", kategori: "pirlanta", art: "tektas",
    ayar: 14, milyem: 585, renk: "Beyaz altın", iscilikMilyem: 140, olcuTuru: "Yüzük ölçüsü",
    varyantlar: [r("12", 2.6), r("14", 2.7), r("16", 2.8, "tedarikci")],
    aciklama: "Altı tırnaklı klasik tektaş. 0,30 karat pırlanta.",
    ustaNotu: "Tektaşta önce kesime bakın; ışığı en çok kesim belirler.",
    pirlanta: { tur: "Doğal", karat: "0,30 ct", renk: "G", berraklik: "VS2", kesim: "Çok iyi", sertifika: "Sertifika bilgisi toptancıdan teyit edilecek", tasKurus: 3_250_000 },
    ustaSecimi: true,
  },
  {
    kod: "KA-P508", tedarikciKod: "T7-BST-050", ad: "Pırlanta Beştaş Yüzük", kategori: "pirlanta", art: "bestas",
    ayar: 14, milyem: 585, renk: "Beyaz altın", iscilikMilyem: 150, olcuTuru: "Yüzük ölçüsü",
    varyantlar: [r("14", 3.1), r("16", 3.2)],
    aciklama: "Yan yana beş pırlanta, toplam 0,50 karat.",
    ustaNotu: "Beştaşta taşların renk ve boyca birbirine uyumu önemlidir.",
    pirlanta: { tur: "Laboratuvar", karat: "5 × 0,10 ct", renk: "F", berraklik: "VS1", kesim: "Mükemmel", sertifika: null, tasKurus: 1_480_000 },
    yeni: true,
  },
];

export function product(kod: string) {
  return PRODUCTS.find((p) => p.kod === kod);
}

export function category(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function variantPrice(p: Product, v: Variant): PriceBreakdown {
  return priceOf({
    netMg: v.netMg,
    ayarMilyem: p.milyem,
    iscilikMilyem: p.iscilikMilyem,
    tasKurus: p.pirlanta?.tasKurus,
  });
}

/** Fırsatta indirim yalnız işçilikten yapılır; altın kısmı güncel fiyattan. */
export function firsatPrice(p: Product, v: Variant): PriceBreakdown | null {
  if (!p.firsat) return null;
  const iscilik = Math.round((p.iscilikMilyem * (100 - p.firsat.iscilikIndirimYuzde)) / 100);
  return priceOf({ netMg: v.netMg, ayarMilyem: p.milyem, iscilikMilyem: iscilik, tasKurus: p.pirlanta?.tasKurus });
}

export function defaultVariant(p: Product): Variant {
  return p.varyantlar.find((v) => v.olcu === "16") ?? p.varyantlar.find((v) => v.stok !== "yok") ?? p.varyantlar[0];
}

export const STOK_METNI: Record<Stok, string> = {
  kendi: "Stokta · aynı gün hazırlanır",
  tedarikci: "Atölyede · 1–2 iş günü",
  yok: "Bu ölçü şu an yok",
};
