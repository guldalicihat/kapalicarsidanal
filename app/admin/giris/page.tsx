"use client";
import { useActionState } from "react";
import { sendLink } from "../actions";

export default function Giris() {
  const [s, act, bekle] = useActionState(sendLink, null);
  return (
    <div className="login">
      <form className="box" action={act}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 18 }}>
          <img src="/cevat/isinin-ehli.jpg" alt="" />
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, color: "var(--emerald-2)" }}>Kapalıçarşıdan Al</div>
            <div className="note">Yönetim paneli</div>
          </div>
        </div>
        <label className="f" htmlFor="eposta">E-posta adresin
          <input id="eposta" name="eposta" type="email" autoComplete="email" required placeholder="ornek@gmail.com" />
        </label>
        <button className="btn btn-primary btn-block" style={{ marginTop: 14 }} disabled={bekle}>{bekle ? "Gönderiliyor…" : "Giriş bağlantısı gönder"}</button>
        {s && <div className={`notice ${s.ok ? "ok" : "err"}`} style={{ marginTop: 14, marginBottom: 0 }}>{s.mesaj}</div>}
        <p className="note" style={{ marginTop: 14, marginBottom: 0 }}>Şifre yok: e-postana gelen bağlantıya dokununca panel açılır. Bağlantı 1 saat geçerli.</p>
      </form>
    </div>
  );
}
