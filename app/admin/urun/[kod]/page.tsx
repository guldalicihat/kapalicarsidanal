import { notFound } from "next/navigation";
import AdminTop from "../../AdminTop";
import ProductForm, { type FormUrun } from "./ProductForm";
import { requireAdmin } from "@/lib/admin";
import { serviceClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function UrunDuzenle({ params }: { params: Promise<{ kod: string }> }) {
  const admin = await requireAdmin();
  const { kod } = await params;
  let urun: FormUrun | null = null;
  if (kod !== "yeni") {
    const { data } = await serviceClient().from("urunler").select("*,varyantlar(olcu,net_mg,kendi_stok,tedarikci_stok_teyitli,tedarik_gun)").eq("kod", kod).maybeSingle();
    if (!data) notFound();
    urun = data as FormUrun;
  }
  const { data: altin } = await serviceClient().from("altin_fiyatlari").select("has_satis_kurus,kaynak,zaman").order("zaman", { ascending: false }).limit(1).maybeSingle();
  return (
    <>
      <AdminTop eposta={admin.eposta} />
      <div className="adm-main">
        <ProductForm urun={urun} kategoriler={CATEGORIES.map((c) => ({ slug: c.slug, ad: c.ad }))} hasKurus={altin?.has_satis_kurus ?? 615000} altinKaynak={altin?.kaynak ?? "örnek"} />
      </div>
    </>
  );
}
