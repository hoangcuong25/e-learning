"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/hook/zod-schema/UserSchema";
import { LoginApi } from "@/api/auth.api";
import { useRouter } from "next/navigation";
import GoogleLoginForm from "@/components/GoogleLoginForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchUser } from "@/store/userSlice";
import banner from "@public/elearning-banner.png";
import { toast } from "sonner";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await LoginApi(data);
      localStorage.setItem("access_token", res.access_token);
      await dispatch(fetchUser());

      if (res.role === "ADMIN") {
        router.push("/admin/dashboard");
        toast.success("Đăng nhập thành công - Chuyển đến trang quản trị");
        return;
      }

      router.push("/");

      toast.success("Đăng nhập thành công");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Đăng nhập thất bại! Vui lòng kiểm tra lại email hoặc mật khẩu.";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden w-full max-w-5xl border border-blue-100"
      >
        {/* Left illustration */}
        <div className="hidden md:flex md:w-1/2 bg-blue-100 items-center justify-center p-6">
          <Image
            src={banner}
            alt="E-Learning illustration"
            className="rounded-xl object-contain"
            priority
          />
        </div>

        {/* Right form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">
            Chào mừng đến với EduSmart
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Đăng nhập để bắt đầu học tập cùng chúng tôi 🎓
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Nhập email"
                {...register("email")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           transition-all duration-200"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
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
                {...register("password")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           transition-all duration-200"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium
                         hover:bg-blue-700 shadow-md transition-all duration-200
                         disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting || loading ? "Đang xử lý..." : "Đăng nhập"}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm">Hoặc</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google login */}
          <GoogleLoginForm />

          <p className="mt-6 text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              href="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
