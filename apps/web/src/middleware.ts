import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protege as rotas do painel: sem cookie de sessão → manda pro login
export function middleware(req: NextRequest) {
  const token = req.cookies.get("js_session")?.value;
  if (!token) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/painel/:path*",
    "/galeria/:path*",
    "/avisos/:path*",
    "/calendario/:path*",
    "/js/:path*",
    "/estrutura/:path*",
  ],
};

