"use client";
// İlk girişte kısa "çarşı kapısı açılır" karşılaması. Daha önce görülmüşse <head>'deki betik
// sayfa çizilmeden gizler; dokununca hemen geçer; hareket azaltma ayarında hiç çıkmaz.
import { useEffect, useState } from "react";

export default function CarsiKapisi() {
  const [acik, setAcik] = useState(false);
  const [bitti, setBitti] = useState(false);
  useEffect(() => {
    if (document.documentElement.classList.contains("kapi-gordu")) { setBitti(true); return; }
    try { localStorage.setItem("ka.kapi", "1"); } catch { /* */ }
    const a = setTimeout(() => setAcik(true), 450);
    const b = setTimeout(() => setBitti(true), 1700);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  if (bitti) return null;
  return (
    <div className={`kapi${acik ? " acik" : ""}`} onClick={() => setBitti(true)} role="presentation">
      <div className="kapi-kanat sol" /><div className="kapi-kanat sag" />
      <div className="kapi-yazi"><span>Hoş geldin</span><b>Kapalıçarşıdan Al</b></div>
    </div>
  );
}
