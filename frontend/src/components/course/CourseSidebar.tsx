"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Lock, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { addToCart } from "@/store/slice/common/cartSlice";

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

  const displayCoupons = showAllCoupons
    ? courseCoupons
    : Array.isArray(courseCoupons)
    ? courseCoupons.slice(0, 3)
    : [];

  const hasMoreCoupons =
    Array.isArray(courseCoupons) && courseCoupons.length > 3;

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCart(courseId)).unwrap();
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error: any) {
      toast.error(error || "Không thể thêm vào giỏ hàng");
    }
  };

  return (
    <motion.aside
      className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-8 border border-slate-100 space-y-8"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "circOut" }}
    >
      <div className="text-center space-y-2">
        <motion.p
          className="text-4xl font-black text-indigo-600 tracking-tighter"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {price > 0 ? price.toLocaleString() + " LC" : "MIỄN PHÍ"}
        </motion.p>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
          Truy cập trọn đời • Hỗ trợ 24/7
        </p>
      </div>

      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase tracking-widest text-xs"
          onClick={() => router.push(`/payment/${courseId}`)}
        >
          Mua ngay khóa học
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full border border-slate-200 bg-white text-slate-900 font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:border-indigo-600 hover:text-indigo-600 transition-all uppercase tracking-widest text-xs"
          disabled={loading}
          onClick={() => handleAddToCart()}
        >
          <ShoppingCart size={18} />
          Thêm vào giỏ hàng
        </motion.button>
      </div>

      {price > 0 && (
        <div className="pt-6 border-t border-slate-50 space-y-4">
          <h3 className="font-black text-xs text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
            🎟️ Mã giảm giá
          </h3>

          {couponsLoading ? (
            <div className="py-4 flex justify-center">
               <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : couponsError ? (
            <p className="text-xs text-red-400 font-bold">{couponsError}</p>
          ) : !Array.isArray(courseCoupons) || courseCoupons.length === 0 ? (
            <p className="text-xs text-slate-300 font-medium">Hiện không có mã giảm giá nào.</p>
          ) : (
            <>
              <div className="space-y-2">
                {displayCoupons.map((coupon: any) => (
                  <motion.div
                    key={coupon.id}
                    className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center group hover:bg-indigo-50 hover:border-indigo-100 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div>
                      <p className="font-black text-sm text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{coupon.code}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {coupon.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {hasMoreCoupons && (
                <button
                  onClick={() => setShowAllCoupons(!showAllCoupons)}
                  className="w-full text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:text-indigo-500 pt-2"
                >
                  {showAllCoupons ? "Thu gọn ▲" : `Xem thêm ${courseCoupons.length - 3} mã khác ▼`}
                </button>
              )}
            </>
          )}
        </div>
      )}

      <div className="pt-6 border-t border-slate-50 space-y-4">
        {[
          { icon: <CheckCircle size={16} />, text: "Truy cập không giới hạn" },
          { icon: <CheckCircle size={16} />, text: "Hỗ trợ học tập trực tuyến" },
          { icon: <CheckCircle size={16} />, text: "Cập nội dung mới" },
          { icon: <Lock size={16} />, text: "Thanh toán bảo mật" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-slate-900 font-bold text-[11px] uppercase tracking-wider">
            <span className="text-emerald-500">{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </motion.aside>
  );
};

export default CourseSidebar;
