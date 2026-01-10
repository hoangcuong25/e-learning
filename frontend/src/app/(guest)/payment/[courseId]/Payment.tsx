"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { motion } from "framer-motion";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseDetail } from "@/store/slice/coursesSlice";
import { createEnrollment } from "@/store/slice/enrollmentsSlice";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { fetchCourseCoupons } from "@/store/slice/couponSlice";

const Payment = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { currentCourse, loading } = useSelector(
    (state: RootState) => state.courses
  );

  const { loading: enrolling } = useSelector(
    (state: RootState) => state.enrollment
  );

  const { courseCoupons } = useSelector((state: RootState) => state.coupon);

  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetail(Number(courseId)));
      dispatch(fetchCourseCoupons(Number(courseId)) as any);
    }
  }, [courseId, dispatch]);

  if (loading) return <LoadingScreen />;

  if (!currentCourse)
    return (
      <div className="text-center text-gray-500 mt-10">
        Không tìm thấy khóa học.
      </div>
    );

  const handlePayment = async () => {
    try {
      if (!courseId) return;

      const result = await dispatch(
        createEnrollment({
          courseId: Number(courseId),
          couponCode: selectedCoupon?.code, // gửi kèm coupon
        })
      ).unwrap();

      toast.success(`Thanh toán thành công! Bạn đã ghi danh vào khóa học.`);
      router.push(`/my-learning`);
    } catch (error: any) {
      toast.error(  
        error?.message || "Có lỗi xảy ra khi thanh toán, vui lòng thử lại."
      );
    }
  };

  const basePrice = currentCourse.price || 0;
  const discount = selectedCoupon
    ? selectedCoupon.discountPercent
      ? (basePrice * selectedCoupon.discountPercent) / 100
      : selectedCoupon.discountAmount || 0
    : 0;
  const total = Math.max(basePrice - discount, 0);

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
          <span className="font-medium">
            {basePrice.toLocaleString()} LearnCoin
          </span>
        </div>

        {/* COUPON DROPDOWN */}
        {courseCoupons && courseCoupons.length > 0 && (
          <div className="my-4">
            <label className="block text-gray-700 mb-2">Chọn mã giảm giá</label>
            <Select
              onValueChange={(value) => {
                const coupon = courseCoupons.find((c) => c.code === value);
                setSelectedCoupon(coupon || null);
              }}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Chọn coupon" />
              </SelectTrigger>
              <SelectContent>
                {courseCoupons.map((coupon) => (
                  <SelectItem key={coupon.code} value={coupon.code}>
                    {coupon.code} — giảm giá {coupon.percentage} %
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedCoupon && (
          <div className="flex justify-between text-gray-700 mt-3">
            <span>Mã áp dụng: {selectedCoupon.code}</span>
            <span className="text-green-600">
              - giảm{" "}
              {Math.round(
                (currentCourse.price * (selectedCoupon?.percentage || 0)) / 100
              ).toLocaleString()}{" "}
              LearnCoin
            </span>
          </div>
        )}

        <hr className="my-3 border-blue-100" />

        <div className="flex justify-between text-lg font-semibold text-blue-800">
          <span>Tổng cộng</span>
          <span>
            {(
              total -
              Math.round(
                (currentCourse.price * (selectedCoupon?.percentage || 0)) / 100
              )
            ).toLocaleString()}{" "}
            LearnCoin
          </span>
        </div>
      </div>

      {/* BUTTON */}
      <Button
        onClick={handlePayment}
        disabled={enrolling}
        className="w-full py-6 text-lg font-semibold flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition"
      >
        <CheckCircle className="w-5 h-5" />
        {enrolling ? "Đang xử lý..." : "Thanh toán"}
      </Button>
    </motion.div>
  );
};

export default Payment;
