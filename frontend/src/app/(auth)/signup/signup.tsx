"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterApi } from "@/api/auth.api";
import { RegisterFormData, registerSchema } from "@/hook/zod-schema/UserSchema";
import banner from "@public/elearning-banner.png"; // ảnh minh họa e-learning
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await RegisterApi(data);
      router.push("/login");

      toast.success("Đăng ký thành công");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại" );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden w-full max-w-5xl border border-blue-100"
      >
        {/* Left illustration */}
        <div className="hidden md:flex md:w-1/2 bg-blue-100 items-center justify-center p-6">
          <Image
            src={banner}
            alt="E-learning illustration"
            className="rounded-xl object-contain"
            priority
          />
        </div>

        {/* Right form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">
            Tạo tài khoản học tập
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Tham gia cùng hàng ngàn học viên khác trên EduSmart 🎓
          </p>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Fullname */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                placeholder="Nhập họ và tên"
                {...register("fullname")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              {errors.fullname && (
                <p className="text-red-500 text-sm">
                  {errors.fullname.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Nhập email"
                {...register("email")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                {...register("password1")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              {errors.password1 && (
                <p className="text-red-500 text-sm">
                  {errors.password1.message}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                {...register("password2")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              {errors.password2 && (
                <p className="text-red-500 text-sm">
                  {errors.password2.message}
                </p>
              )}
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </motion.button>
          </form>

          {/* Link to login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
