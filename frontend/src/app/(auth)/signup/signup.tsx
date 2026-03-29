"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterApi } from "@/store/api/common/auth.api";
import { RegisterFormData, registerSchema } from "@/hook/zod-schema/UserSchema";
import banner from "@public/elearning-banner.png";
import logo from "@public/logo.png";
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
      toast.success("Đăng ký thành công - Hãy đăng nhập");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 sm:p-10 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

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
                <pattern id="grid-signup" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-signup)" />
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
                alt="E-learning illustration"
                className="rounded-3xl object-contain shadow-2xl transition-transform hover:scale-105 duration-700"
                priority
              />
            </motion.div>
            <div className="space-y-4 pt-4">
               <h3 className="text-2xl font-black text-white leading-tight">Gia nhập cộng đồng EduSmart</h3>
               <p className="text-slate-400 text-sm font-medium">Bắt đầu hành trình chinh phục kiến thức mới và phát triển sự nghiệp của bạn.</p>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-7/12 p-10 md:p-16 flex flex-col justify-center">
          {/* Header */}
          <div className="mb-10">
            <Link href="/" className="inline-block group mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-2xl group-hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                  <Image src={logo} alt="EduSmart Logo" width={32} height={32} className="invert brightness-0" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tighter uppercase tracking-widest">EduSmart</span>
              </div>
            </Link>
            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Tạo tài khoản</h2>
            <p className="text-slate-400 font-medium italic">Trở thành học viên chính thức trong 30 giây ⏱️</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Fullname */}
              <div className="sm:col-span-2 space-y-1.5 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
                  Họ và tên của bạn
                </label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  {...register("fullname")}
                  className="w-full pl-5 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all duration-300 font-bold text-slate-900 placeholder:text-slate-300 outline-none"
                />
                {errors.fullname && (
                  <p className="mt-1 text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">
                    {errors.fullname.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="sm:col-span-2 space-y-1.5 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  placeholder="student@edusmart.com"
                  {...register("email")}
                  className="w-full pl-5 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all duration-300 font-bold text-slate-900 placeholder:text-slate-300 outline-none"
                />
                {errors.email && (
                  <p className="mt-1 text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password1")}
                  className="w-full pl-5 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all duration-300 font-bold text-slate-900 placeholder:text-slate-300 outline-none"
                />
                {errors.password1 && (
                  <p className="mt-1 text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">
                    {errors.password1.message}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
                  Xác nhận lại
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password2")}
                  className="w-full pl-5 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all duration-300 font-bold text-slate-900 placeholder:text-slate-300 outline-none"
                />
                {errors.password2 && (
                  <p className="mt-1 text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">
                    {errors.password2.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-white py-4.5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all duration-300 disabled:opacity-60 cursor-pointer overflow-hidden relative group mt-4"
            >
              <div className="absolute inset-0 bg-indigo-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 pointer-events-none" />
              <span className="relative z-10">
                {isSubmitting ? "Đang xử lý..." : "Đăng ký ngay"}
              </span>
            </motion.button>
          </form>

          {/* Link to login */}
          <p className="mt-10 text-center text-xs font-bold text-slate-400">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="text-indigo-600 font-black uppercase tracking-widest hover:text-indigo-700 transition-colors ml-2"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

