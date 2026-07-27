import { cookies } from "next/headers";
import { verifyToken, type JwtPayload } from "./jwt";

export const TOKEN_COOKIE = "toogo_token";

export async function getSession(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdmin(): Promise<JwtPayload> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
