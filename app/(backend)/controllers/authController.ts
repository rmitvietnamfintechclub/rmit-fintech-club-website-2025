import User from "@/app/(backend)/models/user";
import bcryptjs from "bcryptjs";
import { SignJWT } from "jose";

const ALLOWED_ROLES = ["admin", "superadmin"];

// --- Service: Login ---
export async function loginUser(email: string, password: string) {
    const user = await User.findOne({ email }).select("+password").lean() as any;

    const genericError = new Error("Invalid email or password");

    if (!user) {
        throw genericError;
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
        throw genericError;
    }

    if (!ALLOWED_ROLES.includes(user.role)) {
         throw new Error("Access denied: You do not have permission to access the admin portal.");
    }

    const jwtSecretKey = process.env.JWT_SECRET;
    if (!jwtSecretKey) throw new Error("JWT_SECRET is not defined");
    
    const secretKey = new TextEncoder().encode(jwtSecretKey);
    
    const token = await new SignJWT({
        id: user._id,
        email: user.email,
        role: user.role,
    })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 day")
    .sign(secretKey);

    return token;
}

export async function registerUser(data: any) {
    const { email, password, role } = data;

    // Validate input
    if (!email || !password) {
        throw new Error("Missing email or password");
    }

    const assignRole = (role && ALLOWED_ROLES.includes(role)) ? role : "admin";

    // Check exist
    const userExists = await User.findOne({ email }).lean();
    if (userExists) {
        throw new Error("User already exists");
    }

    // Hash Password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create User
    const newUser = await User.create({
        email,
        password: hashedPassword,
        role: assignRole, 
    });

    return { 
        _id: newUser._id, 
        email: newUser.email, 
        role: newUser.role 
    };
}