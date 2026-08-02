import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/* routes
  if (pathname.startsWith("/admin")) {
    // Check for the lightweight indicator cookie set by the AuthContext or Mock Mode
    const hasSession = request.cookies.get("delight_has_session");
    
    if (!hasSession) {
      // Redirect to storefront if not logged in
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("auth", "login"); // Tell storefront to open AuthModal
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware only to /admin and /account routes
  matcher: ["/admin/:path*", "/account/:path*"],
};
