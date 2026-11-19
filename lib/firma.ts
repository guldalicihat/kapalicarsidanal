// Firma kimliği — sitede "Gerçek firma" güvencesinde gösterilir.
// Değer null ise sitede "yakında" yazar; ASLA uydurma değer girilmez.
export const FIRMA = {
  marka: "Kapalıçarşıdan Al",
  unvan: null as string | null,
  vergiDairesi: null as string | null,
  vergiNo: null as string | null,
  mersisNo: null as string | null,
  adres: null as string | null,
  telefon: null as string | null,
  whatsapp: null as string | null,
  eposta: null as string | null,
  calismaSaatleri: null as string | null,
  etbisKarekodUrl: null as string | null, // Bakanlığın verdiği gerçek karekod bağlantısı
};

export const yakinda = (v: string | null) => v ?? "yakında eklenecek";
