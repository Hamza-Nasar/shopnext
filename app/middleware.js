import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // Allow public routes (login, signup, static files)
    if (
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/_next") ||
        pathname === "/"
    ) {
        return NextResponse.next();
    }

    // Get token from header
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return NextResponse.next(); // allow request to continue
    } catch (err) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
    }
}

// ✅ Apply middleware to API routes only
export const config = {
    matcher: ["/api/:path*"],
};
