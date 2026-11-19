import { NextResponse, type NextRequest } from "next/server";
import { sessionClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (code) {
    const sb = await sessionClient();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.redirect(new URL("/admin/giris?hata=baglanti", req.url));
}
