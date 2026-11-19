"use client";
import { useEffect, useState } from "react";
import Countdown from "./Countdown";
import { campaignEnd } from "@/lib/campaign";

export default function DealTimer({ label = "Bitmesine" }: { label?: string }) {
  const [end, setEnd] = useState<number | null>(null);
  useEffect(() => setEnd(campaignEnd(Date.now())), []);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-2)" }}>
      {label} {end ? <Countdown until={end} onEnd={() => setEnd(campaignEnd(Date.now() + 1000))} /> : <span className="countdown"><span>--</span></span>}
    </span>
  );
}
