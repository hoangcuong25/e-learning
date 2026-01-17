/* eslint-disable @typescript-eslint/no-unused-vars */
// middleware.ts
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_REFRESH_TOKEN_SECRET!);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("refresh_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role;

    // Kiểm tra role nếu truy cập /admin
    if (request.nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Kiểm tra role nếu truy cập /host
    if (request.nextUrl.pathname.startsWith("/instructor") && role !== "  INSTRUCTOR") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/instructor/:path*"],
};
