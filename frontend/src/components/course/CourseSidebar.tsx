"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Lock, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface CourseSidebarProps {
  price: number;
  courseId: number;
}

const CourseSidebar = ({ price, courseId }: CourseSidebarProps) => {
  const router = useRouter();

  return (
    <motion.aside
      className="bg-white rounded-2xl shadow-xl p-6 sticky top-20 h-fit border border-gray-100"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Giá */}
      <div className="text-center mb-6">
        <motion.p
          className="text-3xl font-bold text-blue-600"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {price.toLocaleString()} ₫
        </motion.p>
        <p className="text-gray-500 text-sm">
          Thanh toán 1 lần - Truy cập trọn đời
        </p>
      </div>

      {/* Nút hành động */}
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
            backgroundColor: "#EFF6FF", // blue-50
            boxShadow: "0 6px 15px rgba(59, 130, 246, 0.2)",
          }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="w-full border border-blue-600 text-blue-600 font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Thêm vào giỏ hàng
        </motion.button>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* Thông tin khóa học */}
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
