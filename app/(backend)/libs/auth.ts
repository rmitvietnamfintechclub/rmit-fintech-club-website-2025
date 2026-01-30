// src/lib/auth.ts
import { type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Logic verify token gốc
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

// Logic check role admin
export async function requireAdmin(request: NextRequest) {
    const payload = await requireAuth(request);
    return payload?.role === "admin";
}