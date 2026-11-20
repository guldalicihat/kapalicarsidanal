"use client";
// Satın alma çubuğunun üstünde Cevat Usta'dan sohbet gibi kısa teşvikler. Yalnız doğru bilgiler
// (stok, fırsat süresi, Altın Lira, pazarlık imkânı); sahte aciliyet yok. Kapatılırsa bu oturumda çıkmaz.
import { useEffect, useState } from "react";
import Yaziyor from "./Yaziyor";

export default function UstaDurtme({ mesajlar }: { mesajlar: string[] }) {
  const [acik, setAcik] = useState(false);
  const [i, setI] = useState(0);
  useEffect(() => {
    try { if (sessionStorage.getItem("ka.durtme") === "kapali") return; } catch { /* */ }
    const t = setTimeout(() => setAcik(true), 3500);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!acik || mesajlar.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % mesajlar.length), 11000);
    return () => clearInterval(t);
  }, [acik, mesajlar.length]);
  if (!acik || !mesajlar.length) return null;
  const kapat = () => { setAcik(false); try { sessionStorage.setItem("ka.durtme", "kapali"); } catch { /* */ } };
  return (
    <div className="durtme" role="status">
      <img src="/cevat/portre.jpg" alt="" />
      <div className="durtme-b"><Yaziyor key={i} metin={mesajlar[i]} gecikme={600} /></div>
      <button className="durtme-x" onClick={kapat} aria-label="Cevat Usta'nın mesajını kapat">×</button>
    </div>
  );
}
