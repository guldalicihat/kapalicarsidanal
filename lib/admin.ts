import "server-only";
import { redirect } from "next/navigation";
import { serviceClient, sessionClient } from "./supabase/server";

export async function currentAdmin(): Promise<{ eposta: string; ad: string | null } | null> {
  const sb = await sessionClient();
  const { data } = await sb.auth.getUser();
  const eposta = data.user?.email?.toLowerCase();
  if (!eposta) return null;
  const { data: row } = await serviceClient().from("yoneticiler").select("eposta,ad").eq("eposta", eposta).maybeSingle();
  return row ?? null;
}

export async function requireAdmin() {
  const a = await currentAdmin();
  if (!a) redirect("/admin/giris");
  return a;
}

export async function isAdminEmail(eposta: string) {
  const { data } = await serviceClient().from("yoneticiler").select("eposta").eq("eposta", eposta.toLowerCase()).maybeSingle();
  return !!data;
}
