import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
  res.cookies.set({ name: SESSION_COOKIE, value: "", path: "/", maxAge: 0 });
  return res;
}
