import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/app/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(TOKEN_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
