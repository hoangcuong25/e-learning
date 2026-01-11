"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Lock, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { addToCart } from "@/store/slice/cartSlice";

// Định nghĩa lại props để bao gồm thông tin coupon
interface CourseSidebarProps {
  price: number;
  courseId: number;
  courseCoupons: any[];
  couponsLoading: boolean;
  couponsError: string | null;
}

const CourseSidebar = ({
  price,
  courseId,
  courseCoupons,
  couponsLoading,
  couponsError,
}: CourseSidebarProps) => {
  const router = useRouter();
  const [showAllCoupons, setShowAllCoupons] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.cart);

  // Lấy danh sách coupon hiển thị (tối đa 3 hoặc tất cả)
  const displayCoupons = showAllCoupons
    ? courseCoupons
    : Array.isArray(courseCoupons)
    ? courseCoupons.slice(0, 3)
    : [];

  const hasMoreCoupons =
    Array.isArray(courseCoupons) && courseCoupons.length > 3;

  const handleAddToCart = async () => {
    try {
      const result = await dispatch(addToCart(courseId)).unwrap();
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error: any) {
      toast.error(error || "Không thể thêm vào giỏ hàng");
    }
  };

  return (
    <motion.aside
      className="bg-white rounded-2xl shadow-xl p-6 sticky top-20 h-fit border border-gray-100"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="text-center mb-6">
        <motion.p
          className="text-3xl font-bold text-blue-600"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {price > 0 ? price.toLocaleString() + " LC" : "Miễn phí"}
        </motion.p>
        <p className="text-gray-500 text-sm">
          Thanh toán 1 lần - Truy cập trọn đời
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{
            scale: 1.06,
            boxShadow: "0 6px 18px rgba(37, 99, 235, 0.3)",
          }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition"
          onClick={() => router.push(`/payment/${courseId}`)}
        >
          Mua ngay
        </motion.button>

        <motion.button
          whileHover={{
            scale: 1.06,
            backgroundColor: "#EFF6FF",
            boxShadow: "0 6px 15px rgba(59, 130, 246, 0.2)",
          }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="w-full border border-blue-600 text-blue-600 font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
          disabled={loading}
          onClick={() => handleAddToCart()}
        >
          <ShoppingCart className="w-4 h-4" />
          Thêm vào giỏ hàng
        </motion.button>
      </div>
      <hr className="my-6 border-gray-200" />
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          🎟️ Coupon khả dụng
        </h3>

        {couponsLoading ? (
          <p className="text-sm text-yellow-700">Đang tải coupon...</p>
        ) : couponsError ? (
          <p className="text-sm text-red-500">{couponsError}</p>
        ) : !Array.isArray(courseCoupons) || courseCoupons.length === 0 ? (
          <p className="text-sm text-gray-600">
            Không có coupon nào cho khóa học này.
          </p>
        ) : (
          <>
            <ul className="space-y-2">
              {displayCoupons.map((coupon: any) => (
                <motion.li
                  key={coupon.id}
                  className="p-3 bg-white border rounded-lg flex justify-between items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <p className="font-semibold text-sm">{coupon.code}</p>
                    <p className="text-xs text-gray-500">
                      {coupon.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            {hasMoreCoupons && (
              <button
                onClick={() => setShowAllCoupons(!showAllCoupons)}
                className="w-full mt-3 text-blue-600 text-sm font-medium hover:text-blue-700 transition"
              >
                {showAllCoupons
                  ? "Thu gọn ▲"
                  : `Xem thêm ${courseCoupons.length - 3} coupon khác ▼`}
              </button>
            )}
          </>
        )}
      </div>
      <hr className="my-6 border-gray-200" />{" "}
      <motion.div
        className="space-y-3 text-gray-700 text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Truy cập không giới hạn</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Tài liệu và video chất lượng cao</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Cập nhật khóa học miễn phí</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-500" />
          <span>Bảo mật thanh toán an toàn</span>
        </div>
      </motion.div>
    </motion.aside>
  );
};

export default CourseSidebar;
