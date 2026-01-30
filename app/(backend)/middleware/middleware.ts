// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "../libs/auth";

export async function middleware(request: NextRequest) {
    // Logic chặn các trang Admin UI hoặc các route đặc biệt khác
    // Lưu ý: Đã bỏ api route ra khỏi config bên dưới để tránh conflict với publicRoute
    const isAdmin = await requireAdmin(request);
    
    if (!isAdmin) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
		
    ],
};