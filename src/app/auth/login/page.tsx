"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";
import { AuthService } from "@/lib/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true);
            const response = await AuthService.login(data);
            await login(response.accessToken, data.rememberMe);
            router.replace("/dashboard");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to sign in",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm">
                    <div className="flex flex-col items-center space-y-6">
                        {/* Logo */}
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={120}
                            height={40}
                            className="dark:invert"
                        />

                        <div className="text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Log in
                            </h1>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="w-full space-y-3">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {/* Implement Google login */ }}
                            >
                                <Image src="/google.svg" alt="Google" width={20} height={20} />
                                Log in with Google
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {/* Implement Microsoft login */ }}
                            >
                                <Image src="/microsoft.svg" alt="Microsoft" width={20} height={20} />
                                Log in with Microsoft
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {/* Implement Organization login */ }}
                            >
                                Log in with your Organization
                            </Button>
                        </div>

                        {/* OR Divider */}
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">OR</span>
                            </div>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                            <div>
                                <Input
                                    {...register("email")}
                                    type="email"
                                    placeholder="Work Email"
                                    error={!!errors.email}
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    error={!!errors.password}
                                    disabled={isLoading}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300"
                                        {...register("rememberMe")}
                                    />
                                    <span className="text-sm text-gray-600">Keep me signed in</span>
                                </label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-500"
                                >
                                    Reset it Here
                                </Link>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Log in"
                                )}
                            </Button>
                        </form>

                        <div className="text-center text-sm">
                            Don't have an account?{" "}
                            <Link
                                href="/auth/register"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side blue section */}
            <div className="relative hidden w-0 flex-1 lg:block bg-blue-600">
                <div className="flex flex-col items-center justify-center h-full text-white p-8">
                    <h2 className="text-3xl font-bold mb-4">600,000+</h2>
                    <p className="text-center text-lg">
                        Salespeople, recruiters, and marketers use our extension to find Mobile Numbers & Emails directly from LinkedIn.
                    </p>

                </div>
            </div>
        </div>
    );
} 