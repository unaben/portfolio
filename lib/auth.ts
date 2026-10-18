import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "admin_session";
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET ?? "");

export const signSession = () =>
  new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(key());

export async function verifySession(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, key());
    return true;
  } catch {
    return false;
  }
}
