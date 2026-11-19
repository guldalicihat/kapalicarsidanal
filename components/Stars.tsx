// Puan yıldızları. `deger` 0–5 (ondalıklı olabilir); `secim` verilirse tıklanabilir seçici olur.
const D = "M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7z";

export default function Stars({ deger, size = 16, secim, etiket }: { deger: number; size?: number; secim?: (n: number) => void; etiket?: string }) {
  return (
    <span className="stars" role={secim ? "radiogroup" : "img"} aria-label={etiket ?? `5 üzerinden ${deger.toLocaleString("tr-TR")} puan`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const dolu = Math.max(0, Math.min(1, deger - (n - 1)));
        const svg = (
          <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <defs><linearGradient id={`st${n}-${Math.round(dolu * 100)}`}><stop offset={`${dolu * 100}%`} stopColor="#c99a3c" /><stop offset={`${dolu * 100}%`} stopColor="#e4ddcd" /></linearGradient></defs>
            <path d={D} fill={`url(#st${n}-${Math.round(dolu * 100)})`} stroke="#b88a2e" strokeWidth={0.8} strokeLinejoin="round" />
          </svg>
        );
        return secim ? (
          <button key={n} type="button" role="radio" aria-checked={Math.round(deger) === n} aria-label={`${n} yıldız`} onClick={() => secim(n)}>{svg}</button>
        ) : <span key={n}>{svg}</span>;
      })}
    </span>
  );
}
