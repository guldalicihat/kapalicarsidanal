import "./admin.css";
export const metadata = { title: "Yönetim · Kapalıçarşıdan Al", robots: { index: false, follow: false } };
export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="adm">{children}</div>;
}
