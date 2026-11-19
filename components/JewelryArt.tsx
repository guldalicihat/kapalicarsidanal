// Ürün fotoğrafları gelene kadar kullanılan çizimler. Gerçek fotoğraf eklenince yerini alır.
import type { Art } from "@/lib/catalog";

type Tone = "Sarı altın" | "Beyaz altın" | "Rose altın";

const TONES: Record<Tone, [string, string, string, string]> = {
  "Sarı altın": ["#fff3c4", "#e7c46a", "#b8862c", "#7a5414"],
  "Beyaz altın": ["#ffffff", "#e3e6ea", "#a9b0b8", "#6b737c"],
  "Rose altın": ["#ffe4d6", "#e8ab8c", "#b8735a", "#7e4636"],
};

const pt = (cx: number, cy: number, rx: number, ry: number, a: number) => [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as const;

function Defs({ id, tone }: { id: string; tone: Tone }) {
  const [a, b, c, d] = TONES[tone];
  return (
    <defs>
      <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={a} />
        <stop offset=".35" stopColor={b} />
        <stop offset=".7" stopColor={c} />
        <stop offset="1" stopColor={d} />
      </linearGradient>
      <linearGradient id={`${id}h`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".85" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${id}s`} cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#3b2a10" stopOpacity=".22" />
        <stop offset="1" stopColor="#3b2a10" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}d`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".5" stopColor="#dfe9f2" />
        <stop offset="1" stopColor="#9fb4c6" />
      </linearGradient>
    </defs>
  );
}

function ringPath(cx: number, cy: number, rx: number, ry: number, t: number) {
  const ix = rx - t, iy = ry - t * 0.62;
  return `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${2 * rx} 0 a ${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z M ${cx - ix} ${cy - 2} a ${ix} ${iy} 0 1 0 ${2 * ix} 0 a ${ix} ${iy} 0 1 0 ${-2 * ix} 0 Z`;
}

function Ring({ id, art }: { id: string; art: Art }) {
  const cx = 100, cy = 80, rx = 64, ry = 34;
  const thin = art === "toplu" || art === "tektas" || art === "bestas";
  const t = art === "cizgili" || art === "orgu" ? 15 : thin ? 7 : 11; // üst yüz genişliği
  const h = art === "cizgili" || art === "dovme" ? 14 : 10; // bant yüksekliği
  const g = `url(#${id}g)`;
  const top = ringPath(cx, cy, rx, ry, t);
  const layers = Array.from({ length: h }, (_, i) => h - i);
  const pattern: React.ReactNode[] = [];
  if (art === "burgu") for (let x = 20; x < 190; x += 7) pattern.push(<line key={x} x1={x} y1={30} x2={x + 22} y2={130} stroke="#6f4b12" strokeOpacity=".45" strokeWidth="2.2" />);
  if (art === "burgu") for (let x = 22; x < 190; x += 7) pattern.push(<line key={"h" + x} x1={x} y1={30} x2={x + 22} y2={130} stroke="#fff" strokeOpacity=".45" strokeWidth="1" />);
  if (art === "orgu") for (let x = 0; x < 200; x += 9) { pattern.push(<line key={"a" + x} x1={x} y1={30} x2={x + 26} y2={130} stroke="#6f4b12" strokeOpacity=".4" strokeWidth="2" />); pattern.push(<line key={"b" + x} x1={x + 26} y1={30} x2={x} y2={130} stroke="#6f4b12" strokeOpacity=".4" strokeWidth="2" />); }
  if (art === "cizgili") [4, 8, 12].forEach((d) => pattern.push(<ellipse key={d} cx={cx} cy={cy - 1} rx={rx - d} ry={ry - d * 0.62} fill="none" stroke="#6f4b12" strokeOpacity=".4" strokeWidth="1.1" />));
  if (art === "dovme") for (let i = 0; i < 70; i++) { const a = (i / 70) * Math.PI * 2, rr = rx - 3 - (i % 3) * 3; const [x, y] = pt(cx, cy - 1, rr, ry - (rx - rr) * 0.62, a); pattern.push(<ellipse key={i} cx={x} cy={y} rx="2.6" ry="1.6" fill={i % 2 ? "#fff" : "#6f4b12"} opacity={i % 2 ? 0.55 : 0.25} />); }
  return (
    <g>
      <defs><clipPath id={`${id}c`}><path d={top} clipRule="evenodd" /></clipPath></defs>
      <ellipse cx={cx} cy={cy + h + 26} rx={74} ry={11} fill={`url(#${id}s)`} />
      {layers.map((i) => <path key={i} d={top} transform={`translate(0 ${i})`} fill={i > h - 2 ? "#5d400f" : `url(#${id}g)`} fillRule="evenodd" opacity={i > h - 2 ? 0.55 : 1} style={{ filter: "brightness(.78)" }} />)}
      <path d={top} fill={g} fillRule="evenodd" />
      <g clipPath={`url(#${id}c)`}>
        {pattern}
        <ellipse cx={cx - 18} cy={cy - ry + 4} rx={38} ry={6} fill="#fff" opacity=".55" />
      </g>
      {art === "capraz" && <path d={ringPath(cx, cy - 3, rx - 3, ry - 6, 6)} fill={g} fillRule="evenodd" transform={`rotate(-9 ${cx} ${cy})`} stroke="#6f4b12" strokeOpacity=".3" strokeWidth=".6" />}
      {art === "toplu" && Array.from({ length: 26 }).map((_, i) => {
        const a = (i / 26) * Math.PI * 2; const [x, y] = pt(cx, cy - 1, rx - 3.5, ry - 2.2, a);
        return <g key={i}><circle cx={x} cy={y} r="5.4" fill={g} stroke="#6f4b12" strokeOpacity=".35" strokeWidth=".7" /><circle cx={x - 1.6} cy={y - 1.8} r="1.6" fill="#fff" opacity=".8" /></g>;
      })}
      {art === "tektas" && (
        <g transform={`translate(${cx} ${cy - ry - 4})`}>
          <path d="M -8 10 L -11 -2 M 8 10 L 11 -2 M -3 10 L -5 -4 M 3 10 L 5 -4" stroke={g} strokeWidth="2.6" strokeLinecap="round" />
          <polygon points="-15,-6 -8,-17 8,-17 15,-6 0,12" fill={`url(#${id}d)`} stroke="#8aa0b4" strokeWidth=".8" />
          <path d="M -15 -6 H 15 M -8 -17 L -4 -6 L 0 12 M 8 -17 L 4 -6 L 0 12 M 0 -17 V -6" stroke="#8aa0b4" strokeWidth=".55" fill="none" />
          <circle cx="-5" cy="-11" r="2" fill="#fff" />
        </g>
      )}
      {art === "bestas" && [-28, -14, 0, 14, 28].map((dx, i) => {
        const [x, y] = pt(cx, cy - 1, rx - 3.5, ry - 2.2, -Math.PI / 2 + dx / 64);
        return <g key={i}><circle cx={x} cy={y} r={6} fill={`url(#${id}d)`} stroke="#8aa0b4" strokeWidth=".8" /><circle cx={x - 2} cy={y - 2} r="1.5" fill="#fff" /></g>;
      })}
    </g>
  );
}

function Bracelet({ id, hasir }: { id: string; hasir?: boolean }) {
  const g = `url(#${id}g)`;
  return (
    <g>
      <ellipse cx="100" cy="130" rx="78" ry="11" fill={`url(#${id}s)`} />
      <ellipse cx="100" cy="88" rx="72" ry="34" fill="none" stroke={g} strokeWidth="20" />
      {Array.from({ length: 30 }).map((_, i) => {
        const t = (i / 30) * Math.PI * 2;
        const [x, y] = pt(100, 88, 72, 34, t);
        return hasir ? (
          <g key={i} opacity={Math.sin(t) > -0.3 ? 0.55 : 0.2}>
            <line x1={x - 4} y1={y - 8} x2={x + 4} y2={y + 8} stroke="#6f4b12" strokeWidth=".8" />
            <line x1={x + 4} y1={y - 8} x2={x - 4} y2={y + 8} stroke="#6f4b12" strokeWidth=".8" />
          </g>
        ) : (
          <line key={i} x1={x - 6} y1={y - 8} x2={x + 6} y2={y + 8} stroke="#6f4b12" strokeOpacity={Math.sin(t) > -0.3 ? 0.4 : 0.15} strokeWidth="1.4" />
        );
      })}
      <path d="M 34 76 Q 100 40 166 76" fill="none" stroke={`url(#${id}h)`} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Chain({ id, art }: { id: string; art: Art }) {
  const g = `url(#${id}g)`;
  if (art === "bileklik") {
    const pts = Array.from({ length: 25 }, (_, i) => {
      const t = i / 24;
      return [24 + t * 152, 72 + Math.sin(t * Math.PI) * 44] as const;
    });
    return (
      <g>
        <ellipse cx="100" cy="140" rx="80" ry="8" fill={`url(#${id}s)`} />
        <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={g} strokeWidth="2.2" />
        {pts.filter((_, i) => i % 4 === 2).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5.5" fill={g} stroke="#7a5414" strokeOpacity=".3" />)}
        <rect x="16" y="66" width="12" height="7" rx="3" fill={g} />
      </g>
    );
  }
  const thick = art === "halat";
  const d = "M 40 18 Q 52 96 100 112 Q 148 96 160 18";
  return (
    <g>
      <path d={d} fill="none" stroke={g} strokeWidth={thick ? 7 : 2.4} />
      {thick && <path d={d} fill="none" stroke="#7a5414" strokeOpacity=".45" strokeWidth="7" strokeDasharray="2 4" />}
      {!thick && (
        <g transform="translate(100 112)">
          <circle r="3.5" fill={g} />
          <path d="M 0 4 C 18 22 16 48 0 56 C -16 48 -18 22 0 4 Z" fill={g} stroke="#7a5414" strokeOpacity=".4" />
          <path d="M 0 14 C 9 24 8 40 0 46 C -8 40 -9 24 0 14 Z" fill="none" stroke="#7a5414" strokeOpacity=".45" />
          <circle cy="31" r="3" fill="#fff" opacity=".7" />
        </g>
      )}
    </g>
  );
}

function Earrings({ id, art }: { id: string; art: Art }) {
  const g = `url(#${id}g)`;
  const one = (x: number) =>
    art === "halka" ? (
      <g key={x}>
        <ellipse cx={x} cy="88" rx="28" ry="36" fill="none" stroke={g} strokeWidth="8" />
        {Array.from({ length: 14 }).map((_, i) => {
          const t = (i / 14) * Math.PI * 2;
          const [px, py] = pt(x, 88, 28, 36, t);
          return <rect key={i} x={px - 2} y={py - 2} width="4" height="4" fill="#fff" opacity=".5" transform={`rotate(45 ${px} ${py})`} />;
        })}
      </g>
    ) : (
      <g key={x}>
        <path d={`M ${x} 22 q 8 0 8 10`} fill="none" stroke={g} strokeWidth="2.4" />
        <circle cx={x} cy="44" r="5" fill={g} />
        <line x1={x} y1="49" x2={x} y2="68" stroke={g} strokeWidth="2.2" />
        <circle cx={x} cy="96" r="26" fill={g} stroke="#7a5414" strokeOpacity=".35" />
        {[-14, 0, 14].map((dy) => <ellipse key={dy} cx={x} cy={96 + dy * 0.6} rx="25" ry="6" fill="none" stroke="#7a5414" strokeOpacity=".35" />)}
        {[-12, 0, 12].map((dx) => <ellipse key={dx} cx={x + dx * 0.6} cy="96" rx="6" ry="25" fill="none" stroke="#7a5414" strokeOpacity=".35" />)}
        <circle cx={x - 8} cy="86" r="4" fill="#fff" opacity=".6" />
      </g>
    );
  return (
    <g>
      <ellipse cx="100" cy="140" rx="70" ry="7" fill={`url(#${id}s)`} />
      {one(68)}
      {one(132)}
    </g>
  );
}

export default function JewelryArt({ art, tone = "Sarı altın", size = "100%", id }: { art: Art; tone?: Tone; size?: string | number; id: string }) {
  const safe = id.replace(/[^a-z0-9]/gi, "");
  let body: React.ReactNode;
  if (["burgu", "cizgili", "dovme", "capraz", "orgu", "toplu", "tektas", "bestas"].includes(art)) body = <Ring id={safe} art={art} />;
  else if (art === "bilezik" || art === "hasir") body = <Bracelet id={safe} hasir={art === "hasir"} />;
  else if (art === "kupe" || art === "halka") body = <Earrings id={safe} art={art} />;
  else body = <Chain id={safe} art={art} />;
  return (
    <svg viewBox="0 0 200 160" width={size} role="img" aria-hidden="true" style={{ maxWidth: "100%" }}>
      <Defs id={safe} tone={tone} />
      {body}
    </svg>
  );
}
