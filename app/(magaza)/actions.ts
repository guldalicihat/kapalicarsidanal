"use server";
// Vitrin tarafı yazma işlemleri: beğeni, yorum + puan, geri bildirim.
// Hepsi sunucuda gizli anahtarla; tarayıcı veritabanına doğrudan yazamaz.
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { serviceClient } from "@/lib/supabase/server";

const CIHAZ = /^[a-zA-Z0-9-]{8,64}$/;
const KOD = /^[A-Z0-9-]{3,20}$/;
const temiz = (s: unknown, max: number) => String(s ?? "").replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").trim().slice(0, max);

async function gunlukSayi(tablo: "yorumlar" | "geri_bildirimler", cihaz: string) {
  const { count } = await serviceClient().from(tablo).select("*", { count: "exact", head: true })
    .eq("cihaz", cihaz).gte("olusturma", new Date(Date.now() - 86_400_000).toISOString());
  return count ?? 0;
}

export async function begeniAyarla(kod: string, cihaz: string, begendi: boolean): Promise<void> {
  if (!KOD.test(kod) || !CIHAZ.test(cihaz)) return;
  const db = serviceClient();
  if (begendi) await db.from("begeniler").upsert({ urun_kod: kod, cihaz }, { onConflict: "urun_kod,cihaz", ignoreDuplicates: true });
  else await db.from("begeniler").delete().eq("urun_kod", kod).eq("cihaz", cihaz);
  revalidateTag("ilgi");
}

export type Sonuc = { ok: boolean; mesaj: string };

export async function yorumGonder(veri: { kod: string; cihaz: string; puan: number; ad: string; metin: string }): Promise<Sonuc> {
  const kod = String(veri.kod), cihaz = String(veri.cihaz), puan = Math.round(Number(veri.puan));
  const ad = temiz(veri.ad, 40), metin = temiz(veri.metin, 1000);
  if (!KOD.test(kod) || !CIHAZ.test(cihaz)) return { ok: false, mesaj: "Bir sorun oldu, sayfayı yenileyip tekrar dene." };
  if (!(puan >= 1 && puan <= 5)) return { ok: false, mesaj: "Önce yıldızlarla puan ver." };
  if (ad.length < 2) return { ok: false, mesaj: "Adını ya da bir rumuz yaz." };
  if (await gunlukSayi("yorumlar", cihaz) >= 10) return { ok: false, mesaj: "Bugün için yeterince yorum yazdın; yarın yine bekleriz." };
  const db = serviceClient();
  const { data: urun } = await db.from("urunler").select("kod").eq("kod", kod).eq("yayinda", true).maybeSingle();
  if (!urun) return { ok: false, mesaj: "Ürün bulunamadı." };
  const { error } = await db.from("yorumlar").upsert({ urun_kod: kod, cihaz, puan, ad, metin, onayli: false, olusturma: new Date().toISOString() }, { onConflict: "urun_kod,cihaz" });
  if (error) return { ok: false, mesaj: "Yorum kaydedilemedi, biraz sonra tekrar dene." };
  return { ok: true, mesaj: "Teşekkürler! Yorumun kontrol edildikten sonra yayınlanır." };
}

const KONULAR = ["tasarim", "hata", "fiyat", "pazarlik", "oneri", "diger"];

export async function geriBildirimGonder(veri: { cihaz: string; konu: string; puan?: number; metin: string; ad?: string; iletisim?: string; sayfa?: string }): Promise<Sonuc> {
  const cihaz = String(veri.cihaz), konu = String(veri.konu);
  const metin = temiz(veri.metin, 2000);
  const puan = veri.puan ? Math.round(Number(veri.puan)) : null;
  if (!CIHAZ.test(cihaz) || !KONULAR.includes(konu)) return { ok: false, mesaj: "Bir sorun oldu, sayfayı yenileyip tekrar dene." };
  if (metin.length < 3) return { ok: false, mesaj: "Birkaç kelimeyle ne düşündüğünü yaz." };
  if (puan !== null && !(puan >= 1 && puan <= 5)) return { ok: false, mesaj: "Puan 1 ile 5 arasında olmalı." };
  if (await gunlukSayi("geri_bildirimler", cihaz) >= 30) return { ok: false, mesaj: "Bugün çok sayıda bildirim gönderdin; teşekkürler, yarın devam edebilirsin." };
  const ua = temiz((await headers()).get("user-agent"), 200);
  const { error } = await serviceClient().from("geri_bildirimler").insert({
    cihaz, konu, puan, metin, ad: temiz(veri.ad, 60) || null, iletisim: temiz(veri.iletisim, 80) || null,
    sayfa: temiz(veri.sayfa, 200) || null, cihaz_bilgi: ua || null,
  });
  if (error) return { ok: false, mesaj: "Gönderilemedi, biraz sonra tekrar dene." };
  return { ok: true, mesaj: "Çok teşekkürler! Geri bildirimin ekibe ulaştı." };
}
