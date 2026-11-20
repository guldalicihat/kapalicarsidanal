// Asılı pirinç-cam Osmanlı feneri ve altına düşen ışık havuzu (dekoratif).
export default function Fener() {
  return (
    <div className="fener-yeri" aria-hidden="true">
      <svg className="fener" width="34" height="70" viewBox="0 0 60 120">
        <line x1="30" y1="0" x2="30" y2="34" stroke="#7a5a1a" strokeWidth="2" />
        <path d="M18 34h24l4 10H14z" fill="#b88a2e" />
        <path d="M16 44h28v38H16z" fill="rgba(255,214,140,.9)" stroke="#8a6620" strokeWidth="2" />
        <path d="M22 44v38M30 44v38M38 44v38" stroke="#8a6620" strokeWidth="1.5" />
        <path d="M14 82h32l-6 10H20z" fill="#b88a2e" />
        <circle cx="30" cy="96" r="3" fill="#8a6620" />
      </svg>
      <span className="havuz" />
    </div>
  );
}
