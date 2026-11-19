# Kapalıçarşıdan Al — ön yüz önizlemesi

kapalicarsidanal.com için mobil öncelikli mağaza ön yüzü. **Tasarım önizlemesidir:** ürünler, gramlar, fiyatlar ve sipariş bilgileri örnektir; satış ve ödeme yapılmaz. Site arama motorlarına kapalıdır (`noindex`).

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # fiyat ve pazarlık kuralı testleri
npm run build
```

## Ekranlar

| Yol | İçerik |
| --- | --- |
| `/` | Ana sayfa: Cevat Usta karşılaması, kategoriler, süreli fırsatlar, ustanın seçkisi, yeni gelenler |
| `/kategori/[yuzuk…]` | 2 sütun ürün kartı, filtreler (ayar, renk, ölçü, stok, fırsat), sıralama |
| `/urun/[kod]` | Galeri, ölçü seçimi, ölçüye göre gram/stok/fiyat, fiyat dökümü, teslimat, ölçü rehberi, canlı görme talebi, paylaş, sabit Hemen Al / Pazarlık Et |
| `/pazarlik` | Pazarlık anlatımı; `?urun=KOD&olcu=16` ile teklif → karşı teklif → son fiyat → 15 dk ayırma |
| `/sepet` | Sepet, hediye seçenekleri, ödeme adımı (önizleme) |
| `/siparislerim` | Örnek sipariş takibi |
| `/favoriler`, `/hesabim`, `/ara` | Favoriler (bu tarayıcıda), hesap ve Altın Lira (yakında), arama |

## Kesinleşmemiş olanlar (kodda ÖRNEK olarak işaretli)

- `lib/pricing.ts` fiyat formülü: gram × (ayar milyemi + işçilik milyemi) × has altın + satış payı; KDV yalnız altın dışı kısım üzerinden. İşletme ve mali müşavirle kesinleşecek. Altın fiyatı kaynağı: Harem Altın (veri anlaşması bekliyor).
- `lib/patron.ts` pazarlık oranları. Gerçek sistemde sunucuda çalışır; taban fiyat müşteriye gönderilmez.
- Süreli fırsat, işçilik indirimi olarak gösterilir; altın kısmı güncel fiyattan.
- Ödeme (Kuveyt Türk), kargo/kurye, e-fatura, Altın Lira oranları henüz bağlı değil.
- Ürün görselleri gerçek fotoğraflar gelene kadar çizimdir. Cevat Usta görselleri yapay zekâ ile üretildi; ticari kullanım ve benzerlik kontrolü yapılacak.

Teknoloji: Next.js 15 (App Router), React 19, TypeScript. Tasarım dili `app/globals.css` içinde.
