import UstaSeckisi from "@/components/UstaSeckisi";
import { getCatalog } from "@/lib/db";

export const metadata = { title: "Cevat Usta'nın seçtikleri · Kapalıçarşıdan Al" };

export default async function UstaninSecimi() {
  const { products } = await getCatalog();
  const secki = products.filter((p) => p.ustaSecimi);
  return (
    <div className="shell">
      <UstaSeckisi urunler={secki} toplam={secki.length} tumu={false} />
      {!secki.length && <p className="note">Cevat Usta yakında seçkisini paylaşacak.</p>}
    </div>
  );
}
