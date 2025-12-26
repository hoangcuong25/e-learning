"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { motion } from "framer-motion";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseDetail } from "@/store/coursesSlice";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, ArrowLeft } from "lucide-react";

const Payment = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { currentCourse, loading } = useSelector(
    (state: RootState) => state.courses
  );

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (courseId) dispatch(fetchCourseDetail(Number(courseId)));
  }, [courseId, dispatch]);

  if (loading) return <LoadingScreen />;

  if (!currentCourse)
    return (
      <div className="text-center text-gray-500 mt-10">
        Không tìm thấy khóa học.
      </div>
    );

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "GIAM10") {
      setDiscount((currentCourse.price || 0) * 0.1);
      setMessage("🎉 Mã GIAM10 đã được áp dụng: giảm 10% giá khóa học!");
    } else if (code === "NEWUSER") {
      setDiscount(20000);
      setMessage("🎉 Mã NEWUSER đã được áp dụng: giảm 20.000₫!");
    } else {
      setDiscount(0);
      setMessage("❌ Mã giảm giá không hợp lệ.");
    }
  };

  const total = currentCourse.price || 0;
  const finalTotal = Math.max(total - discount, 0);

  const handlePayment = async () => {
    alert(
      `✅ Thanh toán khóa học "${
        currentCourse.title
      }" với số tiền ${finalTotal.toLocaleString()}₫ thành công!`
    );
    router.push(`/courses/${courseId}`);
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Nút quay lại */}
      <Button
        variant="ghost"
        className="mb-4 text-gray-600 hover:text-blue-600"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      {/* HEADER */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-44 h-32 rounded-xl overflow-hidden border border-blue-100 shadow-sm">
          <Image
            src={currentCourse.thumbnail || "/images/default-course.jpg"}
            alt={currentCourse.title}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-blue-700">
            Thanh toán khóa học
          </h1>
          <p className="text-gray-600 text-lg">{currentCourse.title}</p>
        </div>
      </div>

      {/* PRICE INFO */}
      <div className="border border-blue-100 bg-blue-50/30 rounded-xl p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">
          💳 Thông tin thanh toán
        </h3>

        <div className="flex justify-between text-gray-700 mb-2">
          <span>Giá khóa học</span>
          <span className="font-medium">{total.toLocaleString()}₫</span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Input
            placeholder="Nhập mã giảm giá (VD: GIAM10)"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="border-blue-200 focus-visible:ring-blue-400"
          />
          <Button
            variant="secondary"
            onClick={handleApplyCoupon}
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          >
            Áp dụng
          </Button>
        </div>

        {message && (
          <p
            className={`text-sm mt-2 ${
              discount > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex justify-between text-gray-700 mt-4 mb-2">
          <span>Giảm giá</span>
          <span className="text-green-600 font-medium">
            -{discount.toLocaleString()}₫
          </span>
        </div>

        <hr className="my-3 border-blue-100" />

        <div className="flex justify-between text-lg font-semibold text-blue-800">
          <span>Tổng cộng</span>
          <span>{finalTotal.toLocaleString()}₫</span>
        </div>
      </div>

      {/* PAYMENT METHOD */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-blue-700 mb-4">
          Chọn phương thức thanh toán
        </h2>

        <label className="group flex items-center gap-4 p-5 border-2 border-blue-500 rounded-2xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
          <input
            type="radio"
            name="payment"
            defaultChecked
            className="hidden"
          />
          <div>
            <p className="font-medium text-gray-900">Thanh toán Online</p>
            <p className="text-sm text-gray-600">
              Hỗ trợ chuyển khoản tự động, xác nhận trong vài giây.
            </p>
          </div>
        </label>

        <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-blue-100">
          <p>
            • Sau khi thanh toán thành công, hệ thống sẽ tự động kích hoạt khóa
            học.
          </p>
        </div>
      </div>

      {/* BUTTON */}
      <Button
        onClick={handlePayment}
        className="w-full py-6 text-lg font-semibold flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition"
      >
        <CheckCircle className="w-5 h-5" />
        Thanh toán Online
      </Button>
    </motion.div>
  );
};

export default Payment;
