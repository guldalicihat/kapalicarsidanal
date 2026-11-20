"use client";
// Ana görselin ışık katmanı: nefes alan lamba ışığı, tepe penceresinden huzme, süzülen toz zerreleri, kenar loşluğu.
import { useEffect, useRef } from "react";

export default function HeroIsik() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const x = c.getContext("2d"); if (!x) return;
    const azalt = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sayi = innerWidth < 640 ? 10 : 18;
    const pts = Array.from({ length: sayi }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.3, v: 0.0005 + Math.random() * 0.001, d: Math.random() * 6 }));
    const boyut = () => { c.width = c.clientWidth; c.height = c.clientHeight; };
    boyut(); addEventListener("resize", boyut);
    let son = 0, id = 0;
    const ciz = (t: number) => {
      id = requestAnimationFrame(ciz);
      if (document.hidden || t - son < 40) return;
      son = t; x.clearRect(0, 0, c.width, c.height);
      for (const p of pts) {
        if (!azalt) { p.y -= p.v; p.x += Math.sin(t / 1000 + p.d) * 0.0004; if (p.y < 0) { p.y = 1; p.x = Math.random(); } }
        const huzmede = p.x > 0.38 && p.x < 0.78;
        x.fillStyle = `rgba(255,236,190,${huzmede ? 0.45 : 0.1})`;
        x.beginPath(); x.arc(p.x * c.width, p.y * c.height, p.r, 0, 7); x.fill();
      }
    };
    id = requestAnimationFrame(ciz);
    return () => { cancelAnimationFrame(id); removeEventListener("resize", boyut); };
  }, []);
  return (
    <div className="hero-isik" aria-hidden="true">
      <div className="lamba" /><div className="lamba b" />
      <div className="huzme" />
      <canvas ref={ref} className="toz" />
      <div className="vinyet" />
    </div>
  );
}
