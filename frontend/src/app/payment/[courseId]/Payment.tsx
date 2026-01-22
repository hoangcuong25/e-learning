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
    const code = coupon.trim().toLowerCase();
    if (code === "freeship") {
      setDiscount(10000);
      setMessage("🎉 Coupon FREESHIP đã được áp dụng: giảm 10.000₫!");
    } else if (code === "newuser") {
      setDiscount(20000);
      setMessage("🎉 Coupon NEWUSER đã được áp dụng: giảm 20.000₫!");
    } else {
      setDiscount(0);
      setMessage("❌ Mã giảm giá không hợp lệ.");
    }
  };

  const total = currentCourse.price || 0;
  const finalTotal = Math.max(total - discount, 0);

  const handlePayment = async () => {
    // TODO: Gọi API thanh toán Sepay thật
    alert(
      `Thanh toán khóa học "${
        currentCourse.title
      }" với số tiền ${finalTotal.toLocaleString()}₫ thành công!`
    );
    router.push(`/courses/${courseId}`);
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
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
      <div className="flex items-center gap-5 mb-6">
        <div className="relative w-40 h-40 rounded-2xl overflow-hidden border">
          <Image
            src={currentCourse.thumbnail || "/images/default-course.jpg"}
            alt={currentCourse.title}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Thanh toán khóa học
          </h1>
          <p className="text-gray-600">{currentCourse.title}</p>
        </div>
      </div>

      {/* PRICE INFO */}
      <div className="border-t border-b py-6 mb-8">
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Giá khóa học</span>
          <span className="font-medium">{total.toLocaleString()}₫</span>
        </div>

        {/* COUPON INPUT */}
        <div className="flex items-center gap-2 mt-3">
          <Input
            placeholder="Nhập mã giảm giá (vd: LEARNONLINE)"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <Button variant="outline" onClick={handleApplyCoupon}>
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
          <span className="font-medium text-green-600">
            -{discount.toLocaleString()}₫
          </span>
        </div>

        <hr className="my-3" />
        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Tổng cộng</span>
          <span>{finalTotal.toLocaleString()}₫</span>
        </div>
      </div>

      {/* PAYMENT METHOD — SEPAY */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
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

        <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border">
          <p>
            • Sau khi thanh toán thành công, hệ thống sẽ tự động kích hoạt khóa
            học.
          </p>
        </div>
      </div>

      {/* BUTTON */}
      <Button
        onClick={handlePayment}
        className="w-full py-6 text-lg font-semibold flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <CheckCircle className="w-5 h-5" />
        Thanh toán Online
      </Button>
    </motion.div>
  );
};

export default Payment;
