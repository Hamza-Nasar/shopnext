import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("token")?.value || null;
    const { pathname } = req.nextUrl;

    // ✅ Protected routes
    const protectedPaths = ["/dashboard", "/dashboard/add-product", "/dashboard/edit-product"];

    const isProtected = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );

    // 🚫 If user is not logged in & trying to access protected page
    if (isProtected && !token) {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    // 🧭 If user already logged in & tries to access /login or /register, redirect to dashboard
    if (token && (pathname === "/login" || pathname === "/register")) {
        const dashboardUrl = new URL("/dashboard", req.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
        "/register",
    ],
};
