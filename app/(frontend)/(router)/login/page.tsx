"use client";

import React, { useState } from "react";
import Image from "next/image"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Input } from "@heroui/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

// --- 1. Validation Schema ---
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// --- 2. Static Styles (Moved outside component for performance) ---
const inputStyles = {
  label: "text-black/60 dark:text-white/90 font-semibold mb-2",
  input: [
    "bg-transparent",
    "text-black/90 dark:text-white/90",
    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
  ],
  inputWrapper: [
    "shadow-sm",
    "bg-default-100",
    "data-[hover=true]:bg-default-200",
    "group-data-[focus=true]:bg-white",
    "group-data-[focus=true]:ring-2",
    "group-data-[focus=true]:ring-ft-primary-blue-500/20", // UX: Focus ring
    "!cursor-text",
    "transition-all duration-200", // UX: Smooth transition
  ],
};

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  // --- 3. Form Setup ---
  const {
    register,
    control, // Needed for HeroUI Checkbox
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  // --- 4. Submit Logic ---
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await axios.post("/api/v1/auth/login", data);

      toast.success(response.data.message || "Welcome back!", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "bold",
        },
      });

      router.push("/");
    } catch (error: any) {
      console.error("Login Error:", error);
      const errorMessage =
        error.response?.data?.message || // Check for 'message' first
        error.response?.data?.error || // Then check for 'error'
        "Invalid credentials. Please try again.";

      toast.error(errorMessage, {
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex w-full h-screen bg-white overflow-hidden">
      <Toaster />

      {/* --- Left Section: Brand / Visuals --- */}
      <div
        className="hidden md:flex w-1/2 relative items-center justify-center p-12 overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: `
                radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.08) 0px, transparent 50%), 
                radial-gradient(at 100% 100%, rgba(234, 179, 8, 0.1) 0px, transparent 50%),
                radial-gradient(at 100% 0%, rgba(243, 244, 246, 0.5) 0px, transparent 50%)
            `,
        }}
      >
        <div className="absolute top-0 -left-10 w-72 h-72 bg-ft-primary-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-10 w-96 h-96 bg-ft-primary-yellow-500/5 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative z-10 flex flex-col items-center">
          <Link
            href="/"
            className="relative w-full aspect-[4/3] cursor-pointer hover:scale-105 transition-transform duration-300"
            title="Back to Home"
          >
            <Image
              src="https://d2uq10394z5icp.cloudfront.net/global/FTC-DefaultLogo-NoName.svg"
              alt="FinTech Club Logo"
              fill
              priority
              className="object-contain drop-shadow-xl"
            />
          </Link>
        </div>
      </div>

      {/* --- Right Section: Form --- */}
      <div className="flex w-full md:w-2/3 flex-col justify-center items-center px-6 md:px-10 bg-white relative z-20">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-left space-y-2">
            <h2 className="text-4xl font-extrabold text-center text-gray-900 tracking-tight">
              ADMIN PORTAL
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Email */}
            <Input
              {...register("email")}
              autoFocus
              placeholder="Enter your email address"
              variant="flat"
              radius="lg"
              size="lg"
              classNames={inputStyles}
              startContent={
                <Mail
                  className="text-default-400 pointer-events-none"
                  size={20}
                />
              }
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />

            {/* Password */}
            <div className="space-y-1">
              <Input
                {...register("password")}
                placeholder="Enter your password"
                variant="flat"
                radius="lg"
                size="lg"
                type={isVisible ? "text" : "password"}
                classNames={inputStyles}
                startContent={
                  <Lock
                    className="text-default-400 pointer-events-none"
                    size={20}
                  />
                }
                endContent={
                  <button
                    className="focus:outline-none text-default-400 hover:text-gray-700 transition-colors rounded-full p-1"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
              />
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    isSelected={field.value}
                    onValueChange={field.onChange}
                    classNames={{
                      label: "text-small text-gray-600 font-medium",
                      wrapper: "before:border-gray-300",
                    }}
                    size="sm"
                  >
                    Remember me
                  </Checkbox>
                )}
              />

              <button
                type="button"
                className="text-small text-ft-primary-blue-500 font-semibold hover:text-ft-primary-blue-600 hover:underline transition-all focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full bg-ft-primary-yellow hover:bg-ft-primary-yellow text-white font-bold text-md shadow-lg shadow-ft-primary-yellow-500/20 transition-transform active:scale-[0.98]"
            >
              {isSubmitting ? "Authenticating..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
