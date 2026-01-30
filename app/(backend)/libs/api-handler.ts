import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "./auth";
import connectMongoDb from "@/app/(backend)/libs/mongodb";

type RouteHandler = (req: NextRequest, context: { params: any }) => Promise<NextResponse>;

// Wrapper cho Public Route (GET)
export function publicRoute(handler: RouteHandler) {
    return async (req: NextRequest, context: { params: any }) => {
        try {
            await connectMongoDb();
            return await handler(req, context);
        } catch (error: any) {
            return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
        }
    };
}

// Wrapper cho Admin Route (POST/PUT/DELETE)
export function adminRoute(handler: RouteHandler) {
    return async (req: NextRequest, context: { params: any }) => {
        const isAdmin = await requireAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: "Admin access required" }, { status: 403 });
        }

        try {
            await connectMongoDb();
            return await handler(req, context);
        } catch (error: any) {
            return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
        }
    };
}