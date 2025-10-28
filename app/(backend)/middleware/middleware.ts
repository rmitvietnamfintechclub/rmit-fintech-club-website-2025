import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Require authentication
export async function requireAuth(request: NextRequest) {
	const token = request.cookies.get("token")?.value || "";
	if (!token) return null;
	try {
		const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
		const { payload } = await jwtVerify(token, secretKey, {
			algorithms: ["HS256"],
		});
		return payload;
	} catch {
		return null;
	}
}

// Require admin role
export async function requireAdmin(request: NextRequest) {
	const payload = await requireAuth(request);
	return payload?.role === "admin";
}

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const isPublicPath = path === "/login" || path === "/signup";

	// Allow public paths
	if (isPublicPath) {
		return NextResponse.next();
	}

	// For protected paths, require admin
	const isAdmin = await requireAdmin(request);
	if (!isAdmin) {
		return NextResponse.redirect(new URL("/login", request.nextUrl));
	}
	return NextResponse.next();
}

// It specifies the paths for which this middleware should be executed.
export const config = {
	matcher: [
		"/api/v1/managementBoard",
	],
};
