"use client";
import { useEffect, useState } from "react";
import { split } from "@/lib/campaign";

const two = (n: number) => String(n).padStart(2, "0");

export default function Countdown({ until, onEnd }: { until: number; onEnd?: () => void }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const left = now === null ? null : until - now;
  useEffect(() => { if (left !== null && left <= 0) onEnd?.(); }, [left, onEnd]);
  if (left === null) return <span className="countdown" aria-hidden="true"><span>--</span>:<span>--</span>:<span>--</span></span>;
  const { h, m, s } = split(left);
  return (
    <span className="countdown" role="timer" aria-label={`${h} saat ${m} dakika ${s} saniye`}>
      {h > 0 && <><span>{two(h)}</span>:</>}<span>{two(m)}</span>:<span>{two(s)}</span>
    </span>
  );
}
