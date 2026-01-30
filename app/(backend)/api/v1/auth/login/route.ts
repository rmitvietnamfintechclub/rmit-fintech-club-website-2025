import { NextResponse } from "next/server";
import { loginUser } from "@/app/(backend)/controllers/authController";
import { publicRoute } from "@/app/(backend)/libs/api-handler";

export const POST = publicRoute(async (req) => {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
    }

    try {
        // Gọi controller lấy token
        const token = await loginUser(email, password);

        // Tạo response
        const response = NextResponse.json(
            { message: "Login successful" },
            { status: 200 }
        );

        // Set Cookie (HTTP Only - Chống XSS)
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Chỉ dùng HTTPS ở production
            sameSite: "strict", // Chống CSRF
            path: "/",
            maxAge: 60 * 60 * 24, // 1 ngày
        });

        return response;

    } catch (error: any) {
        // Trả về lỗi 401 cho login sai
        return NextResponse.json({ message: error.message }, { status: 401 });
    }
});