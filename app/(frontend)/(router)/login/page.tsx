"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Input, Spinner } from "@heroui/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

// --- 1. Zod Validation Schema ---
// Strong validation ensures bad data is caught early (Security & UX)
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const inputStyles = {
  label: "!text-gray-600 dark:!text-white/90 font-semibold mb-1.5",
  input: [
    "bg-transparent",
    "!text-gray-900 dark:!text-white",
    "placeholder:!text-gray-400 dark:placeholder:!text-gray-500",
  ],
  inputWrapper: [
    "shadow-sm",
    "bg-gray-50",
    "border-1 border-gray-200", // Subtle border for better definition
    "data-[hover=true]:bg-gray-100",
    "group-data-[focus=true]:bg-white",
    "group-data-[focus=true]:!border-[#3B82F6]", // Hardcoded Blue Focus Border
    "group-data-[focus=true]:!ring-2",
    "group-data-[focus=true]:!ring-[#3B82F6]/20", // Hardcoded Blue Ring
    "!cursor-text",
    "transition-all duration-200",
  ],
};

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    control,
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

  // --- 4. Secure Submit Handler ---
  const onSubmit = async (data: LoginFormValues) => {
    try {
      // API call
      const response = await axios.post("/api/v1/auth/login", data);

      // Success Feedback
      toast.success(response.data.message || "Welcome back, Admin!", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "600",
        },
        icon: "🚀",
      });

      window.location.href = "/";
    } catch (error: any) {
      console.error("Login Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid credentials. Please check your email and password.";

      toast.error(errorMessage, {
        position: "top-center",
        style: {
          background: "#EF4444", // Red-500
          color: "#fff",
          fontWeight: "600",
        },
      });
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-white overflow-hidden font-sans">
      <Toaster />

      {/* --- Left Section: Visual Branding --- */}
      <div
        className="hidden lg:flex w-1/2 relative items-center justify-center p-16"
        style={{
          background: "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
        }}
      >
        {/* Abstract Background Shapes */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30 blur-[100px]"
          style={{ background: "#3B82F6" }} // Brand Blue
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "#EAB308" }}
        />

        <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
          {/* Logo Link */}
          <Link
            href="/"
            className="relative w-96 aspect-square mb-8 transition-transform hover:scale-105 duration-300 ease-out"
            aria-label="Back to Homepage"
          >
            <Image
              src="https://d2uq10394z5icp.cloudfront.net/global/FTC-Logo.png"
              alt="FinTech Club Logo"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain drop-shadow-2xl"
            />
          </Link>
        </div>
      </div>

      {/* --- Right Section: Login Form --- */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center items-center px-6 sm:px-12 lg:px-24 bg-white relative z-20">
        <div className="w-full max-w-[420px] space-y-10">
          {/* Header */}
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 text-center tracking-tight">
              Admin Portal
            </h2>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
            noValidate
          >
            {/* Email Field */}
            <Input
              {...register("email")}
              autoFocus
              type="email"
              label="Email Address"
              placeholder="Enter your email address"
              variant="flat"
              labelPlacement="outside-top"
              radius="md"
              size="lg"
              classNames={inputStyles}
              startContent={
                <Mail
                  className="text-gray-400 pointer-events-none mr-2"
                  size={20}
                />
              }
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              autoComplete="username" // Security Best Practice
            />

            {/* Password Field */}
            <div className="space-y-1">
              <Input
                {...register("password")}
                label="Password"
                placeholder="Enter your password"
                variant="flat"
                labelPlacement="outside-top"
                radius="md"
                size="lg"
                type={isVisible ? "text" : "password"}
                classNames={inputStyles}
                startContent={
                  <Lock
                    className="text-gray-400 pointer-events-none mr-2"
                    size={20}
                  />
                }
                endContent={
                  <button
                    className="focus:outline-none text-gray-400 hover:text-gray-600 transition-colors p-1"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                  >
                    {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                autoComplete="current-password" // Security Best Practice
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              spinner={<Spinner color="white" size="sm" />}
              className="w-full bg-ft-primary-yellow text-white font-bold text-base shadow-lg shadow-orange-500/20 transition-all hover:opacity-90 active:scale-[0.98] h-12 rounded-lg"
            >
              {isSubmitting ? (
                "Signing In..."
              ) : (
                <span className="flex items-center gap-2">Sign In</span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
