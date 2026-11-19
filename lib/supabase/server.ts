import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const PUB = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/** Oturum (giriş) bilgisini çerezden okuyan istemci. */
export async function sessionClient() {
  const store = await cookies();
  return createServerClient(URL_, PUB, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* sunucu bileşeni */ }
      },
    },
  });
}

/** Tam yetkili istemci — YALNIZ sunucuda, yönetici doğrulandıktan sonra kullanılır. */
export function serviceClient() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SECRET_KEY tanımlı değil");
  return createClient(URL_, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
