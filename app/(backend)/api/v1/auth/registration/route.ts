import { NextResponse } from "next/server";
import { registerUser } from "@/app/(backend)/controllers/authController";
import { adminRoute } from "@/app/(backend)/libs/api-handler";

// Bảo vệ bằng adminRoute -> Người ngoài không thể gọi API này để tạo acc bừa bãi
export const POST = adminRoute(async (req) => {
    const data = await req.json();
    
    const newUser = await registerUser(data);
    
    return NextResponse.json(
        { message: "Admin account created successfully", user: newUser }, 
        { status: 201 }
    );
});