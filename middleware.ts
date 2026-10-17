import { NextRequest, NextResponse } from "next/server";
import { COOKIE, verifySession } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/");

  if (pathname === "/admin/login") return NextResponse.next();
  if (isApi && req.method === "GET" && pathname.startsWith("/api/projects"))
    return NextResponse.next();
  if (await verifySession(req.cookies.get(COOKIE)?.value))
    return NextResponse.next();

  if (isApi)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/projects/:path*", "/api/upload"],
};
