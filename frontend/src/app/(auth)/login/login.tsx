"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/hook/zod-schema/UserSchema";
import { LoginApi } from "@/store/api/common/auth.api";
import { useRouter } from "next/navigation";
import GoogleLoginForm from "@/components/GoogleLoginForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchUser } from "@/store/slice/common/userSlice";
import banner from "@public/elearning-banner.png";
import { toast } from "sonner";
import logo from "@public/logo.png";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 sm:p-10 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden w-full max-w-5xl border border-slate-100 relative z-10"
      >
        {/* Left Illustration Section */}
        <div className="hidden md:flex md:w-5/12 bg-slate-900 items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 opacity-90" />
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative z-10 space-y-8 text-center max-w-xs">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Image
                src={banner}
                alt="E-Learning illustration"
                className="rounded-3xl object-contain shadow-2xl transition-transform hover:scale-105 duration-700"
                priority
              />
            </motion.div>
            <div className="space-y-4 pt-4">
               <h3 className="text-2xl font-black text-white leading-tight">Mở khóa tri thức cùng EduSmart</h3>
               <p className="text-slate-400 text-sm font-medium">Khám phá hàng ngàn khóa học chất lượng cao từ các chuyên gia hàng đầu ngay hôm nay.</p>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-7/12 p-10 md:p-16 flex flex-col justify-center">
          {/* Header */}
          <div className="mb-12">
            <Link href="/" className="inline-block group mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-2xl group-hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                  <Image src={logo} alt="EduSmart Logo" width={32} height={32} className="invert brightness-0" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tighter uppercase tracking-widest">EduSmart</span>
              </div>
            </Link>
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Chào mừng trở lại</h2>
            <p className="text-slate-400 font-medium italic">Đăng nhập để tiếp tục hành trình học tập 🚀</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
                  Email học viên
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="example@email.com"
                    {...register("email")}
                    className="w-full pl-5 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all duration-300 font-bold text-slate-900 placeholder:text-slate-300 outline-none"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5 group">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">
                    Mật khẩu bí mật
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-widest transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className="w-full pl-5 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all duration-300 font-bold text-slate-900 placeholder:text-slate-300 outline-none"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all duration-300 disabled:opacity-60 cursor-pointer overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-indigo-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 pointer-events-none" />
              <span className="relative z-10">
                {isSubmitting || loading ? "Đang đồng bộ..." : "Đăng nhập ngay"}
              </span>
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-10 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Hoặc tiếp tục với</span>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>

          {/* Google login */}
          <div className="scale-105">
            <GoogleLoginForm />
          </div>

          <p className="mt-12 text-center text-xs font-bold text-slate-400">
            Chưa có tài khoản?{" "}
            <Link
              href="/signup"
              className="text-indigo-600 font-black uppercase tracking-widest hover:text-indigo-700 transition-colors ml-2"
            >
              Tạo tài khoản học viên
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

