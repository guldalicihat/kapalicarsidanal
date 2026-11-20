"use client";
// Cevat Usta'nın sözü "yazıyor…" göstergesiyle başlar, sonra harf harf yazılır — sohbet gibi.
// Yer önceden ayrılır (sayfa zıplamaz); ekran okuyucu tam metni hemen duyar; "hareketi azalt"ta beklemeden görünür.
import { useEffect, useRef, useState } from "react";

export default function Yaziyor({ metin, gecikme = 700 }: { metin: string; gecikme?: number }) {
  const kutu = useRef<HTMLSpanElement>(null);
  const [asama, setAsama] = useState<"bekle" | "yaziyor" | "yaz" | "bitti">("bekle");
  const [n, setN] = useState(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) { setAsama("bitti"); return; }
    const el = kutu.current; if (!el) return;
    const io = new IntersectionObserver((g) => { if (g[0].isIntersecting) { setAsama("yaziyor"); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(el); return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (asama === "yaziyor") { const t = setTimeout(() => setAsama("yaz"), gecikme); return () => clearTimeout(t); }
    if (asama === "yaz") {
      // Uzun metin de en fazla ~2,2 sn sürsün.
      const adim = Math.max(1, Math.ceil(metin.length / 90));
      const t = setInterval(() => setN((x) => { const y = x + adim; if (y >= metin.length) { clearInterval(t); setAsama("bitti"); } return Math.min(y, metin.length); }), 24);
      return () => clearInterval(t);
    }
  }, [asama, gecikme, metin.length]);

  const gorunen = asama === "bitti" ? metin : asama === "yaz" ? metin.slice(0, n) : "";
  return (
    <span className="yaziyor" ref={kutu}>
      <span className="yz-yer" aria-hidden="true">{metin}</span>
      <span className="yz-ust" aria-hidden="true">
        {(asama === "bekle" || asama === "yaziyor") ? <span className="yz-nokta"><i /><i /><i /><em>Cevat Usta yazıyor</em></span> : <>{gorunen}{asama === "yaz" && <span className="yz-imlec" />}</>}
      </span>
      <span className="sr-only">{metin}</span>
    </span>
  );
}
