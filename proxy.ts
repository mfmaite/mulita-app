import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

const publicPaths = ["/ingresar", "/registro", "/opengraph-image", "/apple-icon"];

export function proxy(request: NextRequest) {
  const isPublic = publicPaths.includes(request.nextUrl.pathname);

  if (!isPublic && !getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/ingresar", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
