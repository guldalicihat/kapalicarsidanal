// Örnek kampanya: herkes için aynı bitiş anı (her Pazar 21:00 TRT = 18:00 UTC).
// Gerçek sistemde bitiş anı sunucudaki kampanya kaydından gelir; tarayıcı yalnız gösterir.
export function campaignEnd(now: number): number {
  const d = new Date(now);
  const day = d.getUTCDay(); // 0 = Pazar
  const end = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + ((7 - day) % 7), 18, 0, 0);
  return end > now ? end : end + 7 * 86_400_000;
}

export function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { h: Math.floor(s / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}
