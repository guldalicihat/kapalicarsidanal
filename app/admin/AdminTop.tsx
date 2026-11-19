import Link from "next/link";
import { signOut } from "./actions";

export default function AdminTop({ eposta }: { eposta: string }) {
  return (
    <header className="adm-top"><div className="in">
      <Link href="/admin" className="brand">Kapalıçarşıdan Al<small>Yönetim</small></Link>
      <nav><Link href="/admin">Ürünler</Link><Link href="/admin/urun/yeni">Yeni ürün</Link><Link href="/" target="_blank">Siteyi aç ↗</Link></nav>
      <span className="who">{eposta}</span>
      <form action={signOut}><button>Çıkış</button></form>
    </div></header>
  );
}
