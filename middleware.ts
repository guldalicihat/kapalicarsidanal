import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Yalnız /admin yollarında oturum çerezini tazeler; giriş yoksa giriş sayfasına yönlendirir.
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const sb = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await sb.auth.getUser();
  const acik = req.nextUrl.pathname.startsWith("/admin/giris") || req.nextUrl.pathname.startsWith("/admin/auth");
  if (!data.user && !acik) return NextResponse.redirect(new URL("/admin/giris", req.url));
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
