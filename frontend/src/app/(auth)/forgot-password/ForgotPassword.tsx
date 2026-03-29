/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import banner from "@public/elearning-banner.png";
import logo from "@public/logo.png";

export default function ForgotPassword() {
  axios.defaults.withCredentials = true;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ===== OTP input handlers =====
  const handleInput = (e: any, index: number) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: any) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char: any, index: number) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index]!.value = char;
      }
    });
  };

  // ===== Step 1: Submit email =====
  const onSubmitEmail = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/send-reset-otp`,
        { email }
      );
      if (data.statusCode === 201) {
        setIsEmailSent(true);
        toast.success("Mã OTP đã được gửi đến email của bạn");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gửi mã thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  // ===== Step 2: Verify OTP =====
  const onSubmitOTP = async (e: any) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e: any) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  // ===== Step 3: Reset password =====
  const onSubmitNewPassword = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/reset-password`,
        { email, otp, newPassword }
      );
      if (data.statusCode === 201) {
        router.push("/login");
        toast.success("Đổi mật khẩu thành công");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Thay đổi mật khẩu thất bại"
      );
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
                <pattern id="grid-forgot" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-forgot)" />
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
                alt="E-learning banner"
                className="rounded-3xl object-contain shadow-2xl transition-transform hover:scale-105 duration-700"
                priority
              />
            </motion.div>
            <div className="space-y-4 pt-4">
               <h3 className="text-2xl font-black text-white leading-tight">Bảo vệ tài khoản của bạn</h3>
               <p className="text-slate-400 text-sm font-medium">Chúng tôi sẽ giúp bạn khôi phục quyền truy cập một cách an toàn và nhanh chóng.</p>
            </div>
          </div>
        </div>

        {/* Right Form Area */}
        <div className="w-full md:w-7/12 p-10 md:p-16 flex flex-col justify-center">
          {/* Header */}
          <div className="mb-12">
            <Link href="/login" className="inline-block group mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-2xl group-hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 text-white">
                  <Image src={logo} alt="EduSmart Logo" width={32} height={32} className="invert brightness-0" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tighter uppercase tracking-widest leading-none">EduSmart</span>
              </div>
            </Link>

            {!isEmailSent && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Quên mật khẩu?</h2>
                <p className="text-slate-400 font-medium italic">Nhập email để nhận mã xác thực OTP 📧</p>
              </motion.div>
            )}

            {!isOtpSubmitted && isEmailSent && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Xác thực OTP</h2>
                <p className="text-slate-400 font-medium italic">Chúng tôi vừa gửi mã 6 chữ số đến {email} 📥</p>
              </motion.div>
            )}

            {isOtpSubmitted && isEmailSent && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Mật khẩu mới</h2>
                <p className="text-slate-400 font-medium italic">Thiết lập mật khẩu bảo mật hơn cho tài khoản của bạn 🔑</p>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            {!isEmailSent && (
              <motion.form
                onSubmit={onSubmitEmail}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="space-y-1.5 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
                    Email đã đăng ký
                  </label>
                  <input
                    type="email"
                    placeholder="student@edusmart.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-5 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all duration-300 font-bold text-slate-900 placeholder:text-slate-300 outline-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all duration-300 disabled:opacity-60 cursor-pointer overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-indigo-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 pointer-events-none" />
                  <span className="relative z-10">{isLoading ? "Đang xử lý..." : "Gửi mã xác nhận"}</span>
                </motion.button>
              </motion.form>
            )}

            {!isOtpSubmitted && isEmailSent && (
              <motion.form
                onSubmit={onSubmitOTP}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex justify-between gap-3" onPaste={handlePaste}>
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        placeholder="0"
                        className="w-full aspect-square bg-slate-50 border border-slate-100 rounded-2xl text-center text-xl font-black text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all duration-300 placeholder:text-slate-200 outline-none"
                        ref={(e) => {
                          inputRefs.current[index] = e;
                        }}
                        onInput={(e) => handleInput(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                    ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all duration-300 cursor-pointer overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-indigo-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 pointer-events-none" />
                  <span className="relative z-10">Xác nhận mã OTP</span>
                </motion.button>
              </motion.form>
            )}

            {isOtpSubmitted && isEmailSent && (
              <motion.form
                onSubmit={onSubmitNewPassword}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="space-y-1.5 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
                    Mật khẩu mới an toàn
                  </label>
                  <div className="relative">
                    <input
                      type={isShowPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full pl-5 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all duration-300 font-bold text-slate-900 placeholder:text-slate-300 outline-none"
                    />
                    <div
                      onClick={() => setIsShowPassword(!isShowPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {isShowPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all duration-300 cursor-pointer overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-indigo-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 pointer-events-none" />
                  <span className="relative z-10">Cập nhật mật khẩu</span>
                </motion.button>
              </motion.form>
            )}
            
            <p className="mt-8 text-center text-xs font-bold text-slate-400">
              Quay lại trang{" "}
              <Link
                href="/login"
                className="text-indigo-600 font-black uppercase tracking-widest hover:text-indigo-700 transition-colors ml-2"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

