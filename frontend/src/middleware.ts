/* eslint-disable @typescript-eslint/no-unused-vars */
// middleware.ts
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_REFRESH_TOKEN_SECRET!);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ai cũng có thể vào những trang này
  const publicRoutes = [
    "/instructor/become",
    "/instructor/apply",
    "/instructor/status",
  ];

  // 🔹 Nếu URL nằm trong danh sách public -> cho phép truy cập
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("refresh_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role;

    // 🔹 Chặn nếu không phải admin mà vào /admin
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 🔹 Chặn nếu không phải instructor mà vào /instructor (trừ /instructor/become ở trên)
    if (pathname.startsWith("/instructor") && role !== "INSTRUCTOR") {
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
