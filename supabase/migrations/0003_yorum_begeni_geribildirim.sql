-- Yorum + puan (moderasyonlu), beğeni (favori sayımı), test kullanıcısı geri bildirimleri.
-- Herkese açık okuma/yazma YOK; tüm yazma/okuma sunucu (gizli anahtar) üzerinden.
create table if not exists yorumlar (
  id bigint generated always as identity primary key,
  urun_kod text not null references urunler(kod) on delete cascade,
  puan smallint not null check (puan between 1 and 5),
  ad text not null check (char_length(ad) between 2 and 40),
  metin text not null default '' check (char_length(metin) <= 1000),
  cihaz text not null check (char_length(cihaz) between 8 and 64),
  onayli boolean not null default false,
  olusturma timestamptz not null default now(),
  unique (urun_kod, cihaz)
);
create index if not exists yorumlar_urun on yorumlar (urun_kod, onayli);

create table if not exists begeniler (
  urun_kod text not null references urunler(kod) on delete cascade,
  cihaz text not null check (char_length(cihaz) between 8 and 64),
  olusturma timestamptz not null default now(),
  primary key (urun_kod, cihaz)
);

create table if not exists geri_bildirimler (
  id bigint generated always as identity primary key,
  konu text not null check (konu in ('tasarim','hata','fiyat','pazarlik','oneri','diger')),
  puan smallint check (puan between 1 and 5),
  metin text not null check (char_length(metin) between 3 and 2000),
  ad text check (char_length(ad) <= 60),
  iletisim text check (char_length(iletisim) <= 80),
  sayfa text check (char_length(sayfa) <= 200),
  cihaz_bilgi text check (char_length(cihaz_bilgi) <= 200),
  cihaz text not null check (char_length(cihaz) between 8 and 64),
  durum text not null default 'yeni' check (durum in ('yeni','okundu','yapildi')),
  olusturma timestamptz not null default now()
);

alter table yorumlar enable row level security;
alter table begeniler enable row level security;
alter table geri_bildirimler enable row level security;

-- Vitrin için toplu sayılar (yalnız onaylı yorumlar sayılır).
create or replace view urun_ilgi with (security_invoker = true) as
select u.kod,
  (select count(*) from begeniler b where b.urun_kod = u.kod)::int as begeni,
  (select count(*) from yorumlar y where y.urun_kod = u.kod and y.onayli)::int as yorum,
  (select round(avg(puan)::numeric, 1) from yorumlar y where y.urun_kod = u.kod and y.onayli) as puan
from urunler u where u.yayinda;
