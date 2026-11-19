-- Admin paneline girebilecek e-postalar. Yalnız sunucu (gizli anahtar) okur.
create table if not exists yoneticiler (
  eposta text primary key,
  ad text,
  rol text not null default 'sahip',
  olusturma timestamptz not null default now()
);
alter table yoneticiler enable row level security;
insert into yoneticiler(eposta, ad, rol) values ('guldaliciat@gmail.com', 'İşletme sahibi', 'sahip')
  on conflict (eposta) do nothing;

alter table urunler add column if not exists guncelleyen text;

-- Ürün görselleri: herkese açık okuma, yazma yalnız sunucudan.
insert into storage.buckets (id, name, public) values ('urun-gorselleri', 'urun-gorselleri', true)
  on conflict (id) do nothing;
