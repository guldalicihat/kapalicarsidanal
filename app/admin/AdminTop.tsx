import Link from "next/link";
import { signOut } from "./actions";

export default function AdminTop({ eposta }: { eposta: string }) {
  return (
    <header className="adm-top"><div className="in">
      <Link href="/admin" className="brand">Kapalıçarşıdan Al<small>Yönetim</small></Link>
      <nav><Link href="/admin">Ürünler</Link><Link href="/admin/yorumlar">Yorumlar</Link><Link href="/admin/geri-bildirim">Geri bildirim</Link><Link href="/" target="_blank">Siteyi aç ↗</Link></nav>
      <span className="who" title={eposta}>{eposta.split("@")[0]}</span>
      <form action={signOut}><button>Çıkış</button></form>
    </div></header>
  );
}
