/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import banner from "@public/elearning-banner.png";

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

  // ===== Animation variants =====
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden w-full max-w-5xl border border-blue-100"
      >
        {/* Left Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-blue-100 items-center justify-center p-6">
          <Image
            src={banner}
            alt="E-learning banner"
            className="rounded-xl object-contain"
            priority
          />
        </div>

        {/* Right Form Area */}
        <div className="w-full md:w-1/2 p-8">
          {!isEmailSent && (
            <motion.form
              onSubmit={onSubmitEmail}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="space-y-5"
            >
              <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
                Quên mật khẩu
              </h1>
              <p className="text-center text-gray-500 mb-6 text-sm">
                Nhập email bạn đã đăng ký để nhận mã xác thực
              </p>

              <input
                type="email"
                placeholder="Nhập địa chỉ email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
              >
                {isLoading ? "Đang xử lý..." : "Gửi mã OTP"}
              </button>
            </motion.form>
          )}

          {!isOtpSubmitted && isEmailSent && (
            <motion.form
              onSubmit={onSubmitOTP}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="space-y-5"
            >
              <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
                Xác minh OTP
              </h1>
              <p className="text-center text-gray-500 mb-6 text-sm">
                Nhập mã 6 chữ số đã được gửi đến email của bạn
              </p>

              <div className="flex justify-between mb-8" onPaste={handlePaste}>
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 bg-gray-100 border border-gray-300 rounded-lg text-center text-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      ref={(e) => {
                        inputRefs.current[index] = e;
                      }}
                      onInput={(e) => handleInput(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Xác nhận OTP
              </button>
            </motion.form>
          )}

          {isOtpSubmitted && isEmailSent && (
            <motion.form
              onSubmit={onSubmitNewPassword}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="space-y-5"
            >
              <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
                Mật khẩu mới
              </h1>
              <p className="text-center text-gray-500 mb-6 text-sm">
                Nhập mật khẩu mới để hoàn tất quá trình đặt lại
              </p>

              <div className="relative">
                <input
                  type={isShowPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                {isShowPassword ? (
                  <FaRegEye
                    onClick={() => setIsShowPassword(false)}
                    className="absolute top-3.5 right-3.5 cursor-pointer text-gray-600"
                  />
                ) : (
                  <FaRegEyeSlash
                    onClick={() => setIsShowPassword(true)}
                    className="absolute top-3.5 right-3.5 cursor-pointer text-gray-600"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Đổi mật khẩu
              </button>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
