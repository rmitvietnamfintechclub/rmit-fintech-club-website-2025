// src/lib/auth.ts
import { type NextRequest } from "next/server";
import { jwtVerify } from "jose";

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

// 2. Helper: Verify token từ chuỗi string 
export async function verifyToken(token: string): Promise<UserPayload | null> {
  if (!token) return null;
  
  try {
    const secretValue = process.env.JWT_SECRET;
    if (!secretValue) {
        console.error("JWT_SECRET is not defined");
        return null;
    }
    const secretKey = new TextEncoder().encode(secretValue);
    
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    
    return payload as unknown as UserPayload;
  } catch (error) {
    // Token hết hạn hoặc không hợp lệ
    return null;
  }
}

// 3. Helper: Verify từ Request
export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get("token")?.value || "";
  return verifyToken(token);
}

// 4. Logic check role admin
export async function requireAdmin(request: NextRequest) {
  const payload = await requireAuth(request);
  return payload?.role === "admin" || payload?.role === "superadmin";
}