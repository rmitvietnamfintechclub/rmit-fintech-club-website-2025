import { NextResponse } from "next/server";

// Logout không cần connect DB, không cần check quyền phức tạp
export async function GET() {
    const response = NextResponse.json(
        { message: "Logout successful", success: true },
        { status: 200 }
    );

    // Xóa cookie bằng cách set thời gian hết hạn về 0
    response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0), 
        path: "/", 
    });

    return response;
}