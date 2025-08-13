import { NextResponse } from "next/server";

export function middleware(req) {
  const session = req.cookies.get("session")?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const decoded = JSON.parse(Buffer.from(session, "base64").toString());

  if (req.nextUrl.pathname.startsWith("/admin") && decoded.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
