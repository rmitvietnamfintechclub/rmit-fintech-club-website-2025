import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "./auth"; // Đảm bảo đường dẫn đúng
import connectMongoDb from "@/app/(backend)/libs/mongodb";

type RouteHandler = (req: NextRequest, context: { params: any }) => Promise<NextResponse>;

const handleError = (error: any) => {
    console.error("API Error:", error);

    if (error.name === "CastError") {
        return NextResponse.json(
            { message: `Invalid ${error.path}: ${error.value}` },
            { status: 400 } // Bad Request
        );
    }

    if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((val: any) => val.message);
        return NextResponse.json(
            { message: "Validation Error", errors: messages },
            { status: 400 }
        );
    }

    if (error.code === 11000) {
        return NextResponse.json(
            { message: "Duplicate value entered for unique field" },
            { status: 409 }
        );
    }

    return NextResponse.json(
        { message: error.message || "Internal Server Error" },
        { status: 500 }
    );
};

export function publicRoute(handler: RouteHandler) {
    return async (req: NextRequest, context: { params: any }) => {
        try {
            await connectMongoDb();
            return await handler(req, context);
        } catch (error: any) {
            return handleError(error);
        }
    };
}

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
            return handleError(error);
        }
    };
}