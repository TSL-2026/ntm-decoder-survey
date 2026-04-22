import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (!path.startsWith("/admin") && !path.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const auth = req.headers.get("authorization");

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (auth) {
    const [type, encoded] = auth.split(" ");

    if (type === "Basic") {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(":");

      if (user === username && pass === password) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
