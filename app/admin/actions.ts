"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminEmail, requireAdmin } from "@/lib/admin";
import { serviceClient, sessionClient } from "@/lib/supabase/server";

export async function sendLink(_: unknown, fd: FormData): Promise<{ ok: boolean; mesaj: string }> {
  const eposta = String(fd.get("eposta") ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(eposta)) return { ok: false, mesaj: "Geçerli bir e-posta yaz." };
  const genel = { ok: true, mesaj: "Bu adres yetkiliyse giriş bağlantısı gönderildi. E-postanı kontrol et (gereksiz kutusuna da bak)." };
  if (!(await isAdminEmail(eposta))) return genel;
  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("host")}`;
  const sb = await sessionClient();
  const { error } = await sb.auth.signInWithOtp({ email: eposta, options: { emailRedirectTo: `${origin}/admin/auth/callback`, shouldCreateUser: true } });
  if (error) return { ok: false, mesaj: `Bağlantı gönderilemedi: ${error.message}` };
  return genel;
}

export async function signOut() {
  const sb = await sessionClient();
  await sb.auth.signOut();
  redirect("/admin/giris");
}

const MILYEM: Record<number, number> = { 8: 333, 14: 585, 18: 750, 22: 916, 24: 995 };
const KOD = /^[A-Z0-9-]{3,20}$/;
const n = (v: FormDataEntryValue | null) => { const x = Number(String(v ?? "").replace(",", ".")); return Number.isFinite(x) ? x : NaN; };

export async function saveProduct(_: unknown, fd: FormData): Promise<{ ok: boolean; mesaj: string }> {
  const admin = await requireAdmin();
  const sb = serviceClient();
  const eskiKod = String(fd.get("eskiKod") ?? "");
  const kod = String(fd.get("kod") ?? "").trim().toUpperCase();
  if (!KOD.test(kod)) return { ok: false, mesaj: "Ürün kodu 3–20 karakter; yalnız büyük harf, rakam ve tire." };
  const ad = String(fd.get("ad") ?? "").trim();
  if (ad.length < 3) return { ok: false, mesaj: "Ürün adı en az 3 karakter olmalı." };
  const ayar = n(fd.get("ayar"));
  if (!MILYEM[ayar]) return { ok: false, mesaj: "Geçerli bir ayar seç." };
  const milyem = n(fd.get("milyem")) || MILYEM[ayar];
  const iscilik = n(fd.get("iscilik"));
  if (!(iscilik >= 0 && iscilik <= 1000)) return { ok: false, mesaj: "İşçilik milyemi 0–1000 arası olmalı." };
  const firsat = n(fd.get("firsat"));

  // Varyantlar
  const olculer = fd.getAll("v_olcu").map(String);
  const gramlar = fd.getAll("v_gram").map((g) => n(g));
  const stoklar = fd.getAll("v_stok").map((s) => Math.max(0, Math.floor(n(s) || 0)));
  const tedarik = fd.getAll("v_ted").map(String);
  const gunler = fd.getAll("v_gun").map((g) => n(g));
  const varyant: { urun_kod: string; olcu: string; net_mg: number; kendi_stok: number; tedarikci_stok_teyitli: boolean; tedarikci_teyit_zamani: string | null; tedarik_gun: number | null }[] = [];
  const goruldu = new Set<string>();
  for (let i = 0; i < olculer.length; i++) {
    const olcu = olculer[i].trim();
    if (!olcu) continue;
    if (goruldu.has(olcu)) return { ok: false, mesaj: `"${olcu}" ölçüsü iki kez yazılmış.` };
    goruldu.add(olcu);
    const g = gramlar[i];
    if (!(g > 0 && g < 2000)) return { ok: false, mesaj: `"${olcu}" ölçüsü için gram geçersiz.` };
    const ted = tedarik.includes(String(i));
    varyant.push({ urun_kod: kod, olcu, net_mg: Math.round(g * 1000), kendi_stok: stoklar[i] ?? 0, tedarikci_stok_teyitli: ted, tedarikci_teyit_zamani: ted ? new Date().toISOString() : null, tedarik_gun: Number.isFinite(gunler[i]) ? gunler[i] : null });
  }
  if (!varyant.length) return { ok: false, mesaj: "En az bir ölçü ve gram gir." };

  // Pırlanta
  const kategori = String(fd.get("kategori"));
  const tasTl = n(fd.get("p_tas"));
  const pirlanta = kategori === "pirlanta" || String(fd.get("p_karat") ?? "").trim()
    ? { tur: String(fd.get("p_tur") || "Doğal"), karat: String(fd.get("p_karat") ?? ""), renk: String(fd.get("p_renk") ?? ""), berraklik: String(fd.get("p_berraklik") ?? ""), kesim: String(fd.get("p_kesim") ?? ""), sertifika: String(fd.get("p_sertifika") ?? "").trim() || null, tasKurus: Number.isFinite(tasTl) ? Math.round(tasTl * 100) : 0 }
    : null;

  // Görseller
  const kalan = fd.getAll("gorsel").map(String).filter((u) => u.startsWith("http"));
  const yeni: string[] = [];
  for (const f of fd.getAll("dosya")) {
    if (!(f instanceof File) || !f.size) continue;
    if (f.size > 8 * 1024 * 1024) return { ok: false, mesaj: `${f.name} 8 MB'tan büyük.` };
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return { ok: false, mesaj: `${f.name}: yalnız JPG, PNG ya da WEBP.` };
    const yol = `${kod}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${f.type.split("/")[1]}`;
    const { error } = await sb.storage.from("urun-gorselleri").upload(yol, f, { contentType: f.type, upsert: false });
    if (error) return { ok: false, mesaj: `Fotoğraf yüklenemedi: ${error.message}` };
    yeni.push(sb.storage.from("urun-gorselleri").getPublicUrl(yol).data.publicUrl);
  }

  const kayit = {
    kod, ad, kategori, ayar, milyem, renk: String(fd.get("renk")), iscilik_milyem: iscilik,
    tedarikci_kod: String(fd.get("tedarikciKod") ?? "").trim() || null,
    olcu_turu: String(fd.get("olcuTuru") ?? "") || null,
    aciklama: String(fd.get("aciklama") ?? "").trim() || null,
    usta_notu: String(fd.get("ustaNotu") ?? "").trim() || null,
    pirlanta,
    firsat_iscilik_indirim: firsat >= 1 && firsat <= 90 ? firsat : null,
    firsat_bitis: firsat >= 1 && firsat <= 90 && String(fd.get("firsatBitis") ?? "") ? new Date(`${fd.get("firsatBitis")}:00+03:00`).toISOString() : null,
    yeni: fd.get("yeni") === "on", usta_secimi: fd.get("ustaSecimi") === "on", yayinda: fd.get("yayinda") === "on",
    gorseller: [...kalan, ...yeni], guncelleme: new Date().toISOString(), guncelleyen: admin.eposta,
  };

  if (eskiKod && eskiKod !== kod) return { ok: false, mesaj: "Var olan ürünün kodu değiştirilemez." };
  if (!eskiKod) {
    const { data: var_ } = await sb.from("urunler").select("kod").eq("kod", kod).maybeSingle();
    if (var_) return { ok: false, mesaj: `${kod} kodlu ürün zaten var.` };
  }
  const { error: e1 } = await sb.from("urunler").upsert(kayit, { onConflict: "kod" });
  if (e1) return { ok: false, mesaj: `Kaydedilemedi: ${e1.message}` };
  const { data: eskiV } = await sb.from("varyantlar").select("olcu").eq("urun_kod", kod);
  const sil = (eskiV ?? []).map((r) => r.olcu).filter((o) => !goruldu.has(o));
  if (sil.length) await sb.from("varyantlar").delete().eq("urun_kod", kod).in("olcu", sil);
  const { error: e2 } = await sb.from("varyantlar").upsert(varyant, { onConflict: "urun_kod,olcu" });
  if (e2) return { ok: false, mesaj: `Ölçüler kaydedilemedi: ${e2.message}` };

  revalidatePath("/", "layout");
  redirect(`/admin?kaydedildi=${encodeURIComponent(kod)}`);
}
