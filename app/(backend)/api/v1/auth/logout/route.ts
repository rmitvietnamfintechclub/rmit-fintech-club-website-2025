import { NextResponse } from "next/server";

export async function POST() { // Đổi GET thành POST
    const response = NextResponse.json(
        { message: "Logout successful", success: true },
        { status: 200 }
    );

    response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0), 
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    return response;
}