import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Please provide your email"],
            unique: true,
            trim: true, 
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Please provide your password"],
            select: false,
        },
        role: {
            type: String,
            enum: ["admin", "superadmin"],
            default: "admin",
            required: true,
        },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;