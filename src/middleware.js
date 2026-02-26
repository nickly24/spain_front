import { NextResponse } from "next/server";

const ADMIN_PATH_PREFIX = "/admin";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PATH_PREFIX)) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("mg_admin_auth");
  const isAuthed = cookie?.value === "1";

  if (!isAuthed && pathname !== "/admin/login") {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthed && pathname === "/admin/login") {
    const nextUrl = req.nextUrl.clone();
    nextUrl.pathname = "/admin";
    nextUrl.searchParams.delete("next");
    return NextResponse.redirect(nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

