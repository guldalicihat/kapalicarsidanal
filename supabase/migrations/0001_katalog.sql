-- Kapalıçarşıdan Al — katalog, stok, fiyat, pazarlık ve sipariş temeli.
-- Para: kuruş (bigint). Ağırlık: miligram (integer). Oran: binde (integer). Kayan nokta yok.

create table if not exists tedarikciler (
  id uuid primary key default gen_random_uuid(),
  ad text not null,
  telefon text,
  not_ text,
  aktif boolean not null default true,
  olusturma timestamptz not null default now()
);

create table if not exists kategoriler (
  slug text primary key,
  ad text not null,
  cogul text not null,
  sira int not null default 0
);

create table if not exists urunler (
  kod text primary key,                       -- tekil ürün kodu (KA-...)
  tedarikci_id uuid references tedarikciler(id),
  tedarikci_kod text,                         -- tedarikçinin model kodu
  ad text not null,
  kategori text not null references kategoriler(slug),
  ayar smallint not null check (ayar in (8,14,18,22,24)),
  milyem smallint not null check (milyem between 1 and 1000),
  renk text not null,
  iscilik_milyem smallint not null default 0 check (iscilik_milyem >= 0),
  olcu_turu text,                             -- 'Yüzük ölçüsü' | 'Uzunluk' | 'Çap' | null
  aciklama text,
  usta_notu text,
  pirlanta jsonb,                             -- tür, karat, renk, berraklık, kesim, sertifika, taş bedeli
  firsat_iscilik_indirim smallint check (firsat_iscilik_indirim between 1 and 90),
  firsat_bitis timestamptz,
  yeni boolean not null default false,
  usta_secimi boolean not null default false,
  yayinda boolean not null default false,
  gorseller text[] not null default '{}',
  olusturma timestamptz not null default now(),
  guncelleme timestamptz not null default now()
);

create table if not exists varyantlar (
  id uuid primary key default gen_random_uuid(),
  urun_kod text not null references urunler(kod) on delete cascade,
  olcu text not null,
  net_mg integer not null check (net_mg > 0),
  tas_mg integer not null default 0,
  kendi_stok integer not null default 0 check (kendi_stok >= 0),
  tedarikci_stok_teyitli boolean not null default false,
  tedarikci_teyit_zamani timestamptz,
  tedarik_gun smallint,
  unique (urun_kod, olcu)
);

-- Altın referans fiyatı geçmişi (Harem Altın; 15 dk)
create table if not exists altin_fiyatlari (
  id bigserial primary key,
  kaynak text not null,
  has_alis_kurus bigint,
  has_satis_kurus bigint not null,
  zaman timestamptz not null default now()
);

-- Genel ayarlar (satış payı, KDV, pazarlık oranları...). Örnek değerler, işletmece kesinleşecek.
create table if not exists ayarlar (
  anahtar text primary key,
  deger jsonb not null,
  aciklama text,
  guncelleme timestamptz not null default now()
);

-- Pazarlık kayıtları (her teklif ve yanıt ayrı satır)
create table if not exists pazarliklar (
  id uuid primary key default gen_random_uuid(),
  urun_kod text not null references urunler(kod),
  olcu text not null,
  liste_kurus bigint not null,
  durum text not null default 'BEKLIYOR',
  patron_teklif_kurus bigint,
  anlasilan_kurus bigint,
  rezerve_bitis timestamptz,                  -- 15 dk ödeme süresi (sunucu)
  musteri_ref text,
  olusturma timestamptz not null default now()
);
create table if not exists pazarlik_olaylari (
  id bigserial primary key,
  pazarlik_id uuid not null references pazarliklar(id) on delete cascade,
  kim text not null check (kim in ('musteri','patron','berat')),
  tur text not null,
  tutar_kurus bigint,
  zaman timestamptz not null default now()
);

create table if not exists siparisler (
  id uuid primary key default gen_random_uuid(),
  no serial unique,
  durum text not null default 'ODEME_BEKLIYOR',
  toplam_kurus bigint not null,
  hediye jsonb,
  musteri_ref text,
  odeme_ref text unique,                      -- banka işlem kimliği (çift işlem engeli)
  olusturma timestamptz not null default now()
);
create table if not exists siparis_kalemleri (
  id bigserial primary key,
  siparis_id uuid not null references siparisler(id) on delete cascade,
  urun_kod text not null references urunler(kod),
  olcu text not null,
  adet int not null default 1,
  birim_kurus bigint not null,
  fiyat_dokumu jsonb not null,                -- altın, işçilik, pay, KDV, kullanılan has fiyatı, formül sürümü
  pazarlik_id uuid references pazarliklar(id)
);

-- Güvenlik: tablolar herkese kapalı; vitrin yalnız yayındaki ürünleri okuyabilir.
alter table tedarikciler enable row level security;
alter table kategoriler enable row level security;
alter table urunler enable row level security;
alter table varyantlar enable row level security;
alter table altin_fiyatlari enable row level security;
alter table ayarlar enable row level security;
alter table pazarliklar enable row level security;
alter table pazarlik_olaylari enable row level security;
alter table siparisler enable row level security;
alter table siparis_kalemleri enable row level security;

drop policy if exists vitrin_kategori on kategoriler;
create policy vitrin_kategori on kategoriler for select to anon, authenticated using (true);
drop policy if exists vitrin_urun on urunler;
create policy vitrin_urun on urunler for select to anon, authenticated using (yayinda);
drop policy if exists vitrin_varyant on varyantlar;
create policy vitrin_varyant on varyantlar for select to anon, authenticated
  using (exists (select 1 from urunler u where u.kod = urun_kod and u.yayinda));
drop policy if exists vitrin_altin on altin_fiyatlari;
create policy vitrin_altin on altin_fiyatlari for select to anon, authenticated using (true);
-- Not: tedarikçi, maliyet, pazarlık ve sipariş tabloları için vitrine hiç izin yok (yalnız sunucu).
