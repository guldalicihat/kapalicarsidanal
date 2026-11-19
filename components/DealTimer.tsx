"use client";
import { useEffect, useState } from "react";
import Countdown from "./Countdown";
import { campaignEnd } from "@/lib/campaign";

export default function DealTimer({ label = "Bitmesine", bitis }: { label?: string; bitis?: string }) {
  const [end, setEnd] = useState<number | null>(null);
  useEffect(() => setEnd(bitis ? Date.parse(bitis) : campaignEnd(Date.now())), [bitis]);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-2)" }}>
      {label} {end ? <Countdown until={end} onEnd={() => { if (!bitis) setEnd(campaignEnd(Date.now() + 1000)); }} /> : <span className="countdown"><span>--</span></span>}
    </span>
  );
}
