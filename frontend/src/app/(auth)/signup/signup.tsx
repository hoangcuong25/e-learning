"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RegisterApi } from "@/api/auth.api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/hook/zod-schema/UserSchema";

export default function SignupPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onBlur", // validate khi blur ra khỏi field
        reValidateMode: "onChange", // validate lại khi user thay đổi input
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await RegisterApi(data);
            router.push("/login");
        } catch (err: any) {
            alert(err.response?.data?.message || err.message || "Đăng ký thất bại");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6 my-3 rounded-2xl">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fadeInUp">
                <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Đăng ký</h2>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    {/* Fullname */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                        <input
                            type="text"
                            placeholder="Nhập họ và tên"
                            {...register("fullname")}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-green-300 focus:outline-none transition-all duration-300"
                        />
                        {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Nhập email"
                            {...register("email")}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-green-300 focus:outline-none transition-all duration-300"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            {...register("password1")}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-green-300 focus:outline-none transition-all duration-300"
                        />
                        {errors.password1 && <p className="text-red-500 text-sm">{errors.password1.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            {...register("password2")}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-green-300 focus:outline-none transition-all duration-300"
                        />
                        {errors.password2 && <p className="text-red-500 text-sm">{errors.password2.message}</p>}
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 active:scale-95 transition-transform duration-200 disabled:opacity-50"
                    >
                        {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="px-4 text-gray-500 text-sm">Hoặc</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Social login */}
                <div className="space-y-3">
                    <button className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all duration-200">
                        <img src="/google.svg" alt="Google" className="w-5 h-5" />
                        Đăng ký với Google
                    </button>
                </div>

                {/* Link to login */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Đã có tài khoản?{" "}
                    <Link href="/login" className="text-green-600 hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </div>

            {/* Animation */}
            <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
        </div>
    );
}
