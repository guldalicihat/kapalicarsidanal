import Link from "next/link";
export default function NotFound() {
  return (
    <div className="shell"><div className="empty">
      <img src="/cevat/isinin-ehli.jpg" alt="" />
      <h1 style={{ color: "var(--emerald-2)" }}>Bu tezgâhı bulamadım</h1>
      <p>Aradığın sayfa taşınmış olabilir.</p>
      <Link href="/" className="btn btn-primary">Ana sayfaya dön</Link>
    </div></div>
  );
}
