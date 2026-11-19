"use client";
// Önizlemede favoriler ve sepet yalnız bu tarayıcıda tutulur (gerçek hesapta sunucuya taşınacak).
import { useEffect, useState, useCallback } from "react";
import { begeniAyarla } from "@/app/(magaza)/actions";

type Line = { kod: string; olcu: string; adet: number };
const KEY = { fav: "ka.fav", cart: "ka.cart", cihaz: "ka.cihaz" };
const EVT = "ka-store";

function read<T>(k: string, d: T): T {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; }
}
function write(k: string, v: unknown) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* gizli pencere */ }
  window.dispatchEvent(new Event(EVT));
}

/** Bu tarayıcıya özel rastgele kimlik (beğeni/yorum tekrarını önlemek için; kişisel bilgi değil). */
export function cihazId(): string {
  try {
    let id = localStorage.getItem(KEY.cihaz);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(KEY.cihaz, id); }
    return id;
  } catch { return "gizli-pencere-0000"; }
}

export function useStore() {
  const [fav, setFav] = useState<string[]>([]);
  const [cart, setCart] = useState<Line[]>([]);
  useEffect(() => {
    const sync = () => { setFav(read(KEY.fav, [])); setCart(read(KEY.cart, [])); };
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener("storage", sync); };
  }, []);
  const toggleFav = useCallback((kod: string) => {
    const cur = read<string[]>(KEY.fav, []);
    const begendi = !cur.includes(kod);
    write(KEY.fav, begendi ? [...cur, kod] : cur.filter((k) => k !== kod));
    begeniAyarla(kod, cihazId(), begendi).catch(() => { /* sayım sonra tutar */ });
  }, []);
  const addToCart = useCallback((kod: string, olcu: string) => {
    const cur = read<Line[]>(KEY.cart, []);
    const i = cur.findIndex((l) => l.kod === kod && l.olcu === olcu);
    if (i >= 0) cur[i].adet += 1; else cur.push({ kod, olcu, adet: 1 });
    write(KEY.cart, cur);
  }, []);
  const removeFromCart = useCallback((kod: string, olcu: string) => {
    write(KEY.cart, read<Line[]>(KEY.cart, []).filter((l) => !(l.kod === kod && l.olcu === olcu)));
  }, []);
  return { fav, cart, toggleFav, addToCart, removeFromCart, cartCount: cart.reduce((s, l) => s + l.adet, 0) };
}
